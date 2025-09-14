import Stripe from 'stripe'
import { MongoClient, ObjectId } from 'mongodb'

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature')
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    
    try {
        const sig = req.headers['stripe-signature']
        
        if (!sig) {
            console.error('No stripe signature found in headers')
            return res.status(400).json({error: 'No stripe signature'})
        }
        
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('STRIPE_WEBHOOK_SECRET not found in environment variables')
            return res.status(500).json({error: 'Webhook secret not configured'})
        }
        
        let event
        
        try {
            event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err.message)
            return res.status(400).json({error: `Webhook verification failed: ${err.message}`})
        }
        
        console.log('Received webhook event:', event.type)
        
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object
            const paymentIntentId = paymentIntent.id
            
            // Get checkout session
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            
            if (!sessions.data || sessions.data.length === 0) {
                console.error('No checkout session found')
                return res.status(400).json({error: 'No checkout session found'})
            }
            
            const {purchaseId} = sessions.data[0].metadata
            
            if (!purchaseId) {
                console.error('No purchaseId in metadata')
                return res.status(400).json({error: 'No purchase ID in metadata'})
            }
            
            console.log('Processing purchase:', purchaseId)
            
            // Connect to MongoDB and update purchase
            const client = new MongoClient(process.env.MONGODB_URL)
            await client.connect()
            
            const db = client.db()
            const purchasesCollection = db.collection('purchases')
            const usersCollection = db.collection('users')
            const coursesCollection = db.collection('courses')
            
            // Find purchase
            const purchase = await purchasesCollection.findOne({ _id: new ObjectId(purchaseId) })
            if (!purchase) {
                await client.close()
                return res.status(404).json({error: 'Purchase not found'})
            }
            
            // Update purchase status
            await purchasesCollection.updateOne(
                { _id: new ObjectId(purchaseId) },
                { $set: { status: 'completed' } }
            )
            
            // Add user to course and course to user
            await usersCollection.updateOne(
                { _id: purchase.userId },
                { $addToSet: { enrolledCourses: new ObjectId(purchase.courseId) } }
            )
            
            await coursesCollection.updateOne(
                { _id: new ObjectId(purchase.courseId) },
                { $addToSet: { enrolledStudents: purchase.userId } }
            )
            
            await client.close()
            
            console.log('Purchase completed successfully:', purchaseId)
        }
        
        // Return success response
        res.status(200).json({received: true})
        
    } catch (outerError) {
        console.error('Webhook error:', outerError.message)
        console.error('Stack:', outerError.stack)
        return res.status(500).json({error: 'Webhook failed', details: outerError.message})
    }
}