/**
 * Queue Service Demo
 * Run this file to test the queue service
 *
 * Prerequisites:
 * 1. Set REDIS_URL in .env file
 * 2. Run: pnpm exec ts-node src/services/queue/demo.ts
 */

import { queueService, QueueName } from './index';
import {
  processReminder,
  processPdfGeneration,
  processSyncJob,
} from './jobs';
import logger from '../../utils/logger';

/**
 * Demo: Queue service operations
 */
async function runDemo() {
  try {
    logger.info('=== Queue Service Demo ===');

    // Step 1: Initialize queue service
    logger.info('Step 1: Initializing queue service...');
    await queueService.initialize();
    logger.info('✓ Queue service initialized successfully');

    // Step 2: Create workers
    logger.info('\nStep 2: Creating workers...');
    await queueService.createWorker(QueueName.REMINDERS, processReminder);
    await queueService.createWorker(QueueName.PDF_GENERATION, processPdfGeneration);
    await queueService.createWorker(QueueName.SYNC, processSyncJob);
    logger.info('✓ Workers created for all queues');

    // Step 3: Add jobs
    logger.info('\nStep 3: Adding jobs to queues...');

    // Add a reminder job
    const reminderJob = await queueService.addJob(
      QueueName.REMINDERS,
      'demo-reminder',
      {
        customerId: 'customer-demo-001',
        khatabookId: 'khatabook-demo-001',
        reminderType: 'sms',
        message: 'Demo reminder message',
        phoneNumber: '+919999999999',
        balanceAmount: 50000, // ₹500.00 in paise
        userId: 'user-demo-001',
        requestId: `demo-req-${Date.now()}`,
      }
    );
    logger.info(`✓ Reminder job added: ${reminderJob.id}`);

    // Add a PDF generation job
    const pdfJob = await queueService.addJob(
      QueueName.PDF_GENERATION,
      'demo-pdf',
      {
        type: 'invoice',
        entityId: 'invoice-demo-001',
        khatabookId: 'khatabook-demo-001',
        userId: 'user-demo-001',
        requestId: `demo-req-${Date.now()}`,
        options: {
          includeGST: true,
          includeSignature: true,
        },
      }
    );
    logger.info(`✓ PDF generation job added: ${pdfJob.id}`);

    // Add a sync job
    const syncJob = await queueService.addJob(
      QueueName.SYNC,
      'demo-sync',
      {
        deviceId: 'device-demo-001',
        khatabookId: 'khatabook-demo-001',
        lastSyncAt: new Date().toISOString(),
        changes: {
          customers: [],
          transactions: [],
          invoices: [],
        },
        userId: 'user-demo-001',
        requestId: `demo-req-${Date.now()}`,
      }
    );
    logger.info(`✓ Sync job added: ${syncJob.id}`);

    // Step 4: Wait for jobs to process
    logger.info('\nStep 4: Waiting for jobs to process...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 5: Check job status
    logger.info('\nStep 5: Checking job status...');

    const reminderStatus = await queueService.getJob(QueueName.REMINDERS, reminderJob.id!);
    if (reminderStatus) {
      const state = await reminderStatus.getState();
      logger.info(`Reminder job status: ${state}`);
      if (state === 'completed') {
        logger.info(`Result: ${JSON.stringify(reminderStatus.returnvalue)}`);
      }
    }

    const pdfStatus = await queueService.getJob(QueueName.PDF_GENERATION, pdfJob.id!);
    if (pdfStatus) {
      const state = await pdfStatus.getState();
      logger.info(`PDF generation job status: ${state}`);
      if (state === 'completed') {
        logger.info(`Result: ${JSON.stringify(pdfStatus.returnvalue)}`);
      }
    }

    const syncStatus = await queueService.getJob(QueueName.SYNC, syncJob.id!);
    if (syncStatus) {
      const state = await syncStatus.getState();
      logger.info(`Sync job status: ${state}`);
      if (state === 'completed') {
        logger.info(`Result: ${JSON.stringify(syncStatus.returnvalue)}`);
      }
    }

    // Step 6: Get queue metrics
    logger.info('\nStep 6: Getting queue metrics...');
    for (const queueName of queueService.getQueueNames()) {
      const metrics = await queueService.getQueueMetrics(queueName);
      logger.info(`${queueName}:`, {
        waiting: metrics.waiting,
        active: metrics.active,
        completed: metrics.completed,
        failed: metrics.failed,
      });
    }

    // Step 7: Cleanup
    logger.info('\nStep 7: Cleaning up...');
    await queueService.closeAll();
    logger.info('✓ Queue service closed');

    logger.info('\n=== Demo completed successfully ===');
    logger.info('Check Bull Board at http://localhost:3000/admin/queues for visual monitoring');

    process.exit(0);
  } catch (error) {
    logger.error('Demo failed:', error);
    process.exit(1);
  }
}

// Run demo
if (require.main === module) {
  runDemo();
}
