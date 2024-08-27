import express, { Application } from 'express';
import connectDB from './config/db';
import { connectRabbitMQ } from './controllers/notificationController';
import { getUserDetails } from './utils/apiData';



const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Notifiaction Service running on port ${PORT}`);
});