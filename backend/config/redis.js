import { Redis } from 'ioredis';
let redis = null;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
if (process.env.REDIS_ENABLED !== 'false') {
    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 1,
            connectTimeout: 3000,
            lazyConnect: true,
        });
        redis.on('connect', () => {
            console.log('✅ Redis connected.');
        });
        redis.on('error', () => {
            // Silently disable — app works without cache
            redis = null;
        });
        // Try connecting; if it fails, disable Redis
        redis.connect().catch(() => {
            console.warn('⚠️  Redis unavailable — running without cache (this is fine).');
            redis = null;
        });
    }
    catch {
        redis = null;
    }
}
export { redis };
//# sourceMappingURL=redis.js.map