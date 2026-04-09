/**
 * Redis Service
 * Wrapper service for Redis operations (caching, rate limiting, sessions)
 */

import { Redis } from 'ioredis';
import { config } from '../../config';
import logger from '../../utils/logger';

export class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    // Use existing Redis connection from QueueService config
    const redisUrl = config.redis.url;

    if (!redisUrl) {
      throw new Error('REDIS_URL is not configured');
    }

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      logger.info('RedisService connected successfully');
    });

    this.client.on('error', (error) => {
      logger.error('RedisService connection error', { error: error.message });
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * Set key with optional expiry (TTL in seconds)
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Get value by key
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  /**
   * Increment counter (for rate limiting)
   */
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  /**
   * Set expiry on existing key
   */
  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  /**
   * Get Time To Live for key
   */
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    await this.client.quit();
    logger.info('RedisService disconnected');
  }
}

export const redisService = RedisService.getInstance();
