/**
 * Bull Board Setup
 * Web UI for monitoring BullMQ queues
 */

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Express } from 'express';
import { queueService } from './QueueService';
import { QueueName } from './QueueConfig';
import logger from '@/utils/logger';

/**
 * Setup Bull Board UI
 * Provides a web interface to monitor queues at /admin/queues
 *
 * @param app Express application
 * @returns Server adapter for Bull Board
 */
export async function setupBullBoard(app: Express): Promise<ExpressAdapter> {
  try {
    // Create Express adapter
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    // Get all queues from queue service
    const queues = [];
    for (const queueName of Object.values(QueueName)) {
      try {
        const queue = await queueService.createQueue(queueName);
        queues.push(new BullMQAdapter(queue));
      } catch (error) {
        logger.warn(`Failed to add queue ${queueName} to Bull Board`, error);
      }
    }

    // Create Bull Board
    createBullBoard({
      queues,
      serverAdapter,
    });

    // Mount Bull Board UI
    app.use('/admin/queues', serverAdapter.getRouter());

    logger.info('Bull Board initialized successfully', {
      path: '/admin/queues',
      queues: queues.length,
    });

    return serverAdapter;
  } catch (error) {
    logger.error('Failed to setup Bull Board', error);
    throw error;
  }
}

/**
 * Check if Bull Board should be enabled
 * Only enable in development and staging environments
 */
export function shouldEnableBullBoard(): boolean {
  const env = process.env['NODE_ENV'];
  return env === 'development' || env === 'test';
}
