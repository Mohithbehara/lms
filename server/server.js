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

//connect to db
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

//Routes
console.log('Setting up routes...')
app.use('/api/educator', (req, res, next) => {
    console.log(`Educator route hit: ${req.method} ${req.path}`)
    next()
}, educatorRouter)
app.post('/clerk', clerkWebhooks)
app.get('/',(req,res)=>res.send("API Working"));
app.use('/api/course', express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type:'application/json'}), stripeWebhooks)



//PORT
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})