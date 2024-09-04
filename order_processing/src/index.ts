import express, { Application } from 'express';
import connectDB from './config/db';
import orderRoutes from './routes/orderRoutes';
import { connectRabbitMQ } from './config/rabbitmq';
import serverConfig from './config/server-config';
import cors from "cors";
import _enum from './utils/enum';

const app: Application = express();
app.use(express.json());

connectDB();

connectRabbitMQ();

app.use(cors({
    origin: ['https://movie4u-cufp.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(_enum.URLS, orderRoutes);

const PORT: number = Number(serverConfig.PORT) || 5001;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
