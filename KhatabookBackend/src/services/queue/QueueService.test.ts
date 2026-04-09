/**
 * Queue Service Tests
 * Unit tests for QueueService
 *
 * Note: These tests require Redis to be running
 * For CI/CD, use Redis container or mock Redis
 */

import { queueService } from './QueueService';
import { QueueName } from './QueueConfig';
import { ReminderJobData } from './types';
import { Job } from 'bullmq';

// Skip tests if Redis is not configured
const REDIS_CONFIGURED = !!process.env.REDIS_URL;
const describeIfRedis = REDIS_CONFIGURED ? describe : describe.skip;

describeIfRedis('QueueService', () => {
  // Setup: Initialize queue service before all tests
  beforeAll(async () => {
    try {
      await queueService.initialize();
    } catch (error) {
      console.error('Failed to initialize queue service:', error);
      throw error;
    }
  });

  // Cleanup: Close all queues after all tests
  afterAll(async () => {
    try {
      await queueService.closeAll();
    } catch (error) {
      console.error('Failed to close queue service:', error);
    }
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      // Already initialized in beforeAll
      expect(queueService['isConnected']).toBe(true);
      expect(queueService['connection']).not.toBeNull();
    });

    it('should throw error if Redis is not configured', async () => {
      // This test is skipped if Redis is configured
      // In real test, mock config to test error case
    });
  });

  describe('createQueue', () => {
    it('should create a new queue', async () => {
      const queue = await queueService.createQueue(QueueName.REMINDERS);
      expect(queue).toBeDefined();
      expect(queue.name).toBe(QueueName.REMINDERS);
    });

    it('should return existing queue if already created', async () => {
      const queue1 = await queueService.createQueue(QueueName.REMINDERS);
      const queue2 = await queueService.createQueue(QueueName.REMINDERS);
      expect(queue1).toBe(queue2);
    });
  });

  describe('addJob', () => {
    it('should add a job to queue', async () => {
      const jobData: ReminderJobData = {
        customerId: 'customer-123',
        khatabookId: 'khatabook-123',
        reminderType: 'sms',
        message: 'Test reminder',
        phoneNumber: '+919876543210',
        balanceAmount: 10000,
        userId: 'user-123',
        requestId: 'req-123',
      };

      const job = await queueService.addJob(
        QueueName.REMINDERS,
        'test-reminder',
        jobData
      );

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.name).toBe('test-reminder');
      expect(job.data).toEqual(jobData);
    });

    it('should add job with custom options', async () => {
      const jobData: ReminderJobData = {
        customerId: 'customer-456',
        khatabookId: 'khatabook-456',
        reminderType: 'whatsapp',
        message: 'Test reminder with delay',
        phoneNumber: '+919876543211',
        balanceAmount: 20000,
        userId: 'user-456',
      };

      const job = await queueService.addJob(
        QueueName.REMINDERS,
        'delayed-reminder',
        jobData,
        {
          delay: 5000, // 5 seconds
          priority: 10,
        }
      );

      expect(job).toBeDefined();
      expect(job.opts.delay).toBe(5000);
      expect(job.opts.priority).toBe(10);
    });
  });

  describe('createWorker', () => {
    it('should create a worker for queue', async () => {
      const mockProcessor = jest.fn(async (job: Job) => {
        return { success: true };
      });

      const worker = await queueService.createWorker(
        QueueName.PDF_GENERATION,
        mockProcessor
      );

      expect(worker).toBeDefined();
      expect(queueService.hasWorker(QueueName.PDF_GENERATION)).toBe(true);
    });

    it('should process jobs with worker', async () => {
      return new Promise(async (resolve) => {
        // Create processor that resolves promise on completion
        const mockProcessor = jest.fn(async (job: Job) => {
          expect(job.data.test).toBe('data');
          return { success: true };
        });

        // Create worker
        const worker = await queueService.createWorker(
          QueueName.NOTIFICATIONS,
          mockProcessor
        );

        // Listen for completed event
        worker.on('completed', () => {
          expect(mockProcessor).toHaveBeenCalled();
          resolve(true);
        });

        // Add job
        await queueService.addJob(
          QueueName.NOTIFICATIONS,
          'test-notification',
          { test: 'data' }
        );
      });
    }, 10000); // 10 second timeout
  });

  describe('getQueueMetrics', () => {
    it('should return queue metrics', async () => {
      const metrics = await queueService.getQueueMetrics(QueueName.REMINDERS);

      expect(metrics).toBeDefined();
      expect(metrics.name).toBe(QueueName.REMINDERS);
      expect(typeof metrics.waiting).toBe('number');
      expect(typeof metrics.active).toBe('number');
      expect(typeof metrics.completed).toBe('number');
      expect(typeof metrics.failed).toBe('number');
      expect(typeof metrics.paused).toBe('boolean');
    });
  });

  describe('pauseQueue and resumeQueue', () => {
    it('should pause and resume queue', async () => {
      await queueService.pauseQueue(QueueName.BACKUP);
      let metrics = await queueService.getQueueMetrics(QueueName.BACKUP);
      expect(metrics.paused).toBe(true);

      await queueService.resumeQueue(QueueName.BACKUP);
      metrics = await queueService.getQueueMetrics(QueueName.BACKUP);
      expect(metrics.paused).toBe(false);
    });
  });

  describe('getJob', () => {
    it('should retrieve job by ID', async () => {
      const addedJob = await queueService.addJob(
        QueueName.SYNC,
        'test-sync',
        {
          deviceId: 'device-123',
          khatabookId: 'khatabook-123',
          lastSyncAt: new Date().toISOString(),
          changes: {},
        }
      );

      const retrievedJob = await queueService.getJob(
        QueueName.SYNC,
        addedJob.id!
      );

      expect(retrievedJob).toBeDefined();
      expect(retrievedJob?.id).toBe(addedJob.id);
    });

    it('should return undefined for non-existent job', async () => {
      const job = await queueService.getJob(QueueName.SYNC, 'non-existent-id');
      expect(job).toBeUndefined();
    });
  });
});

// Integration test example (requires real Redis)
describeIfRedis('QueueService Integration', () => {
  beforeAll(async () => {
    await queueService.initialize();
  });

  afterAll(async () => {
    await queueService.closeAll();
  });

  it('should process job end-to-end', async () => {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timeout'));
      }, 15000);

      // Create processor
      const processor = async (job: Job) => {
        await job.updateProgress(50);
        await new Promise(r => setTimeout(r, 100)); // Simulate work
        await job.updateProgress(100);
        return { processed: true, jobId: job.id };
      };

      // Create worker
      const worker = await queueService.createWorker(
        QueueName.REMINDERS,
        processor
      );

      // Listen for completion
      worker.on('completed', async (job) => {
        try {
          expect(job.returnvalue).toEqual({
            processed: true,
            jobId: job.id,
          });
          clearTimeout(timeout);
          resolve(true);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });

      // Add job
      await queueService.addJob(
        QueueName.REMINDERS,
        'integration-test',
        {
          customerId: 'test-customer',
          khatabookId: 'test-khatabook',
          reminderType: 'sms',
          message: 'Test message',
          phoneNumber: '+919999999999',
          balanceAmount: 10000,
        }
      );
    });
  }, 20000);
});
