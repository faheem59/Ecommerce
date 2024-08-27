import express, { Application } from 'express';
import connectDB from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';
import serverConfig from './config/server-config';
import payment from "./routes/paymentRoutes"
import cors from "cors"
import _enum from './utils/enum';

const app = express();
app.use(express.json());

connectDB();


connectRabbitMQ();

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));


app.use(_enum.URLS, payment)



const PORT = serverConfig.PORT
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});