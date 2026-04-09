/**
 * Queue Service - Example Usage
 * Demonstrates how to use the queue service for background jobs
 */

import { queueService, QueueName } from './index';
import {
  ReminderJobData,
  PdfJobData,
  SyncJobData,
} from './types';
import {
  processReminder,
  processPdfGeneration,
  processSyncJob,
} from './jobs';
import logger from '../../utils/logger';

/**
 * Example: Initialize queue service
 * Call this on application startup
 */
export async function initializeQueues(): Promise<void> {
  try {
    // Initialize queue service (connects to Redis)
    await queueService.initialize();

    // Create workers for each queue type
    await queueService.createWorker(QueueName.REMINDERS, processReminder);
    await queueService.createWorker(QueueName.PDF_GENERATION, processPdfGeneration);
    await queueService.createWorker(QueueName.SYNC, processSyncJob);

    logger.info('All queue workers initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize queues', error);
    throw error;
  }
}

/**
 * Example: Add a reminder job
 * Call this when user clicks "Send Reminder" button
 */
export async function sendReminderJob(data: {
  customerId: string;
  khatabookId: string;
  phoneNumber: string;
  balanceAmount: number;
  reminderType: 'sms' | 'whatsapp';
  userId: string;
}): Promise<string> {
  const jobData: ReminderJobData = {
    customerId: data.customerId,
    khatabookId: data.khatabookId,
    reminderType: data.reminderType,
    message: `Reminder: Your balance is ${data.balanceAmount / 100}. Please pay at your earliest convenience.`,
    phoneNumber: data.phoneNumber,
    balanceAmount: data.balanceAmount,
    userId: data.userId,
    requestId: `req_${Date.now()}`,
  };

  const job = await queueService.addJob(
    QueueName.REMINDERS,
    'send-reminder',
    jobData,
    {
      // Optional: Schedule for later
      // delay: 60000, // Send after 1 minute
    }
  );

  logger.info('Reminder job added', { jobId: job.id });
  return job.id!;
}

/**
 * Example: Add a PDF generation job
 * Call this when user requests invoice PDF
 */
export async function generateInvoicePdf(data: {
  invoiceId: string;
  khatabookId: string;
  userId: string;
}): Promise<string> {
  const jobData: PdfJobData = {
    type: 'invoice',
    entityId: data.invoiceId,
    khatabookId: data.khatabookId,
    userId: data.userId,
    requestId: `req_${Date.now()}`,
    options: {
      includeGST: true,
      includeSignature: true,
    },
  };

  const job = await queueService.addJob(
    QueueName.PDF_GENERATION,
    'generate-invoice',
    jobData,
    {
      // Priority: higher number = higher priority
      priority: 5,
    }
  );

  logger.info('PDF generation job added', { jobId: job.id });
  return job.id!;
}

/**
 * Example: Add a sync job
 * Call this when mobile app pushes offline changes
 */
export async function processSyncData(data: {
  deviceId: string;
  khatabookId: string;
  lastSyncAt: string;
  changes: any;
  userId: string;
}): Promise<string> {
  const jobData: SyncJobData = {
    deviceId: data.deviceId,
    khatabookId: data.khatabookId,
    lastSyncAt: data.lastSyncAt,
    changes: data.changes,
    userId: data.userId,
    requestId: `req_${Date.now()}`,
  };

  const job = await queueService.addJob(
    QueueName.SYNC,
    'sync-offline-data',
    jobData,
    {
      // Remove job after completion (don't clutter queue)
      removeOnComplete: true,
    }
  );

  logger.info('Sync job added', { jobId: job.id });
  return job.id!;
}

/**
 * Example: Check job status
 * Call this to check if a job completed
 */
export async function checkJobStatus(
  queueName: QueueName,
  jobId: string
): Promise<{
  status: string;
  progress: number;
  result?: any;
  error?: string;
}> {
  const job = await queueService.getJob(queueName, jobId);

  if (!job) {
    throw new Error(`Job ${jobId} not found in queue ${queueName}`);
  }

  const state = await job.getState();
  const progress = job.progress;
  const returnValue = job.returnvalue;
  const failedReason = job.failedReason;

  return {
    status: state,
    progress: typeof progress === 'number' ? progress : 0,
    result: returnValue,
    error: failedReason,
  };
}

/**
 * Example: Get queue metrics
 * Call this for admin dashboard
 */
export async function getQueueStats(): Promise<any[]> {
  const stats = [];

  for (const queueName of queueService.getQueueNames()) {
    try {
      const metrics = await queueService.getQueueMetrics(queueName);
      stats.push(metrics);
    } catch (error) {
      logger.error(`Failed to get metrics for queue ${queueName}`, error);
    }
  }

  return stats;
}

/**
 * Example: Graceful shutdown
 * Call this on application shutdown (SIGTERM, SIGINT)
 */
export async function shutdownQueues(): Promise<void> {
  logger.info('Shutting down queue service...');
  await queueService.closeAll();
  logger.info('Queue service shutdown complete');
}

// Export for use in routes/controllers
export {
  queueService,
  QueueName,
};
