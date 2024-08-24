import express, { Application } from 'express';
import connectDB from './config/db';
import orderRoutes from './routes/orderRoutes';
import { connectRabbitMQ } from './config/rabbitmq';
import serverConfig from './config/server-config';

const app: Application = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

app.use('/api', orderRoutes);

const PORT: number = Number(serverConfig.PORT) || 5001;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
