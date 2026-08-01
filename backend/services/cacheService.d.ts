export declare const getCache: <T>(key: string) => Promise<T | null>;
export declare const setCache: <T>(key: string, value: T, ttl?: number) => Promise<void>;
export declare const deleteCache: (key: string) => Promise<void>;
export declare const deleteCacheByPattern: (pattern: string) => Promise<void>;
//# sourceMappingURL=cacheService.d.ts.map