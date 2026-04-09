/**
 * Queue Service
 * Main service for managing BullMQ job queues with Redis
 */

import { Queue, Worker, Job, JobsOptions, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import {
  QueueName,
  getRedisConfig,
  getConnectionOptions,
  defaultJobOptions,
  queueConfigs,
  workerConcurrency,
} from './QueueConfig';
import {
  BaseJobData,
  JobProcessor,
  QueueMetrics,
  IQueueService,
} from './types';
import logger from '@/utils/logger';
import { config } from '../../config';

/**
 * QueueService class
 * Manages job queues and workers for background processing
 */
export class QueueService implements IQueueService {
  private connection: Redis | null = null;
  private queues: Map<QueueName, Queue> = new Map();
  private workers: Map<QueueName, Worker> = new Map();
  private queueEvents: Map<QueueName, QueueEvents> = new Map();
  private isConnected: boolean = false;

  /**
   * Initialize Redis connection
   * Must be called before using queue service
   */
  async initialize(): Promise<void> {
    if (this.isConnected) {
      logger.warn('QueueService already initialized');
      return;
    }

    try {
      // Check if Redis URL is configured
      if (!config.redis.url) {
        throw new Error(
          'Redis is not configured. Please set REDIS_URL in .env file. ' +
          'For Upstash Redis, use format: rediss://default:password@host:port'
        );
      }

      // Create Redis connection
      const redisConfig = getRedisConfig();
      this.connection = new Redis(redisConfig);

      // Test connection
      await this.connection.ping();
      this.isConnected = true;

      logger.info('QueueService initialized successfully', {
        host: redisConfig.host,
        port: redisConfig.port,
        tls: redisConfig.tls,
      });
    } catch (error) {
      logger.error('Failed to initialize QueueService', error);
      throw new Error(
        `QueueService initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if service is ready
   * @throws Error if service is not initialized
   */
  private ensureInitialized(): void {
    if (!this.isConnected || !this.connection) {
      throw new Error(
        'QueueService is not initialized. Call initialize() first.'
      );
    }
  }

  /**
   * Create or get a queue
   * @param name Queue name
   * @returns Queue instance
   */
  async createQueue(name: QueueName): Promise<Queue> {
    this.ensureInitialized();

    // Return existing queue if already created
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    try {
      // Create new queue
      const queue = new Queue(name, {
        connection: getConnectionOptions(),
        defaultJobOptions: {
          ...defaultJobOptions,
          ...queueConfigs[name],
        },
      });

      // Setup queue events
      const events = new QueueEvents(name, {
        connection: getConnectionOptions(),
      });

      // Listen to queue events
      events.on('completed', ({ jobId }) => {
        logger.debug(`Job completed in queue ${name}`, { jobId });
      });

      events.on('failed', ({ jobId, failedReason }) => {
        logger.error(`Job failed in queue ${name}`, { jobId, failedReason });
      });

      events.on('progress', ({ jobId, data }) => {
        logger.debug(`Job progress in queue ${name}`, { jobId, progress: data });
      });

      // Store queue and events
      this.queues.set(name, queue);
      this.queueEvents.set(name, events);

      logger.info(`Queue created: ${name}`);
      return queue;
    } catch (error) {
      logger.error(`Failed to create queue: ${name}`, error);
      throw error;
    }
  }

  /**
   * Add a job to a queue
   * @param queueName Queue name
   * @param jobName Job name/type
   * @param data Job data
   * @param options Job options (override defaults)
   * @returns Job instance
   */
  async addJob<T extends BaseJobData>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options?: JobsOptions
  ): Promise<Job<T>> {
    this.ensureInitialized();

    try {
      const queue = await this.createQueue(queueName);

      const job = await queue.add(jobName, data, options);

      logger.info(`Job added to queue ${queueName}`, {
        jobId: job.id,
        jobName,
        userId: data.userId,
        requestId: data.requestId,
      });

      return job as Job<T>;
    } catch (error) {
      logger.error(`Failed to add job to queue ${queueName}`, {
        jobName,
        error,
      });
      throw error;
    }
  }

  /**
   * Create a worker to process jobs from a queue
   * @param queueName Queue name
   * @param processor Job processor function
   * @returns Worker instance
   */
  async createWorker<T extends BaseJobData>(
    queueName: QueueName,
    processor: JobProcessor<T>
  ): Promise<Worker<T>> {
    this.ensureInitialized();

    // Return existing worker if already created
    if (this.workers.has(queueName)) {
      logger.warn(`Worker already exists for queue ${queueName}`);
      return this.workers.get(queueName)! as Worker<T>;
    }

    try {
      const worker = new Worker<T>(
        queueName,
        async (job: Job<T>) => {
          const startTime = Date.now();

          try {
            logger.info(`Processing job ${job.id} from queue ${queueName}`, {
              jobId: job.id,
              jobName: job.name,
              attempt: job.attemptsMade + 1,
              maxAttempts: job.opts.attempts,
            });

            const result = await processor(job);

            const executionTime = Date.now() - startTime;
            logger.info(`Job completed successfully`, {
              jobId: job.id,
              queueName,
              executionTime: `${executionTime}ms`,
            });

            return result;
          } catch (error) {
            const executionTime = Date.now() - startTime;
            logger.error(`Job processing failed`, {
              jobId: job.id,
              queueName,
              attempt: job.attemptsMade + 1,
              executionTime: `${executionTime}ms`,
              error,
            });
            throw error;
          }
        },
        {
          connection: getConnectionOptions(),
          concurrency: workerConcurrency[queueName] || 5,
        }
      );

      // Worker event listeners
      worker.on('completed', (job) => {
        logger.debug(`Worker completed job ${job.id} in queue ${queueName}`);
      });

      worker.on('failed', (job, err) => {
        logger.error(`Worker failed to process job ${job?.id} in queue ${queueName}`, {
          error: err.message,
          stack: err.stack,
        });
      });

      worker.on('error', (err) => {
        logger.error(`Worker error in queue ${queueName}`, err);
      });

      this.workers.set(queueName, worker as Worker<any>);
      logger.info(`Worker created for queue ${queueName}`, {
        concurrency: workerConcurrency[queueName] || 5,
      });

      return worker;
    } catch (error) {
      logger.error(`Failed to create worker for queue ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Get a job by ID from a queue
   * @param queueName Queue name
   * @param jobId Job ID
   * @returns Job instance or undefined
   */
  async getJob(queueName: QueueName, jobId: string): Promise<Job | undefined> {
    this.ensureInitialized();

    try {
      const queue = await this.createQueue(queueName);
      return await queue.getJob(jobId);
    } catch (error) {
      logger.error(`Failed to get job ${jobId} from queue ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Get queue metrics
   * @param queueName Queue name
   * @returns Queue metrics
   */
  async getQueueMetrics(queueName: QueueName): Promise<QueueMetrics> {
    this.ensureInitialized();

    try {
      const queue = await this.createQueue(queueName);

      const [waiting, active, completed, failed, delayed, paused] =
        await Promise.all([
          queue.getWaitingCount(),
          queue.getActiveCount(),
          queue.getCompletedCount(),
          queue.getFailedCount(),
          queue.getDelayedCount(),
          queue.isPaused(),
        ]);

      return {
        name: queueName,
        waiting,
        active,
        completed,
        failed,
        delayed,
        paused,
      };
    } catch (error) {
      logger.error(`Failed to get metrics for queue ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Pause a queue
   * @param queueName Queue name
   */
  async pauseQueue(queueName: QueueName): Promise<void> {
    this.ensureInitialized();

    try {
      const queue = await this.createQueue(queueName);
      await queue.pause();
      logger.info(`Queue paused: ${queueName}`);
    } catch (error) {
      logger.error(`Failed to pause queue ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Resume a paused queue
   * @param queueName Queue name
   */
  async resumeQueue(queueName: QueueName): Promise<void> {
    this.ensureInitialized();

    try {
      const queue = await this.createQueue(queueName);
      await queue.resume();
      logger.info(`Queue resumed: ${queueName}`);
    } catch (error) {
      logger.error(`Failed to resume queue ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Clean completed jobs from a queue
   * @param queueName Queue name
   * @param grace Grace period in milliseconds (jobs older than this will be removed)
   */
  async cleanQueue(queueName: QueueName, grace: number = 0): Promise<void> {
    this.ensureInitialized();

    try {
      const queue = await this.createQueue(queueName);
      await queue.clean(grace, 100, 'completed');
      logger.info(`Queue cleaned: ${queueName}`, { grace });
    } catch (error) {
      logger.error(`Failed to clean queue ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Close all queues, workers, and connections
   * Call this on application shutdown
   */
  async closeAll(): Promise<void> {
    logger.info('Closing QueueService...');

    try {
      // Close all workers
      for (const [name, worker] of this.workers.entries()) {
        await worker.close();
        logger.debug(`Worker closed: ${name}`);
      }

      // Close all queue events
      for (const [name, events] of this.queueEvents.entries()) {
        await events.close();
        logger.debug(`Queue events closed: ${name}`);
      }

      // Close all queues
      for (const [name, queue] of this.queues.entries()) {
        await queue.close();
        logger.debug(`Queue closed: ${name}`);
      }

      // Close Redis connection
      if (this.connection) {
        await this.connection.quit();
        logger.debug('Redis connection closed');
      }

      // Clear maps
      this.workers.clear();
      this.queues.clear();
      this.queueEvents.clear();
      this.connection = null;
      this.isConnected = false;

      logger.info('QueueService closed successfully');
    } catch (error) {
      logger.error('Error closing QueueService', error);
      throw error;
    }
  }

  /**
   * Get all queue names
   */
  getQueueNames(): QueueName[] {
    return Object.values(QueueName);
  }

  /**
   * Check if a worker exists for a queue
   */
  hasWorker(queueName: QueueName): boolean {
    return this.workers.has(queueName);
  }
}

// Export singleton instance
export const queueService = new QueueService();
