# Queue Service - BullMQ with Redis

Background job processing system for the Khatabook backend using BullMQ and Redis (Upstash).

## Overview

The Queue Service manages background jobs for:
- **Reminders**: SMS and WhatsApp payment reminders
- **PDF Generation**: Invoice PDFs, reports, statements
- **Sync**: Offline data synchronization from mobile apps
- **Notifications**: Push notifications and emails
- **Backup**: Database backups and data exports

## Architecture

```
QueueService (Singleton)
├── Redis Connection (Upstash)
├── Queues (5 queues)
│   ├── reminders
│   ├── pdf-generation
│   ├── sync
│   ├── notifications
│   └── backup
└── Workers (Process jobs)
    └── Processors (Business logic)
```

## Setup

### 1. Install Dependencies

Already installed in this project:
- `bullmq`: Job queue library
- `ioredis`: Redis client
- `@bull-board/express`: Queue monitoring UI
- `@bull-board/api`: Bull Board API

### 2. Configure Redis

Get Redis credentials from [Upstash Console](https://console.upstash.com/redis):

1. Create a new Redis database
2. Copy the connection URL (format: `rediss://default:password@host:port`)
3. Add to `.env`:

```bash
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_HOST.upstash.io:6379
```

### 3. Initialize Queue Service

In your `server.ts` or `app.ts`:

```typescript
import { queueService } from '@/services/queue';
import { processReminder, processPdfGeneration, processSyncJob } from '@/services/queue/jobs';
import { QueueName } from '@/services/queue';

// On startup
async function startServer() {
  // Initialize queue service
  await queueService.initialize();

  // Create workers
  await queueService.createWorker(QueueName.REMINDERS, processReminder);
  await queueService.createWorker(QueueName.PDF_GENERATION, processPdfGeneration);
  await queueService.createWorker(QueueName.SYNC, processSyncJob);

  // Start Express server
  app.listen(3000);
}

// On shutdown
process.on('SIGTERM', async () => {
  await queueService.closeAll();
  process.exit(0);
});
```

### 4. Setup Bull Board (Optional)

Monitor queues at `/admin/queues`:

```typescript
import { setupBullBoard, shouldEnableBullBoard } from '@/services/queue/BullBoard';

if (shouldEnableBullBoard()) {
  await setupBullBoard(app);
  console.log('Bull Board available at http://localhost:3000/admin/queues');
}
```

## Usage

### Adding Jobs

```typescript
import { queueService, QueueName } from '@/services/queue';

// Add a reminder job
const job = await queueService.addJob(
  QueueName.REMINDERS,
  'send-reminder',
  {
    customerId: 'customer-123',
    khatabookId: 'khatabook-123',
    reminderType: 'sms',
    message: 'Payment reminder',
    phoneNumber: '+919876543210',
    balanceAmount: 10000, // In paise
    userId: 'user-123',
  }
);

console.log('Job added:', job.id);
```

### Job Options

```typescript
// Schedule job for later
await queueService.addJob(QueueName.REMINDERS, 'send-reminder', data, {
  delay: 60000, // 1 minute
});

// Set job priority (higher = more important)
await queueService.addJob(QueueName.PDF_GENERATION, 'generate-invoice', data, {
  priority: 10,
});

// Retry configuration
await queueService.addJob(QueueName.SYNC, 'sync-data', data, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
});

// Remove on completion (don't clutter queue)
await queueService.addJob(QueueName.NOTIFICATIONS, 'send-notification', data, {
  removeOnComplete: true,
});
```

### Checking Job Status

```typescript
// Get job by ID
const job = await queueService.getJob(QueueName.REMINDERS, 'job-123');

if (job) {
  const state = await job.getState(); // 'waiting', 'active', 'completed', 'failed'
  const progress = job.progress; // 0-100
  const result = job.returnvalue; // Job result
  const error = job.failedReason; // Error message if failed
}
```

### Queue Metrics

```typescript
// Get queue statistics
const metrics = await queueService.getQueueMetrics(QueueName.REMINDERS);

console.log(metrics);
// {
//   name: 'reminders',
//   waiting: 10,
//   active: 2,
//   completed: 150,
//   failed: 3,
//   delayed: 5,
//   paused: false
// }
```

### Pause/Resume Queue

```typescript
// Pause queue (stop processing jobs)
await queueService.pauseQueue(QueueName.REMINDERS);

// Resume queue
await queueService.resumeQueue(QueueName.REMINDERS);
```

### Clean Queue

```typescript
// Remove completed jobs older than 1 hour
await queueService.cleanQueue(QueueName.PDF_GENERATION, 60 * 60 * 1000);
```

## Creating Custom Job Processors

### 1. Define Job Data Type

In `types.ts`:

```typescript
export interface MyJobData extends BaseJobData {
  customField: string;
  anotherField: number;
}

export interface MyJobResult extends JobResult {
  data?: {
    resultField: string;
  };
}
```

### 2. Create Processor

Create `jobs/my.processor.ts`:

```typescript
import { Job } from 'bullmq';
import { logger } from '@/utils/logger';
import { MyJobData, MyJobResult } from '../types';

export async function processMyJob(
  job: Job<MyJobData>
): Promise<MyJobResult> {
  const startTime = Date.now();
  const { customField, anotherField } = job.data;

  try {
    logger.info('Processing my job', { jobId: job.id });

    // Update progress
    await job.updateProgress(25);

    // Do work here
    const result = await doSomething(customField, anotherField);

    await job.updateProgress(100);

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      data: { resultField: result },
      executionTime,
    };
  } catch (error) {
    logger.error('Job failed', { jobId: job.id, error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    };
  }
}
```

### 3. Register Worker

```typescript
import { processMyJob } from '@/services/queue/jobs/my.processor';

await queueService.createWorker(QueueName.MY_QUEUE, processMyJob);
```

## Queue Configuration

Default settings are in `QueueConfig.ts`:

```typescript
export const defaultJobOptions = {
  attempts: 3,                      // Retry 3 times
  backoff: {
    type: 'exponential',
    delay: 1000,                    // Start with 1 second
  },
  removeOnComplete: {
    age: 24 * 60 * 60,              // Keep 24 hours
    count: 1000,                    // Keep last 1000
  },
};
```

Queue-specific overrides:

```typescript
export const queueConfigs = {
  [QueueName.REMINDERS]: {
    attempts: 5,                     // More retries for reminders
    backoff: { type: 'exponential', delay: 2000 },
  },
  [QueueName.PDF_GENERATION]: {
    attempts: 2,                     // Fewer retries for PDFs
  },
};
```

Worker concurrency:

```typescript
export const workerConcurrency = {
  [QueueName.REMINDERS]: 10,         // Process 10 reminders in parallel
  [QueueName.PDF_GENERATION]: 3,     // Process 3 PDFs in parallel (CPU intensive)
  [QueueName.BACKUP]: 1,             // Only 1 backup at a time
};
```

## Monitoring

### Bull Board UI

Access at: `http://localhost:3000/admin/queues`

Features:
- View all queues and their stats
- See active, waiting, completed, failed jobs
- Retry failed jobs
- View job data and results
- Pause/resume queues
- Clean queues

### Logging

All queue operations are logged:

```typescript
// Job added
logger.info('Job added to queue reminders', { jobId: '123', jobName: 'send-reminder' });

// Job processing
logger.info('Processing job 123 from queue reminders', { attempt: 1 });

// Job completed
logger.info('Job completed successfully', { jobId: '123', executionTime: '1250ms' });

// Job failed
logger.error('Job processing failed', { jobId: '123', error: 'Network timeout' });
```

## Error Handling

### Automatic Retries

Jobs are automatically retried based on configuration:

```typescript
// Exponential backoff: 1s, 2s, 4s, 8s, ...
backoff: {
  type: 'exponential',
  delay: 1000,
}
```

### Failed Jobs

Failed jobs are kept for analysis:

```typescript
removeOnFail: {
  age: 7 * 24 * 60 * 60,            // Keep failed jobs for 7 days
  count: 5000,                      // Keep last 5000 failed jobs
}
```

### Error Handling in Processors

```typescript
export async function processJob(job: Job): Promise<JobResult> {
  try {
    // Process job
    return { success: true, data: result };
  } catch (error) {
    // Log error
    logger.error('Job failed', { jobId: job.id, error });

    // Return error result (or throw to retry)
    if (shouldRetry(error)) {
      throw error; // BullMQ will retry
    } else {
      return { success: false, error: error.message };
    }
  }
}
```

## Testing

Run tests:

```bash
# Requires Redis to be configured
pnpm test src/services/queue/QueueService.test.ts
```

Mock Redis for unit tests:

```typescript
import { queueService } from '@/services/queue';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    ping: jest.fn().mockResolvedValue('PONG'),
    quit: jest.fn().mockResolvedValue('OK'),
  }));
});
```

## Performance

### Concurrency

Configure per-queue concurrency in `QueueConfig.ts`:

```typescript
export const workerConcurrency = {
  [QueueName.REMINDERS]: 10,  // High concurrency for I/O bound tasks
  [QueueName.PDF_GENERATION]: 3,  // Low concurrency for CPU bound tasks
};
```

### Redis Connection Pooling

ioredis automatically handles connection pooling. For high-throughput:

```typescript
const connection = new Redis({
  host: 'host',
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  maxConnections: 100, // Increase for high concurrency
});
```

### Job Cleanup

Automatically clean old jobs:

```typescript
removeOnComplete: {
  age: 24 * 60 * 60,  // Remove completed jobs after 24 hours
  count: 1000,        // Keep only last 1000 completed jobs
}
```

## Troubleshooting

### "REDIS_URL is not configured"

Make sure `.env` has valid `REDIS_URL`:

```bash
REDIS_URL=rediss://default:password@host.upstash.io:6379
```

### "Connection timeout"

Check Redis connection:

```bash
redis-cli -h host.upstash.io -p 6379 -a password ping
```

### Jobs not processing

1. Check if worker is created: `queueService.hasWorker(QueueName.REMINDERS)`
2. Check if queue is paused: `await queueService.getQueueMetrics(queueName)`
3. Check Bull Board for errors: `http://localhost:3000/admin/queues`

### High memory usage

- Reduce `removeOnComplete.count` and `removeOnFail.count`
- Clean queues regularly: `queueService.cleanQueue(queueName, grace)`
- Reduce worker concurrency

## Production Considerations

### Scaling

- Run multiple worker processes (horizontal scaling)
- Use separate machines for workers and API servers
- Monitor Redis memory usage (Upstash auto-scales)

### Security

- Use TLS for Redis connection (rediss://)
- Restrict Bull Board access (add authentication middleware)
- Don't expose sensitive data in job data (use IDs, not full objects)

### Monitoring

- Set up alerts for failed job rate
- Monitor queue depth (waiting jobs)
- Track job execution time

### Upstash Pricing

- Free tier: 10,000 commands/day
- Pay-per-request beyond free tier
- Monitor usage in Upstash dashboard

## Example Use Cases

### Send Bulk Reminders

```typescript
const customers = await getCustomersWithOverdueBalance();

for (const customer of customers) {
  await queueService.addJob(QueueName.REMINDERS, 'send-reminder', {
    customerId: customer.id,
    phoneNumber: customer.phone,
    balanceAmount: customer.balance,
    // ... other fields
  });
}
```

### Generate Report PDF

```typescript
const jobId = await queueService.addJob(QueueName.PDF_GENERATION, 'generate-report', {
  type: 'report',
  entityId: reportId,
  khatabookId: khatabookId,
  userId: userId,
});

// Return job ID to client
res.json({ jobId, status: 'processing' });

// Client polls: GET /api/v1/jobs/:jobId
```

### Process Offline Sync

```typescript
// Mobile app sends sync data
const syncData = req.body;

const jobId = await queueService.addJob(QueueName.SYNC, 'sync-offline-data', {
  deviceId: syncData.deviceId,
  khatabookId: syncData.khatabookId,
  changes: syncData.changes,
  userId: req.user.id,
});

// Return immediately
res.json({ success: true, syncJobId: jobId });
```

## Files

```
services/queue/
├── QueueService.ts          # Main service
├── QueueConfig.ts           # Configuration
├── types.ts                 # TypeScript types
├── BullBoard.ts             # Monitoring UI
├── index.ts                 # Exports
├── example.usage.ts         # Usage examples
├── QueueService.test.ts     # Tests
├── README.md                # This file
└── jobs/                    # Job processors
    ├── reminder.processor.ts
    ├── pdf.processor.ts
    ├── sync.processor.ts
    └── index.ts
```

## References

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Bull Board](https://github.com/felixmosh/bull-board)
- [Upstash Redis](https://upstash.com/docs/redis)
- [ioredis Documentation](https://github.com/luin/ioredis)
