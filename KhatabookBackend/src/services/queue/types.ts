/**
 * Queue Service Types
 * Type definitions for job queues and processors
 */

import { Job, Queue, Worker, JobsOptions } from 'bullmq';
import { QueueName } from './QueueConfig';

/**
 * Generic job data interface
 * Extend this for specific job types
 */
export interface BaseJobData {
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

/**
 * Job result interface
 * Standard structure for job results
 */
export interface JobResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime?: number;
}

/**
 * Queue metrics interface
 */
export interface QueueMetrics {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

/**
 * Job processor function type
 * Generic processor that takes job data and returns a result
 */
export type JobProcessor<T extends BaseJobData = BaseJobData, R = any> = (
  job: Job<T>
) => Promise<R>;

/**
 * Queue service interface
 */
export interface IQueueService {
  createQueue(name: QueueName): Promise<Queue>;
  addJob<T extends BaseJobData>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options?: JobsOptions
  ): Promise<Job<T>>;
  createWorker<T extends BaseJobData>(
    queueName: QueueName,
    processor: JobProcessor<T>
  ): Promise<Worker<T>>;
  getJob(queueName: QueueName, jobId: string): Promise<Job | undefined>;
  getQueueMetrics(queueName: QueueName): Promise<QueueMetrics>;
  pauseQueue(queueName: QueueName): Promise<void>;
  resumeQueue(queueName: QueueName): Promise<void>;
  cleanQueue(queueName: QueueName, grace: number): Promise<void>;
  closeAll(): Promise<void>;
}

/**
 * Specific job data types for different queues
 */

// Reminder job data
export interface ReminderJobData extends BaseJobData {
  customerId: string;
  khatabookId: string;
  reminderType: 'sms' | 'whatsapp';
  message: string;
  phoneNumber: string;
  balanceAmount: number; // In paise
}

// PDF generation job data
export interface PdfJobData extends BaseJobData {
  type: 'invoice' | 'report' | 'statement';
  entityId: string; // Invoice ID, Report ID, etc.
  khatabookId: string;
  options?: {
    includeGST?: boolean;
    includeSignature?: boolean;
    template?: string;
  };
}

// Sync job data
export interface SyncJobData extends BaseJobData {
  deviceId: string;
  khatabookId: string;
  lastSyncAt: string;
  changes: {
    customers?: any[];
    transactions?: any[];
    invoices?: any[];
  };
}

// Notification job data
export interface NotificationJobData extends BaseJobData {
  type: 'push' | 'email';
  recipientId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Backup job data
export interface BackupJobData extends BaseJobData {
  khatabookId: string;
  backupType: 'full' | 'incremental';
  destination: 'r2' | 'local';
}

/**
 * Job result types for specific jobs
 */

export interface ReminderJobResult extends JobResult {
  data?: {
    messageId: string;
    status: 'sent' | 'failed';
    sentAt: string;
  };
}

export interface PdfJobResult extends JobResult {
  data?: {
    fileUrl: string;
    fileSize: number;
    generatedAt: string;
  };
}

export interface SyncJobResult extends JobResult {
  data?: {
    synced: {
      customers: number;
      transactions: number;
      invoices: number;
    };
    conflicts: any[];
  };
}

export interface NotificationJobResult extends JobResult {
  data?: {
    notificationId: string;
    deliveredAt: string;
  };
}

export interface BackupJobResult extends JobResult {
  data?: {
    backupId: string;
    fileUrl: string;
    fileSize: number;
    backedUpAt: string;
  };
}
