import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../configs/mongodb.js'
import connectCloudinary from '../configs/cloudinary.js'

// Import controllers
import { clerkWebhooks, stripeWebhooks } from '../controllers/webhooks.js'
import courseRouter from '../routes/courseRoute.js'
import userRouter from '../routes/userRoutes.js'

const app = express()

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

// Basic middlewares
app.use(cors())
app.use(express.json())

// Middleware to ensure connections are initialized for routes that need DB
app.use('/api', async (req, res, next) => {
    try {
        await initializeConnections()
        next()
    } catch (error) {
        res.status(500).json({ error: 'Server initialization failed' })
    }
})

app.use('/stripe', async (req, res, next) => {
    try {
        await initializeConnections()
        next()
    } catch (error) {
        res.status(500).json({ error: 'Server initialization failed' })
    }
})

app.use('/clerk', async (req, res, next) => {
    try {
        await initializeConnections()
        next()
    } catch (error) {
        res.status(500).json({ error: 'Server initialization failed' })
    }
})

// Simple routes
app.get('/', (req, res) => res.send("API Working"))
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        connections: {
            database: connectionsInitialized
        },
        env: {
            hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
            hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
            hasMongoURL: !!process.env.MONGODB_URL
        }
    })
})

// Essential routes
app.post('/clerk', clerkWebhooks)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks)

export default app
