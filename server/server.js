import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'

//Initialize Express
const app=express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// Connection state
let connectionsInitialized = false

// Initialize connections lazily
const initializeConnections = async () => {
    if (connectionsInitialized) return
    
    try {
        await connectDB()
        await connectCloudinary()
        connectionsInitialized = true
        console.log('Database and Cloudinary connected successfully')
    } catch (error) {
        console.error('Connection initialization failed:', error)
        throw error
    }
}

// Middleware to ensure connections are initialized
app.use(async (req, res, next) => {
    try {
        await initializeConnections()
        next()
    } catch (error) {
        res.status(500).json({ error: 'Server initialization failed' })
    }
})

//Routes
console.log('Setting up routes...')
app.use('/api/educator', (req, res, next) => {
    console.log(`Educator route hit: ${req.method} ${req.path}`)
    next()
}, educatorRouter)
app.post('/clerk', clerkWebhooks)
app.get('/',(req,res)=>res.send("API Working"));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        connections: {
            database: connectionsInitialized,
            stripe: !!process.env.STRIPE_SECRET_KEY,
            webhook: !!process.env.STRIPE_WEBHOOK_SECRET
        }
    });
});
app.use('/api/course', express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type:'application/json'}), stripeWebhooks)



// Export for Vercel serverless functions
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}
