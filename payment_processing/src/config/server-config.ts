import dotenv from 'dotenv';
dotenv.config()
export default {
    PORT: process.env.PORT!,
    MONGO_URI: process.env.MONGO_URI!,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
}