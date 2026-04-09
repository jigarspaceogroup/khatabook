/**
 * Reminder Job Processor
 * Processes SMS and WhatsApp reminder jobs
 */

import { Job } from 'bullmq';
import logger from '../../../utils/logger';
import { ReminderJobData, ReminderJobResult } from '../types';

/**
 * Process reminder job
 * Sends SMS or WhatsApp reminder to customer
 *
 * @param job BullMQ job containing reminder data
 * @returns Job result with message delivery status
 */
export async function processReminder(
  job: Job<ReminderJobData>
): Promise<ReminderJobResult> {
  const startTime = Date.now();
  const { customerId, reminderType, phoneNumber, balanceAmount } = job.data;

  try {
    logger.info('Processing reminder job', {
      jobId: job.id,
      customerId,
      reminderType,
      phoneNumber,
    });

    // Update progress: 25% - Validating data
    await job.updateProgress(25);

    // Validate phone number
    if (!phoneNumber || !phoneNumber.startsWith('+91')) {
      throw new Error('Invalid phone number format. Must start with +91');
    }

    // Update progress: 50% - Preparing message
    await job.updateProgress(50);

    // Format balance amount for display
    const balanceDisplay = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(balanceAmount / 100);

    logger.debug('Sending reminder', {
      reminderType,
      phoneNumber,
      balance: balanceDisplay,
    });

    // Update progress: 75% - Sending reminder
    await job.updateProgress(75);

    // TODO: Phase 1 - Implement actual SMS/WhatsApp sending
    // For now, simulate sending with delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update progress: 100% - Complete
    await job.updateProgress(100);

    const executionTime = Date.now() - startTime;

    logger.info('Reminder sent successfully', {
      jobId: job.id,
      messageId,
      customerId,
      executionTime: `${executionTime}ms`,
    });

    return {
      success: true,
      data: {
        messageId,
        status: 'sent',
        sentAt: new Date().toISOString(),
      },
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;

    logger.error('Failed to send reminder', {
      jobId: job.id,
      customerId,
      reminderType,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: `${executionTime}ms`,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send reminder',
      executionTime,
    };
  }
}
