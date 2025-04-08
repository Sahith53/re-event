import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 5
});

redis.on('error', (err) => {
    console.error('Redis Client Error:', {
        message: err.message,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    });
});

redis.on('connect', () => console.log('Connected to Redis Cloud'));

export default redis;