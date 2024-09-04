import * as redis from 'redis';
import serverConfig from './server-config';


const redisHost = serverConfig.REDIS_HOST || 'localhost';
const redisPort = parseInt(serverConfig.REDIS_PORT as string, 10);


const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});


redisClient.on('connect', () => {
    console.log('Redis client connected.');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

export default redisClient;
