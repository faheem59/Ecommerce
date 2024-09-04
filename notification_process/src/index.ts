import express, { Application } from 'express';
import connectDB from './config/db';
import { connectRabbitMQ } from './controllers/notificationController';


const app = express();
app.use(express.json());

connectDB();

connectRabbitMQ();

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Notifiaction Service running on port ${PORT}`);
});