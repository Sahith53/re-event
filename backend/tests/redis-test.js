import redis from '../config/redis.js';

async function testConnection() {
    try {
        await redis.set('test', 'Connected to Redis Cloud!');
        const result = await redis.get('test');
        console.log('Test result:', result);
        await redis.del('test');
        console.log('Successfully connected to Redis Cloud!');
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        redis.quit();
    }
}

testConnection();