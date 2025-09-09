import mongoose from 'mongoose';

//Connect to MongoDB 

const connectDB = async()=>{
    mongoose.connection.on('connected',()=> console.log('Database Connected'));
    mongoose.connection.on('error',(error)=> console.log('Database Connection Error:', error));
    mongoose.connection.on('disconnected',()=> console.log('Database Disconnected'));

    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/lms`)
        console.log('MongoDB connection attempted');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}

export default connectDB;