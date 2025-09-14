export default function handler(req, res) {
  try {
    res.status(200).json({ 
      message: 'Test endpoint working',
      method: req.method,
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasMongoURL: !!process.env.MONGODB_URL
      }
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Test endpoint failed', 
      details: error.message 
    })
  }
}