import express, { Application } from 'express';
import connectDB from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';
import serverConfig from './config/server-config';
import user from "./routes/userRoutes"
import healthRoutes from "./routes/healthCheckRoutes"
import cors from 'cors'
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

app.use(_enum.URLS, user)
app.use('/', healthRoutes);

const PORT = serverConfig.PORT
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});