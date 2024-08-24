import dotenv from 'dotenv';
dotenv.config()
export default {
    PORT: process.env.PORT!,
    MONGO_URI: process.env.MONGO_URI!,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    MAIL: process.env.MAIL,
    PASS: process.env.PASS,
}