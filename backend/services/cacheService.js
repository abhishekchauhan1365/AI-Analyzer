import { redis } from '../config/redis.js';
const DEFAULT_TTL = 60 * 60 * 24; // 24 hours
export const getCache = async (key) => {
    if (!redis)
        return null;
    try {
        const cached = await redis.get(key);
        if (!cached)
            return null;
        return JSON.parse(cached);
    }
    catch {
        return null;
    }
};
export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
    if (!redis)
        return;
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttl);
    }
    catch {
        // Ignore cache errors silently
    }
};
export const deleteCache = async (key) => {
    if (!redis)
        return;
    try {
        await redis.del(key);
    }
    catch {
        // Ignore
    }
};
export const deleteCacheByPattern = async (pattern) => {
    if (!redis)
        return;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
    catch {
        // Ignore
    }
};
//# sourceMappingURL=cacheService.js.map