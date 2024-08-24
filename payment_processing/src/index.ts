import express, { Application } from 'express';
import connectDB from './config/db';
import { connectRabbitMQ } from './controllers/paymentController';
import serverConfig from './config/server-config';
import payment from "./routes/paymentRoutes"

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

app.use('/api', payment)

const PORT = serverConfig.PORT
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});