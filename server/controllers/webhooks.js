import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Course from "../models/course.js"
import {Purchase} from "../models/purchase.js"


//API controller function to manage clerk user with db

export const clerkWebhooks = async (req,res)=>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        const {data,type}=req.body

        switch (type) {
            case 'user.created': {
                const userData={
                    _id:data.id,
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl:data.image_url,

                }
                await User.create(userData)
                res.json({}
                    
                )
                break;
            }

            case 'user.updated':{
                const userData={
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl:data.image_url,

                }
                await User.findByIdAndUpdate(data.id,userData)
                res.json({})
                break;
            }

            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
                
            default:
                break;
        }
    }catch(error){
        res.json({success:false, message:error.message})

    }
}

const stripeInstance= new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(request,response)=>{
    try {
        const sig = request.headers['stripe-signature'];
        
        if (!sig) {
            console.error('No stripe signature found in headers');
            return response.status(400).json({error: 'No stripe signature'});
        }
        
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('STRIPE_WEBHOOK_SECRET not found in environment variables');
            return response.status(500).json({error: 'Webhook secret not configured'});
        }
        
        let event;
        
        try {
            event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return response.status(400).json({error: `Webhook verification failed: ${err.message}`});
        }

    try {
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':{
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });

                if (!session.data || session.data.length === 0) {
                    return response.status(400).json({error: 'No checkout session found'});
                }

                const {purchaseId} = session.data[0].metadata;

                if (!purchaseId) {
                    return response.status(400).json({error: 'No purchase ID in metadata'});
                }

                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    return response.status(404).json({error: 'Purchase not found'});
                }

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                if (!userData || !courseData) {
                    return response.status(404).json({error: 'User or Course not found'});
                }

                // Check if user is already enrolled to avoid duplicates
                if (!courseData.enrolledStudents.includes(userData._id)) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                }

                if (!userData.enrolledCourses.includes(courseData._id)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                purchaseData.status = 'completed';
                await purchaseData.save();

                break;
            }
            case 'payment_intent.payment_failed':{
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });

                if (!session.data || session.data.length === 0) {
                    return response.status(400).json({error: 'No checkout session found'});
                }

                const {purchaseId} = session.data[0].metadata;

                if (!purchaseId) {
                    return response.status(400).json({error: 'No purchase ID in metadata'});
                }

                // Fixed the critical error: was 'purchaseId.findById' instead of 'Purchase.findById'
                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    return response.status(404).json({error: 'Purchase not found'});
                }

                purchaseData.status = 'failed';
                await purchaseData.save();

                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        response.status(200).json({received: true});
        
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        console.error('Error stack:', error.stack);
        response.status(500).json({error: 'Internal server error', details: error.message});
    }
    
    } catch (outerError) {
        console.error('Outer webhook error:', outerError.message);
        console.error('Outer error stack:', outerError.stack);
        return response.status(500).json({error: 'Webhook function failed', details: outerError.message});
    }


}