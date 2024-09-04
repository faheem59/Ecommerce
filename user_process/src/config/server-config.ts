import dotenv from 'dotenv';
dotenv.config()
export default {
    PORT: process.env.PORT!,
    MONGO_URI: process.env.MONGO_URI!,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST

}