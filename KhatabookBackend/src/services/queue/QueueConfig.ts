/**
 * Queue Configuration
 * Configuration for BullMQ job queues with Redis (Upstash)
 */

import { ConnectionOptions, DefaultJobOptions } from 'bullmq';
import { config } from '../../config';

/**
 * Queue names enum
 * Define all queue names used in the application
 */
export enum QueueName {
  REMINDERS = 'reminders',           // SMS/WhatsApp reminders
  PDF_GENERATION = 'pdf-generation', // Invoice PDFs, reports
  SYNC = 'sync',                     // Offline sync processing
  NOTIFICATIONS = 'notifications',   // Push notifications
  BACKUP = 'backup',                 // Data backup jobs
}

/**
 * Redis connection configuration
 * Supports both standard Redis and Upstash Redis
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  tls?: Record<string, unknown>;
  maxRetriesPerRequest: null; // Required for BullMQ
  retryStrategy?: (times: number) => number;
}

/**
 * Get Redis connection configuration from environment
 */
export function getRedisConfig(): RedisConfig {
  // If REDIS_URL is provided (standard format or Upstash)
  if (config.redis.url) {
    const url = new URL(config.redis.url);

    return {
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      password: url.password || undefined,
      tls: (url.protocol === 'rediss:' || url.hostname.includes('upstash.io')) ? {} : undefined,
      maxRetriesPerRequest: null,
      retryStrategy: (times: number) => {
        // Exponential backoff: 50ms, 100ms, 200ms, 400ms, 800ms, max 3000ms
        return Math.min(times * 50, 3000);
      },
    };
  }

  // Fallback to individual env vars (if we add them later)
  throw new Error('REDIS_URL is not configured. Please set REDIS_URL in .env file.');
}

/**
 * Default job options for all queues
 * Can be overridden per queue or per job
 */
export const defaultJobOptions: DefaultJobOptions = {
  // Retry configuration
  attempts: 3,                      // Retry failed jobs 3 times
  backoff: {
    type: 'exponential',            // Exponential backoff
    delay: 1000,                    // Start with 1 second delay
  },

  // Job cleanup
  removeOnComplete: {
    age: 24 * 60 * 60,              // Keep completed jobs for 24 hours
    count: 1000,                    // Keep last 1000 completed jobs
  },
  removeOnFail: {
    age: 7 * 24 * 60 * 60,          // Keep failed jobs for 7 days
    count: 5000,                    // Keep last 5000 failed jobs
  },
};

/**
 * Queue-specific configurations
 * Override default options for specific queues
 */
export const queueConfigs: Record<QueueName, Partial<DefaultJobOptions>> = {
  [QueueName.REMINDERS]: {
    attempts: 5,                     // Retry reminders more times
    backoff: {
      type: 'exponential',
      delay: 2000,                   // Longer initial delay for SMS/WhatsApp
    },
  },
  [QueueName.PDF_GENERATION]: {
    attempts: 2,                     // PDFs don't need many retries
    removeOnComplete: {
      age: 60 * 60,                  // Keep PDFs for 1 hour (stored in R2)
      count: 100,
    },
  },
  [QueueName.SYNC]: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 500,                    // Quick retry for sync
    },
  },
  [QueueName.NOTIFICATIONS]: {
    attempts: 4,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
  [QueueName.BACKUP]: {
    attempts: 2,                     // Backups are heavy, don't retry much
    backoff: {
      type: 'exponential',
      delay: 5000,                   // Longer delay between retries
    },
    removeOnComplete: {
      age: 7 * 24 * 60 * 60,         // Keep backup jobs for 7 days
      count: 50,
    },
  },
};

/**
 * Worker concurrency settings
 * Number of jobs to process concurrently per worker
 */
export const workerConcurrency: Record<QueueName, number> = {
  [QueueName.REMINDERS]: 10,         // Can send multiple reminders in parallel
  [QueueName.PDF_GENERATION]: 3,     // PDFs are CPU-intensive
  [QueueName.SYNC]: 5,               // Moderate concurrency for sync
  [QueueName.NOTIFICATIONS]: 10,     // Can send multiple notifications in parallel
  [QueueName.BACKUP]: 1,             // Only one backup at a time
};

/**
 * BullMQ connection options
 * Used for Queue and Worker connections
 */
export function getConnectionOptions(): ConnectionOptions {
  const redisConfig = getRedisConfig();

  return {
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    tls: redisConfig.tls ? {} : undefined,
    maxRetriesPerRequest: null,      // Required for BullMQ
    retryStrategy: redisConfig.retryStrategy,
  };
}
