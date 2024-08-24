import mongoose from 'mongoose';
import serverConfig from "../config/server-config"

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(serverConfig.MONGO_URI!, {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
