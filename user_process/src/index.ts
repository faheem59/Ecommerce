import express, { Application } from 'express';
import connectDB from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';
import serverConfig from './config/server-config';
import user from "./routes/userRoutes"

const app = express();
app.use(express.json());

connectDB();

connectRabbitMQ();

app.use('/api', user)

const PORT = serverConfig.PORT
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});