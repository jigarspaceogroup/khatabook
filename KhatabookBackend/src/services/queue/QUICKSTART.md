# Queue Service - Quick Start Guide

Get the queue service running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- pnpm installed
- This project cloned and dependencies installed

## Step 1: Get Redis Credentials (2 minutes)

1. Go to [Upstash Console](https://console.upstash.com/redis)
2. Sign up/login (free, no credit card required)
3. Click "Create Database"
   - Name: `khatabook-queue`
   - Region: Choose closest (e.g., `ap-south-1` for India)
   - Click "Create"
4. Copy the "REDIS_URL" from the database details

## Step 2: Configure Environment (1 minute)

Create or edit `apps/backend/.env`:

```bash
# Add this line with your actual Upstash URL
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_HOST.upstash.io:6379
```

Example:
```bash
REDIS_URL=rediss://default:AX12aaBbCcDd@cute-parrot-12345.upstash.io:6379
```

## Step 3: Test the Queue Service (2 minutes)

Run the demo script:

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
Step 4: Waiting for jobs to process...
Step 5: Checking job status...
Reminder job status: completed
PDF generation job status: completed
Sync job status: completed
...
=== Demo completed successfully ===
```

## Step 4: View Queue Dashboard (Optional)

1. Start the backend server:
   ```bash
   pnpm dev
   ```

2. Open in browser:
   ```
   http://localhost:3000/admin/queues
   ```

3. You'll see the Bull Board UI showing all queues, job counts, and status.

## That's It!

Queue service is now running. You can:

- Add jobs to queues from anywhere in your code
- Monitor jobs in Bull Board
- Check job status programmatically
- View logs for debugging

## Next Steps

- Read `README.md` for detailed usage
- Read `SETUP.md` for production setup
- See `example.usage.ts` for code examples
- Implement actual job processors (Phase 1)

## Quick Reference

### Add a Job

```typescript
import { queueService, QueueName } from '@/services/queue';

const job = await queueService.addJob(
  QueueName.REMINDERS,
  'send-reminder',
  {
    customerId: 'customer-123',
    phoneNumber: '+919876543210',
    balanceAmount: 10000,
    // ... other required fields
  }
);
```

### Check Job Status

```typescript
const job = await queueService.getJob(QueueName.REMINDERS, jobId);
const state = await job?.getState(); // 'completed', 'failed', etc.
```

### Get Queue Metrics

```typescript
const metrics = await queueService.getQueueMetrics(QueueName.REMINDERS);
console.log(metrics); // { waiting: 10, active: 2, completed: 150, ... }
```

## Troubleshooting

### "REDIS_URL is not configured"

- Check `.env` file exists in `apps/backend/`
- Verify `REDIS_URL` is set correctly
- Make sure URL starts with `rediss://` (with double 's')

### "Connection timeout"

- Verify Redis URL in Upstash console
- Check if database is "Active" in Upstash
- Try pinging: `redis-cli -u "YOUR_REDIS_URL" PING`

### Jobs not processing

- Check if workers are created: `queueService.hasWorker(QueueName.REMINDERS)`
- Check Bull Board for errors: http://localhost:3000/admin/queues
- Check logs for error messages

## Need Help?

- See `SETUP.md` for detailed setup instructions
- See `README.md` for complete documentation
- Check `IMPLEMENTATION_SUMMARY.md` for architecture overview
- Contact team or refer to project documentation
