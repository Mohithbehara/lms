import express from 'express'
import cors from 'cors'

const app = express()

// Basic middlewares
app.use(cors())
app.use(express.json())

// Simple routes
app.get('/', (req, res) => res.send("API Working - Webhook at /stripe"))
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'Use /api/stripe endpoint for webhooks'
    })
})

export default app
