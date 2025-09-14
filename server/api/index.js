import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// Import only the webhook controller
import { stripeWebhooks } from '../controllers/webhooks.js'

const app = express()

// Basic middlewares
app.use(cors())
app.use(express.json())

// Simple routes
app.get('/', (req, res) => res.send("API Working"))
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        env: {
            hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
            hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
            hasMongoURL: !!process.env.MONGODB_URL
        }
    })
})

// Add webhook route
app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks)

export default app
