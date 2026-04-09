# Queue Service Setup Guide

Complete guide to setting up BullMQ with Upstash Redis for background job processing.

## Prerequisites

- Node.js 20+
- pnpm 8+
- Upstash account (free tier available)

## Step 1: Create Upstash Redis Database

### Option A: Using Upstash Console (Recommended)

1. Go to [https://console.upstash.com/redis](https://console.upstash.com/redis)
2. Click "Create Database"
3. Configure database:
   - **Name**: `khatabook-queue`
   - **Type**: Regional (or Global for multi-region)
   - **Region**: Choose closest to your app (e.g., `us-east-1`, `ap-south-1` for India)
   - **TLS**: Enabled (default)
4. Click "Create"
5. Copy the connection URL from database details page

### Option B: Using Upstash CLI

```bash
# Install Upstash CLI
npm install -g @upstash/cli

# Login
upstash auth login

# Create database
upstash redis create khatabook-queue --region us-east-1

# Get connection string
upstash redis connect khatabook-queue
```

## Step 2: Configure Environment Variables

### Development (.env)

```bash
# Redis (Upstash)
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_HOST.upstash.io:6379
```

Example:
```bash
REDIS_URL=rediss://default:AX-aabBccdDefG12345@cute-parrot-12345.upstash.io:6379
```

### Production

Add the same `REDIS_URL` to your hosting platform's environment variables:

- **Vercel**: Project Settings → Environment Variables
- **Railway**: Project → Variables
- **Heroku**: Settings → Config Vars
- **AWS/Docker**: Use secrets manager or .env file

## Step 3: Verify Connection

Test Redis connection:

```bash
# Using Redis CLI (if installed)
redis-cli -u "rediss://default:PASSWORD@HOST.upstash.io:6379" PING
# Should return: PONG

# Using Node.js
node -e "
const Redis = require('ioredis');
const redis = new Redis('YOUR_REDIS_URL');
redis.ping().then(r => console.log('Connected:', r));
"
```

## Step 4: Initialize Queue Service

### In Your Application (server.ts or app.ts)

```typescript
import express from 'express';
import { queueService } from '@/services/queue';
import { setupBullBoard, shouldEnableBullBoard } from '@/services/queue/BullBoard';
import {
  processReminder,
  processPdfGeneration,
  processSyncJob,
} from '@/services/queue/jobs';
import { QueueName } from '@/services/queue';

const app = express();

async function startServer() {
  try {
    // 1. Initialize queue service
    console.log('Initializing queue service...');
    await queueService.initialize();
    console.log('✓ Queue service connected to Redis');

    // 2. Create workers for each queue
    console.log('Creating queue workers...');
    await queueService.createWorker(QueueName.REMINDERS, processReminder);
    await queueService.createWorker(QueueName.PDF_GENERATION, processPdfGeneration);
    await queueService.createWorker(QueueName.SYNC, processSyncJob);
    console.log('✓ Queue workers started');

    // 3. Setup Bull Board (development only)
    if (shouldEnableBullBoard()) {
      await setupBullBoard(app);
      console.log('✓ Bull Board available at http://localhost:3000/admin/queues');
    }

    // 4. Start Express server
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing gracefully...');
  await queueService.closeAll();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing gracefully...');
  await queueService.closeAll();
  process.exit(0);
});

startServer();
```

## Step 5: Test the Queue Service

### Option A: Run Demo Script

```bash
cd apps/backend
pnpm exec ts-node src/services/queue/demo.ts
```

Expected output:
```
=== Queue Service Demo ===
Step 1: Initializing queue service...
✓ Queue service initialized successfully
Step 2: Creating workers...
✓ Workers created for all queues
Step 3: Adding jobs to queues...
✓ Reminder job added: 1
✓ PDF generation job added: 2
✓ Sync job added: 3
...
```

### Option B: Manual Test

```typescript
import { queueService, QueueName } from '@/services/queue';

// Initialize
await queueService.initialize();

// Add job
const job = await queueService.addJob(
  QueueName.REMINDERS,
  'test-reminder',
  {
    customerId: 'test-customer',
    khatabookId: 'test-khatabook',
    reminderType: 'sms',
    message: 'Test reminder',
    phoneNumber: '+919999999999',
    balanceAmount: 10000,
  }
);

console.log('Job added:', job.id);

// Check status after 2 seconds
setTimeout(async () => {
  const jobStatus = await queueService.getJob(QueueName.REMINDERS, job.id!);
  const state = await jobStatus?.getState();
  console.log('Job status:', state);
}, 2000);
```

## Step 6: Monitor Queues (Bull Board)

1. Start your backend server:
   ```bash
   cd apps/backend
   pnpm dev
   ```

2. Open Bull Board in browser:
   ```
   http://localhost:3000/admin/queues
   ```

3. You should see:
   - List of all queues (reminders, pdf-generation, sync, etc.)
   - Job counts (waiting, active, completed, failed)
   - Job details and logs

## Troubleshooting

### Error: "REDIS_URL is not configured"

**Solution**: Add `REDIS_URL` to your `.env` file:
```bash
REDIS_URL=rediss://default:password@host.upstash.io:6379
```

### Error: "Connection timeout"

**Causes**:
1. Invalid Redis URL
2. Network/firewall blocking port 6379
3. Upstash database is paused (free tier)

**Solutions**:
```bash
# Test connection
redis-cli -u "YOUR_REDIS_URL" PING

# Check Upstash dashboard - database should be "Active"

# Verify URL format (should start with rediss:// for TLS)
```

### Error: "ECONNREFUSED"

**Cause**: Redis is not running or wrong host/port

**Solution**:
- For Upstash: Verify URL in Upstash console
- For local Redis: Start Redis server (`redis-server`)

### Jobs Not Processing

**Checklist**:
1. ✓ Worker created? `queueService.hasWorker(QueueName.REMINDERS)`
2. ✓ Queue paused? Check Bull Board or `getQueueMetrics()`
3. ✓ Redis connected? Check logs for connection errors
4. ✓ Worker concurrency? Check `QueueConfig.ts` settings

### High Memory Usage

**Solutions**:
1. Reduce job retention:
   ```typescript
   removeOnComplete: {
     age: 60 * 60,    // 1 hour instead of 24
     count: 100,      // 100 jobs instead of 1000
   }
   ```

2. Clean queues regularly:
   ```typescript
   // Clean completed jobs older than 1 hour
   await queueService.cleanQueue(QueueName.REMINDERS, 60 * 60 * 1000);
   ```

3. Reduce worker concurrency in `QueueConfig.ts`

### Bull Board Not Loading

**Causes**:
1. Not in development mode
2. Queue service not initialized
3. Port conflict

**Solutions**:
```bash
# Check NODE_ENV
echo $NODE_ENV  # Should be "development"

# Check if Bull Board is enabled
# shouldEnableBullBoard() returns true only in development/test

# Try different port
# In BullBoard.ts, change: serverAdapter.setBasePath('/admin/queues')
```

## Performance Tuning

### For High-Throughput Apps

```typescript
// QueueConfig.ts
export const workerConcurrency = {
  [QueueName.REMINDERS]: 50,  // Increase for I/O-bound tasks
  [QueueName.PDF_GENERATION]: 5,  // Keep low for CPU-bound tasks
};

export const defaultJobOptions = {
  attempts: 2,  // Reduce retries for faster failure
  backoff: {
    type: 'exponential',
    delay: 500,  // Faster retries
  },
  removeOnComplete: true,  // Don't store completed jobs
};
```

### For Low-Memory Environments

```typescript
// QueueConfig.ts
export const workerConcurrency = {
  [QueueName.REMINDERS]: 3,  // Reduce concurrency
  [QueueName.PDF_GENERATION]: 1,
};

export const defaultJobOptions = {
  removeOnComplete: {
    age: 60 * 60,  // 1 hour
    count: 50,     // Keep only 50 jobs
  },
  removeOnFail: {
    age: 60 * 60,  // 1 hour
    count: 100,    // Keep only 100 failed jobs
  },
};
```

## Production Checklist

- [ ] REDIS_URL configured in environment variables
- [ ] Redis connection has TLS enabled (rediss://)
- [ ] Graceful shutdown handlers implemented (SIGTERM/SIGINT)
- [ ] Bull Board disabled in production (or protected with authentication)
- [ ] Job retry limits configured appropriately
- [ ] Job cleanup configured (removeOnComplete, removeOnFail)
- [ ] Worker concurrency tuned for your workload
- [ ] Monitoring/alerting setup for failed jobs
- [ ] Redis backup enabled (Upstash has automatic backups)
- [ ] Error handling in job processors (don't throw on non-retryable errors)

## Monitoring in Production

### Metrics to Track

1. **Queue Depth**: Number of waiting jobs
   ```typescript
   const metrics = await queueService.getQueueMetrics(QueueName.REMINDERS);
   console.log('Waiting jobs:', metrics.waiting);
   ```

2. **Failed Job Rate**: Percentage of jobs that fail
   ```typescript
   const failRate = (metrics.failed / (metrics.completed + metrics.failed)) * 100;
   ```

3. **Job Processing Time**: Average time to complete a job
   ```typescript
   // Track in job processor
   const executionTime = Date.now() - startTime;
   ```

4. **Redis Memory Usage**: Check Upstash dashboard

### Alerts to Setup

- Queue depth > 1000 (jobs piling up)
- Failed job rate > 10%
- Average processing time > 30 seconds
- Redis connection errors

## Cost Optimization (Upstash)

Upstash charges per command. To reduce costs:

1. **Increase job cleanup grace period** (fewer delete commands)
2. **Use removeOnComplete: true** (auto-delete, not counted)
3. **Batch job additions** (add multiple jobs at once)
4. **Reduce worker polling** (BullMQ default is optimized)

### Upstash Free Tier Limits

- 10,000 commands/day
- 256 MB storage
- TLS included

Typical usage:
- 1 job = ~5-10 commands (add, process, complete)
- Free tier = ~1,000-2,000 jobs/day

## Next Steps

1. ✅ Setup complete - Queue service is running
2. 📝 Implement actual job processors (Phase 1):
   - Send SMS/WhatsApp reminders (MSG91 integration)
   - Generate invoice PDFs (puppeteer/pdfkit)
   - Process offline sync (database operations)
3. 🔧 Add job endpoints to API:
   - POST /api/v1/reminders/:id/send → Add reminder job
   - POST /api/v1/invoices/:id/pdf → Add PDF generation job
   - GET /api/v1/jobs/:id → Check job status
4. 📊 Setup monitoring and alerts
5. 🚀 Deploy to production

## Support

- **BullMQ Docs**: https://docs.bullmq.io/
- **Upstash Docs**: https://upstash.com/docs/redis
- **Project Issues**: Contact team or check CLAUDE.md

## Example: Complete Integration

See `example.usage.ts` for complete examples of:
- Adding jobs from controllers
- Checking job status
- Getting queue metrics
- Graceful shutdown
