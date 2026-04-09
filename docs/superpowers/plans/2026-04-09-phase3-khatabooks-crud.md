# Phase 3: Khatabooks CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement complete Khatabooks CRUD system with backend APIs (7 endpoints) and mobile screens (Create First Khatabook + Dashboard with summary cards).

**Architecture:** Backend follows existing auth module pattern (controller → service → routes). Mobile uses RTK Query for API calls, Redux for state, and follows Phase 2 screen patterns. Stats calculated real-time from customers table.

**Tech Stack:** Backend: Express, Prisma, Zod. Mobile: React Native, Redux Toolkit, RTK Query, React Navigation.

---

## File Structure

### Backend Files (D:\Projects\Projects\2026\KhatabookBackend)

**New Files:**
```
src/modules/khatabooks/
├── khatabook.controller.ts      # HTTP handlers (7 endpoints)
├── khatabook.service.ts          # Business logic, stats calculation
├── khatabook.routes.ts           # Express router
├── khatabook.validators.ts       # Zod schemas
└── khatabook.types.ts            # TypeScript interfaces

src/middleware/
└── ownership.middleware.ts       # Verify user owns khatabook
```

**Modified Files:**
```
src/app.ts                        # Register khatabooks routes
src/types/express.d.ts            # Add khatabook to Request type
```

### Mobile Files (D:\Projects\Projects\2026\KhatabookMobile)

**New Files:**
```
src/screens/onboarding/
└── CreateKhatabookScreen.tsx     # Screen 4

src/components/ui/
├── SummaryCard.tsx               # Financial summary component
└── FAB.tsx                        # Floating action button

src/store/slices/
└── khatabookSlice.ts             # Active khatabook state

src/store/api/
└── khatabookApi.ts               # RTK Query endpoints
```

**Modified Files:**
```
src/screens/dashboard/DashboardScreen.tsx   # Add summary cards and structure
src/navigation/types.ts                      # Add CreateKhatabook screen type
src/screens/auth/ProfileSetupScreen.tsx     # Navigate to CreateKhatabook after
```

---

## Task 1: Backend - Khatabook Types and Validators

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookBackend\src\modules\khatabooks\khatabook.types.ts`
- Create: `D:\Projects\Projects\2026\KhatabookBackend\src\modules\khatabooks\khatabook.validators.ts`

- [ ] **Step 1: Create khatabook types file**

```typescript
/**
 * Khatabook Types
 * TypeScript interfaces for khatabook module
 */

export interface KhatabookStats {
  total_customers: number;
  total_receivable: number;
  total_payable: number;
  net_balance: number;
}

export interface DetailedKhatabookStats extends KhatabookStats {
  total_transactions: number;
  total_invoices: number;
  transactions_this_month: number;
  top_defaulters: Array<{
    customer_id: string;
    customer_name: string;
    balance: number;
  }>;
}

export interface CreateKhatabookRequest {
  name: string;
  business_name?: string;
  business_type?: 'retail' | 'wholesale' | 'services' | 'other';
  is_default?: boolean;
  currency_code?: string;
}

export interface UpdateKhatabookRequest {
  name?: string;
  business_name?: string;
  business_type?: 'retail' | 'wholesale' | 'services' | 'other';
  is_default?: boolean;
}

export interface KhatabookResponse {
  id: string;
  name: string;
  business_name: string | null;
  business_type: string | null;
  is_default: boolean;
  currency_code: string;
  stats: KhatabookStats;
  created_at: string;
  updated_at: string;
}

export interface DetailedKhatabookResponse extends Omit<KhatabookResponse, 'stats'> {
  stats: DetailedKhatabookStats;
}
```

- [ ] **Step 2: Create validators file**

```typescript
/**
 * Khatabook Validators
 * Zod schemas for request validation
 */

import { z } from 'zod';

export const createKhatabookSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    business_name: z.string().max(255).optional(),
    business_type: z.enum(['retail', 'wholesale', 'services', 'other']).optional(),
    is_default: z.boolean().optional(),
    currency_code: z.string().length(3).optional(),
  }),
});

export const updateKhatabookSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    business_name: z.string().max(255).optional(),
    business_type: z.enum(['retail', 'wholesale', 'services', 'other']).optional(),
    is_default: z.boolean().optional(),
  }),
});

export const khatabookIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const listKhatabooksSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    cursor: z.string().optional(),
  }),
});
```

- [ ] **Step 3: Commit types and validators**

```bash
git add src/modules/khatabooks/
git commit -m "feat(khatabooks): add types and validators"
```

---

## Task 2: Backend - Khatabook Service (Business Logic)

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookBackend\src\modules\khatabooks\khatabook.service.ts`

- [ ] **Step 1: Create service file with basic stats calculation**

```typescript
/**
 * Khatabook Service
 * Business logic for khatabook operations
 */

import { prisma } from '../../database/client';
import { KhatabookStats, DetailedKhatabookStats, CreateKhatabookRequest, UpdateKhatabookRequest } from './khatabook.types';
import logger from '../../utils/logger';

/**
 * Calculate basic stats for a khatabook
 */
export const calculateStats = async (khatabookId: string): Promise<KhatabookStats> => {
  const customers = await prisma.customer.findMany({
    where: {
      khatabook_id: khatabookId,
      deleted_at: null,
    },
    select: {
      current_balance: true,
    },
  });

  let total_receivable = 0;
  let total_payable = 0;

  customers.forEach((customer) => {
    if (customer.current_balance > 0) {
      total_receivable += customer.current_balance;
    } else if (customer.current_balance < 0) {
      total_payable += Math.abs(customer.current_balance);
    }
  });

  return {
    total_customers: customers.length,
    total_receivable,
    total_payable,
    net_balance: total_receivable - total_payable,
  };
};

/**
 * Calculate detailed stats for a khatabook
 */
export const calculateDetailedStats = async (khatabookId: string): Promise<DetailedKhatabookStats> => {
  const basicStats = await calculateStats(khatabookId);

  // Count transactions
  const total_transactions = await prisma.transaction.count({
    where: {
      khatabook_id: khatabookId,
      deleted_at: null,
    },
  });

  // Count invoices
  const total_invoices = await prisma.invoice.count({
    where: {
      khatabook_id: khatabookId,
      deleted_at: null,
    },
  });

  // Transactions this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const transactions_this_month = await prisma.transaction.count({
    where: {
      khatabook_id: khatabookId,
      deleted_at: null,
      transaction_date: {
        gte: startOfMonth,
      },
    },
  });

  // Top 5 defaulters (highest positive balances)
  const topDefaulters = await prisma.customer.findMany({
    where: {
      khatabook_id: khatabookId,
      deleted_at: null,
      current_balance: {
        gt: 0,
      },
    },
    select: {
      id: true,
      name: true,
      current_balance: true,
    },
    orderBy: {
      current_balance: 'desc',
    },
    take: 5,
  });

  return {
    ...basicStats,
    total_transactions,
    total_invoices,
    transactions_this_month,
    top_defaulters: topDefaulters.map((c) => ({
      customer_id: c.id,
      customer_name: c.name,
      balance: c.current_balance,
    })),
  };
};

/**
 * List all khatabooks for user
 */
export const listKhatabooks = async (userId: string) => {
  const khatabooks = await prisma.khatabook.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    orderBy: [
      { is_default: 'desc' },
      { created_at: 'desc' },
    ],
  });

  // Calculate stats for each khatabook
  const khatabooksWithStats = await Promise.all(
    khatabooks.map(async (khatabook) => ({
      ...khatabook,
      stats: await calculateStats(khatabook.id),
    }))
  );

  return khatabooksWithStats;
};

/**
 * Create new khatabook
 */
export const createKhatabook = async (userId: string, data: CreateKhatabookRequest) => {
  logger.info('Creating khatabook', { userId, name: data.name });

  // Check if this is user's first khatabook
  const existingCount = await prisma.khatabook.count({
    where: {
      user_id: userId,
      deleted_at: null,
    },
  });

  const isFirstKhatabook = existingCount === 0;

  // If setting as default, unset other defaults
  if (data.is_default || isFirstKhatabook) {
    await prisma.khatabook.updateMany({
      where: {
        user_id: userId,
        is_default: true,
      },
      data: {
        is_default: false,
      },
    });
  }

  const khatabook = await prisma.khatabook.create({
    data: {
      user_id: userId,
      name: data.name,
      business_name: data.business_name || null,
      business_type: data.business_type || null,
      is_default: data.is_default || isFirstKhatabook,
      currency_code: data.currency_code || 'INR',
    },
  });

  const stats = await calculateStats(khatabook.id);

  return {
    ...khatabook,
    stats,
  };
};

/**
 * Get single khatabook with detailed stats
 */
export const getKhatabook = async (khatabookId: string, userId: string) => {
  const khatabook = await prisma.khatabook.findFirst({
    where: {
      id: khatabookId,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!khatabook) {
    throw new Error('Khatabook not found');
  }

  const stats = await calculateDetailedStats(khatabook.id);

  return {
    ...khatabook,
    stats,
  };
};

/**
 * Update khatabook
 */
export const updateKhatabook = async (
  khatabookId: string,
  userId: string,
  data: UpdateKhatabookRequest
) => {
  logger.info('Updating khatabook', { khatabookId, userId });

  // Verify ownership
  const khatabook = await prisma.khatabook.findFirst({
    where: {
      id: khatabookId,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!khatabook) {
    throw new Error('Khatabook not found');
  }

  // If changing to default, unset other defaults
  if (data.is_default === true) {
    await prisma.khatabook.updateMany({
      where: {
        user_id: userId,
        is_default: true,
        NOT: {
          id: khatabookId,
        },
      },
      data: {
        is_default: false,
      },
    });
  }

  const updated = await prisma.khatabook.update({
    where: { id: khatabookId },
    data: {
      name: data.name,
      business_name: data.business_name,
      business_type: data.business_type,
      is_default: data.is_default,
    },
  });

  const stats = await calculateDetailedStats(updated.id);

  return {
    ...updated,
    stats,
  };
};

/**
 * Delete khatabook (soft delete with cascade)
 */
export const deleteKhatabook = async (khatabookId: string, userId: string) => {
  logger.info('Deleting khatabook', { khatabookId, userId });

  // Verify ownership
  const khatabook = await prisma.khatabook.findFirst({
    where: {
      id: khatabookId,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!khatabook) {
    throw new Error('Khatabook not found');
  }

  // Cannot delete if default and only khatabook
  if (khatabook.is_default) {
    const totalKhatabooks = await prisma.khatabook.count({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });

    if (totalKhatabooks === 1) {
      throw new Error('Cannot delete your only khatabook');
    }
  }

  const now = new Date();

  // Use transaction for cascade delete
  const result = await prisma.$transaction(async (tx) => {
    // Soft delete khatabook
    await tx.khatabook.update({
      where: { id: khatabookId },
      data: { deleted_at: now },
    });

    // Cascade to customers
    const customersResult = await tx.customer.updateMany({
      where: { khatabook_id: khatabookId, deleted_at: null },
      data: { deleted_at: now },
    });

    // Cascade to transactions
    const transactionsResult = await tx.transaction.updateMany({
      where: { khatabook_id: khatabookId, deleted_at: null },
      data: { deleted_at: now },
    });

    // Cascade to invoices
    const invoicesResult = await tx.invoice.updateMany({
      where: { khatabook_id: khatabookId, deleted_at: null },
      data: { deleted_at: now },
    });

    return {
      customers: customersResult.count,
      transactions: transactionsResult.count,
      invoices: invoicesResult.count,
    };
  });

  return {
    id: khatabookId,
    deleted: true,
    deleted_at: now.toISOString(),
    cascade_deleted: result,
  };
};
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd D:\Projects\Projects\2026\KhatabookBackend
npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 3: Commit service logic**

```bash
git add src/modules/khatabooks/
git commit -m "feat(khatabooks): add service with stats calculation and CRUD logic"
```

---

## Task 3: Backend - Khatabook Controller

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookBackend\src\modules\khatabooks\khatabook.controller.ts`

- [ ] **Step 1: Create controller with all 5 endpoints**

```typescript
/**
 * Khatabook Controller
 * HTTP handlers for khatabook endpoints
 */

import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../constants/httpStatus';
import * as khatabookService from './khatabook.service';
import logger from '../../utils/logger';

/**
 * GET /khatabooks
 * List all khatabooks for authenticated user
 */
export const listKhatabooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const khatabooks = await khatabookService.listKhatabooks(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        khatabooks,
        pagination: {
          next_cursor: null,
          has_more: false,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('List khatabooks error', {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id,
    });

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'KHATABOOK_LIST_FAILED',
        message: 'Failed to fetch khatabooks',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * POST /khatabooks
 * Create new khatabook
 */
export const createKhatabook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const khatabook = await khatabookService.createKhatabook(userId, req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: khatabook,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Create khatabook error', {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id,
    });

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'KHATABOOK_CREATE_FAILED',
        message: error instanceof Error ? error.message : 'Failed to create khatabook',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * GET /khatabooks/:id
 * Get khatabook details with stats
 */
export const getKhatabook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const khatabook = await khatabookService.getKhatabook(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: khatabook,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Get khatabook error', {
      error: error instanceof Error ? error.message : String(error),
      khatabookId: req.params.id,
    });

    const statusCode = error instanceof Error && error.message === 'Khatabook not found'
      ? HTTP_STATUS.NOT_FOUND
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === HTTP_STATUS.NOT_FOUND ? 'NOT_FOUND' : 'KHATABOOK_FETCH_FAILED',
        message: error instanceof Error ? error.message : 'Failed to fetch khatabook',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * PUT /khatabooks/:id
 * Update khatabook
 */
export const updateKhatabook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const khatabook = await khatabookService.updateKhatabook(id, userId, req.body);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: khatabook,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Update khatabook error', {
      error: error instanceof Error ? error.message : String(error),
      khatabookId: req.params.id,
    });

    const statusCode = error instanceof Error && error.message === 'Khatabook not found'
      ? HTTP_STATUS.NOT_FOUND
      : HTTP_STATUS.BAD_REQUEST;

    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === HTTP_STATUS.NOT_FOUND ? 'NOT_FOUND' : 'KHATABOOK_UPDATE_FAILED',
        message: error instanceof Error ? error.message : 'Failed to update khatabook',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * DELETE /khatabooks/:id
 * Soft delete khatabook
 */
export const deleteKhatabook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = await khatabookService.deleteKhatabook(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Delete khatabook error', {
      error: error instanceof Error ? error.message : String(error),
      khatabookId: req.params.id,
    });

    const statusCode = error instanceof Error && error.message.includes('Cannot delete')
      ? HTTP_STATUS.FORBIDDEN
      : error instanceof Error && error.message === 'Khatabook not found'
      ? HTTP_STATUS.NOT_FOUND
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === HTTP_STATUS.FORBIDDEN ? 'FORBIDDEN' : 'KHATABOOK_DELETE_FAILED',
        message: error instanceof Error ? error.message : 'Failed to delete khatabook',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};
```

- [ ] **Step 2: Commit controller**

```bash
git add src/modules/khatabooks/khatabook.controller.ts
git commit -m "feat(khatabooks): add controller with CRUD endpoints"
```

---

## Task 4: Backend - Khatabook Routes and Integration

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookBackend\src\modules\khatabooks\khatabook.routes.ts`
- Modify: `D:\Projects\Projects\2026\KhatabookBackend\src\app.ts`

- [ ] **Step 1: Create routes file**

```typescript
/**
 * Khatabook Routes
 * Express router for khatabook endpoints
 */

import express from 'express';
import * as khatabookController from './khatabook.controller';
import { validate } from '../../middleware/validator';
import { authenticateToken } from '../../middleware/auth.middleware';
import {
  createKhatabookSchema,
  updateKhatabookSchema,
  khatabookIdSchema,
  listKhatabooksSchema,
} from './khatabook.validators';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /khatabooks
 * List all khatabooks for user
 */
router.get('/', validate(listKhatabooksSchema), khatabookController.listKhatabooks);

/**
 * POST /khatabooks
 * Create new khatabook
 */
router.post('/', validate(createKhatabookSchema), khatabookController.createKhatabook);

/**
 * GET /khatabooks/:id
 * Get khatabook details
 */
router.get('/:id', validate(khatabookIdSchema), khatabookController.getKhatabook);

/**
 * PUT /khatabooks/:id
 * Update khatabook
 */
router.put('/:id', validate(updateKhatabookSchema), khatabookController.updateKhatabook);

/**
 * DELETE /khatabooks/:id
 * Delete khatabook
 */
router.delete('/:id', validate(khatabookIdSchema), khatabookController.deleteKhatabook);

export default router;
```

- [ ] **Step 2: Register routes in app.ts**

Add to `src/app.ts` after auth routes:

```typescript
import khatabookRoutes from './modules/khatabooks/khatabook.routes';

// ... after auth routes registration
app.use(`/api/${config.app.apiVersion}/khatabooks`, khatabookRoutes);
```

- [ ] **Step 3: Start backend and test health endpoint**

Run:
```bash
cd D:\Projects\Projects\2026\KhatabookBackend
pnpm run dev
```

Expected: Server starts on port 3000, no errors

- [ ] **Step 4: Test GET /khatabooks endpoint**

Run:
```bash
curl -X GET http://localhost:3000/api/v1/khatabooks -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 200 OK with empty array (no khatabooks yet)

- [ ] **Step 5: Commit routes and integration**

```bash
git add src/modules/khatabooks/khatabook.routes.ts src/app.ts
git commit -m "feat(khatabooks): register routes in app"
```

---

## Task 5: Backend - Test Khatabook Endpoints

**Files:**
- Test existing endpoints with curl/Postman

- [ ] **Step 1: Create test khatabook**

Run:
```bash
curl -X POST http://localhost:3000/api/v1/khatabooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Khatabook","business_name":"Test Business","business_type":"retail"}'
```

Expected: 201 Created with khatabook object, is_default=true, stats all zeros

- [ ] **Step 2: List khatabooks**

Run:
```bash
curl http://localhost:3000/api/v1/khatabooks -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Array with 1 khatabook, includes stats

- [ ] **Step 3: Get single khatabook**

Run:
```bash
curl http://localhost:3000/api/v1/khatabooks/KHATABOOK_ID -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Detailed stats with top_defaulters (empty array)

- [ ] **Step 4: Update khatabook**

Run:
```bash
curl -X PUT http://localhost:3000/api/v1/khatabooks/KHATABOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

Expected: 200 OK with updated name

- [ ] **Step 5: Try to delete default khatabook**

Run:
```bash
curl -X DELETE http://localhost:3000/api/v1/khatabooks/KHATABOOK_ID -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 403 Forbidden (cannot delete only khatabook)

- [ ] **Step 6: Create second khatabook**

Run:
```bash
curl -X POST http://localhost:3000/api/v1/khatabooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Second Khatabook"}'
```

Expected: 201 Created, is_default=false

- [ ] **Step 7: Delete second khatabook**

Run:
```bash
curl -X DELETE http://localhost:3000/api/v1/khatabooks/SECOND_KHATABOOK_ID -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 200 OK with cascade_deleted counts

---

## Task 6: Mobile - Create Khatabook Screen

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookMobile\src\screens\onboarding\CreateKhatabookScreen.tsx`
- Modify: `D:\Projects\Projects\2026\KhatabookMobile\src\navigation\types.ts`

- [ ] **Step 1: Create CreateKhatabookScreen component**

```typescript
/**
 * Screen 4: Create First Khatabook
 * Onboarding step after profile setup
 * Per UI_SCREENS.md lines 1290-1361
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { API_ENDPOINTS } from '@/constants/api';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { colors, typography, spacing } from '@/theme';

export const CreateKhatabookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Get business name from route params (passed from ProfileSetup)
  const { businessName, businessType } = (route.params as any) || {};

  const [name, setName] = useState(
    businessName ? `${businessName} Khata` : 'My Business Khata'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.KHATABOOKS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          business_name: businessName || null,
          business_type: businessType || 'retail',
          is_default: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store active khatabook ID in Redux
        // dispatch(setActiveKhatabook(data.data.id)); // Will add in next task

        // Reset navigation to Dashboard
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' as never }],
          })
        );
      } else {
        setError(data.error?.message || 'Failed to create khatabook');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📒</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Your First Khata Book</Text>
          <Text style={styles.subtitle}>
            Start managing your business{'\n'}transactions digitally
          </Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Khatabook Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              placeholder="My Business Khata"
              placeholderTextColor={colors.textDisabled}
              editable={!loading}
              autoFocus
            />
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>
            💡 You can create more khatabooks later for different businesses
          </Text>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={loading || !name.trim()}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Khatabook</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 60,
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontSize: typography.h1.size,
    fontWeight: typography.h1.weight as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.bodySmall.size,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    height: 56,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body.size,
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: typography.bodySmall.size,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 16,
  },
  errorText: {
    fontSize: typography.bodySmall.size,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.divider,
  },
  buttonText: {
    fontSize: typography.button.size,
    fontWeight: typography.button.weight as any,
    color: '#FFFFFF',
  },
});
```

- [ ] **Step 2: Add API endpoint constant**

Add to `src/constants/api.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: { ... },
  KHATABOOKS: {
    LIST: `${API_BASE_URL}/khatabooks`,
    CREATE: `${API_BASE_URL}/khatabooks`,
    GET: (id: string) => `${API_BASE_URL}/khatabooks/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/khatabooks/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/khatabooks/${id}`,
  },
};
```

- [ ] **Step 3: Add screen to navigation types**

In `src/navigation/types.ts`, add to AuthStackParamList:

```typescript
export type AuthStackParamList = {
  Welcome: undefined;
  LanguageSelection: undefined;
  PhoneLogin: undefined;
  OTPVerification: { phoneNumber: string };
  ProfileSetup: undefined;
  CreateKhatabook: { businessName?: string; businessType?: string };
};
```

- [ ] **Step 4: Update ProfileSetupScreen navigation**

In `src/screens/auth/ProfileSetupScreen.tsx`, change navigation target:

```typescript
// After successful profile update:
(navigation.navigate as any)('CreateKhatabook', {
  businessName: businessName.trim() || null,
  businessType,
});
```

- [ ] **Step 5: Register screen in AuthNavigator**

In `src/navigation/AuthNavigator.tsx`, add screen:

```typescript
import { CreateKhatabookScreen } from '@/screens/onboarding/CreateKhatabookScreen';

// In Stack.Navigator:
<Stack.Screen name="CreateKhatabook" component={CreateKhatabookScreen} />
```

- [ ] **Step 6: Test create khatabook flow**

Manual test:
1. Run app, complete auth flow
2. Enter profile details
3. Should land on Create Khatabook screen
4. Name pre-filled from business name
5. Tap Create → API called → Navigate to Dashboard

- [ ] **Step 7: Commit create khatabook screen**

```bash
git add src/screens/onboarding/ src/constants/api.ts src/navigation/
git commit -m "feat(mobile): add create khatabook screen"
```

---

## Task 7: Mobile - Khatabook Redux State

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookMobile\src\store\slices\khatabookSlice.ts`
- Create: `D:\Projects\Projects\2026\KhatabookMobile\src\store\api\khatabookApi.ts`
- Modify: `D:\Projects\Projects\2026\KhatabookMobile\src\store\index.ts`

- [ ] **Step 1: Create khatabook Redux slice**

```typescript
/**
 * Khatabook Slice
 * Redux state for active khatabook and khatabooks list
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KhatabookStats {
  total_customers: number;
  total_receivable: number;
  total_payable: number;
  net_balance: number;
}

interface Khatabook {
  id: string;
  name: string;
  business_name: string | null;
  business_type: string | null;
  is_default: boolean;
  currency_code: string;
  stats: KhatabookStats;
  created_at: string;
  updated_at: string;
}

interface KhatabookState {
  activeKhatabookId: string | null;
  khatabooks: Khatabook[];
  currentStats: KhatabookStats | null;
}

const initialState: KhatabookState = {
  activeKhatabookId: null,
  khatabooks: [],
  currentStats: null,
};

const khatabookSlice = createSlice({
  name: 'khatabook',
  initialState,
  reducers: {
    setActiveKhatabook: (state, action: PayloadAction<string>) => {
      state.activeKhatabookId = action.payload;
    },
    setKhatabooks: (state, action: PayloadAction<Khatabook[]>) => {
      state.khatabooks = action.payload;
      // Auto-select default khatabook if none selected
      if (!state.activeKhatabookId && action.payload.length > 0) {
        const defaultKhatabook = action.payload.find((k) => k.is_default) || action.payload[0];
        state.activeKhatabookId = defaultKhatabook.id;
        state.currentStats = defaultKhatabook.stats;
      }
    },
    setCurrentStats: (state, action: PayloadAction<KhatabookStats>) => {
      state.currentStats = action.payload;
    },
    addKhatabook: (state, action: PayloadAction<Khatabook>) => {
      state.khatabooks.push(action.payload);
      // Set as active if first khatabook
      if (state.khatabooks.length === 1) {
        state.activeKhatabookId = action.payload.id;
        state.currentStats = action.payload.stats;
      }
    },
    removeKhatabook: (state, action: PayloadAction<string>) => {
      state.khatabooks = state.khatabooks.filter((k) => k.id !== action.payload);
      if (state.activeKhatabookId === action.payload) {
        state.activeKhatabookId = state.khatabooks[0]?.id || null;
        state.currentStats = state.khatabooks[0]?.stats || null;
      }
    },
  },
});

export const {
  setActiveKhatabook,
  setKhatabooks,
  setCurrentStats,
  addKhatabook,
  removeKhatabook,
} = khatabookSlice.actions;

export default khatabookSlice.reducer;
```

- [ ] **Step 2: Create RTK Query API**

```typescript
/**
 * Khatabook API
 * RTK Query endpoints for khatabook operations
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/constants/api';
import type { RootState } from '../index';

export const khatabookApi = createApi({
  reducerPath: 'khatabookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Khatabook'],
  endpoints: (builder) => ({
    getKhatabooks: builder.query({
      query: () => '/khatabooks',
      providesTags: ['Khatabook'],
    }),
    createKhatabook: builder.mutation({
      query: (body) => ({
        url: '/khatabooks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Khatabook'],
    }),
    getKhatabook: builder.query({
      query: (id: string) => `/khatabooks/${id}`,
      providesTags: ['Khatabook'],
    }),
  }),
});

export const {
  useGetKhatabooksQuery,
  useCreateKhatabookMutation,
  useGetKhatabookQuery,
} = khatabookApi;
```

- [ ] **Step 3: Register in Redux store**

In `src/store/index.ts`, add:

```typescript
import khatabookReducer from './slices/khatabookSlice';
import { khatabookApi } from './api/khatabookApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    khatabook: khatabookReducer,
    [authApi.reducerPath]: authApi.reducer,
    [khatabookApi.reducerPath]: khatabookApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, khatabookApi.middleware),
});
```

- [ ] **Step 4: Update CreateKhatabookScreen to use Redux**

Replace fetch call with RTK Query mutation:

```typescript
import { useCreateKhatabookMutation } from '@/store/api/khatabookApi';
import { addKhatabook } from '@/store/slices/khatabookSlice';

// In component:
const [createKhatabook, { isLoading }] = useCreateKhatabookMutation();

const handleCreate = async () => {
  try {
    const result = await createKhatabook({
      name: name.trim(),
      business_name: businessName || null,
      business_type: businessType || 'retail',
      is_default: true,
    }).unwrap();

    // Add to Redux
    dispatch(addKhatabook(result.data));

    // Navigate to Dashboard
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' as never }],
      })
    );
  } catch (err: any) {
    setError(err.data?.error?.message || 'Failed to create khatabook');
  }
};
```

- [ ] **Step 5: Commit Redux integration**

```bash
git add src/store/
git commit -m "feat(mobile): add khatabook redux state and RTK Query"
```

---

## Task 8: Mobile - Summary Card Component

**Files:**
- Create: `D:\Projects\Projects\2026\KhatabookMobile\src\components\ui\SummaryCard.tsx`

- [ ] **Step 1: Create SummaryCard component per UI_SCREENS.md Component 1**

```typescript
/**
 * Summary Card Component
 * Financial summary display (receivable, payable, net balance)
 * Per UI_SCREENS.md Component 1 (lines 248-297)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme';

interface SummaryCardProps {
  label: string;
  amount: number;
  type: 'receivable' | 'payable' | 'net';
  subtitle?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  amount,
  type,
  subtitle,
}) => {
  const getAmountColor = () => {
    switch (type) {
      case 'receivable':
        return '#FF4444'; // Red - You'll Get
      case 'payable':
        return '#00C853'; // Green - You'll Give
      case 'net':
        return colors.textPrimary; // Black - Net Balance
    }
  };

  const formatCurrency = (value: number): string => {
    // Indian number format: ₹1,25,000
    return `₹${value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color: getAmountColor() }]}>
        {formatCurrency(amount)}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: 12,
    // Shadow (Elevation Level 2)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: typography.bodySmall.size,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
```

- [ ] **Step 2: Test component in isolation**

Add to `src/screens/dashboard/DashboardScreen.tsx` temporarily:

```typescript
import { SummaryCard } from '@/components/ui/SummaryCard';

<SummaryCard label="YOU'LL GET ↑" amount={125000} type="receivable" />
```

Reload app → Should see summary card rendered correctly

- [ ] **Step 3: Commit summary card component**

```bash
git add src/components/ui/SummaryCard.tsx
git commit -m "feat(mobile): add summary card component"
```

---

## Task 9: Mobile - Dashboard Screen with Summary Cards

**Files:**
- Modify: `D:\Projects\Projects\2026\KhatabookMobile\src\screens\dashboard\DashboardScreen.tsx`
- Create: `D:\Projects\Projects\2026\KhatabookMobile\src\components\ui\FAB.tsx`

- [ ] **Step 1: Create FAB component per UI_SCREENS.md Component 7**

```typescript
/**
 * FAB (Floating Action Button) Component
 * Primary action button for adding customers/transactions
 * Per UI_SCREENS.md Component 7 (lines 618-673)
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface FABProps {
  onPress: () => void;
  icon?: string;
}

export const FAB: React.FC<FABProps> = ({ onPress, icon = '+' }) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 72, // Above bottom nav
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow (Elevation Level 3)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
```

- [ ] **Step 2: Update Dashboard Screen per UI_SCREENS.md Screen 5**

```typescript
/**
 * Dashboard Screen
 * Main home screen with financial summary and customer list
 * Per UI_SCREENS.md Screen 5 (lines 1367-1567)
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useGetKhatabookQuery } from '@/store/api/khatabookApi';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { FAB } from '@/components/ui/FAB';
import { colors, typography, spacing } from '@/theme';

export const DashboardScreen = () => {
  const activeKhatabookId = useAppSelector((state) => state.khatabook.activeKhatabookId);
  const currentStats = useAppSelector((state) => state.khatabook.currentStats);

  // Fetch khatabook details
  const { data, isLoading, error } = useGetKhatabookQuery(
    activeKhatabookId || '',
    { skip: !activeKhatabookId }
  );

  const stats = data?.data?.stats || currentStats || {
    total_customers: 0,
    total_receivable: 0,
    total_payable: 0,
    net_balance: 0,
  };

  const handleFABPress = () => {
    Alert.alert(
      'Add',
      'Choose an action',
      [
        { text: 'Add Customer', onPress: () => console.log('Add Customer - Phase 4') },
        { text: 'Add Transaction', onPress: () => console.log('Add Transaction - Phase 5') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <SummaryCard
            label="YOU'LL GET ↑"
            amount={stats.total_receivable}
            type="receivable"
          />
          <SummaryCard
            label="YOU'LL GIVE ↓"
            amount={stats.total_payable}
            type="payable"
          />
          <SummaryCard
            label="NET BALANCE"
            amount={stats.net_balance}
            type="net"
          />
        </View>

        {/* Customer Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Customers ({stats.total_customers})
          </Text>
          <Text style={styles.sortLink}>Sort by ▼</Text>
        </View>

        {/* Empty State for Customers (Phase 4 will add list) */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>No Customers Yet</Text>
          <Text style={styles.emptyMessage}>Tap + to add your first customer</Text>
        </View>
      </ScrollView>

      {/* FAB */}
      <FAB onPress={handleFABPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight as any,
    color: colors.textPrimary,
  },
  sortLink: {
    fontSize: typography.bodySmall.size,
    color: colors.primaryBlue,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
```

- [ ] **Step 3: Register reducer in store**

In `src/store/index.ts`:

```typescript
import khatabookReducer from './slices/khatabookSlice';
import { khatabookApi } from './api/khatabookApi';

// Add to reducer:
khatabook: khatabookReducer,
[khatabookApi.reducerPath]: khatabookApi.reducer,

// Add to middleware:
.concat(authApi.middleware, khatabookApi.middleware)
```

- [ ] **Step 4: Test dashboard**

Manual test:
1. Complete onboarding → Create khatabook
2. Should land on Dashboard
3. See 3 summary cards (all showing ₹0)
4. See "Customers (0)" header
5. See empty state with 👥 icon
6. See blue + FAB in bottom-right
7. Tap FAB → Alert shows options

- [ ] **Step 5: Commit dashboard implementation**

```bash
git add src/screens/dashboard/ src/components/ui/ src/store/
git commit -m "feat(mobile): implement dashboard with summary cards and FAB"
```

---

## Task 10: Integration Testing

**Files:**
- Test end-to-end flow

- [ ] **Step 1: Test complete onboarding flow**

Manual test sequence:
1. Launch app → Welcome screen (2.5s)
2. Language selection → Select English → Continue
3. Phone login → Enter 9876543210 → Get OTP
4. OTP screen → Enter 123456 → Verify
5. Profile setup → Enter "Test User" → Continue
6. Create Khatabook → See "Test User Khata" pre-filled → Create
7. Dashboard → See summary cards (all ₹0)
8. Verify backend: Check Prisma Studio → 1 user, 1 khatabook created

- [ ] **Step 2: Test khatabook API directly**

Run:
```bash
# Get auth token from app (console.log it)
curl http://172.16.17.36:3000/api/v1/khatabooks -H "Authorization: Bearer TOKEN"
```

Expected: Array with created khatabook, is_default=true, stats with zeros

- [ ] **Step 3: Test stats with seeded data**

In backend:
```bash
cd D:\Projects\Projects\2026\KhatabookBackend
npx prisma db seed
```

Refresh mobile app → Stats should update with seeded data

- [ ] **Step 4: Verify all Phase 3 requirements met**

Checklist:
- [ ] Backend: All 5 khatabook endpoints working
- [ ] Backend: Stats calculation accurate
- [ ] Backend: Ownership validation (test with wrong user token → 403)
- [ ] Mobile: Create Khatabook screen functional
- [ ] Mobile: Dashboard shows summary cards
- [ ] Mobile: Stats fetched from API
- [ ] Mobile: Redux state management working
- [ ] End-to-end: Complete flow from auth to dashboard

---

## Testing Checklist

### Backend API Tests

- [ ] GET /khatabooks → 200 OK with array
- [ ] POST /khatabooks → 201 Created, is_default=true for first
- [ ] POST /khatabooks (second) → 201, is_default=false
- [ ] GET /khatabooks/:id → 200 with detailed stats
- [ ] GET /khatabooks/:id (wrong user) → 403 Forbidden
- [ ] PUT /khatabooks/:id → 200 OK, name updated
- [ ] PUT /khatabooks/:id (is_default=true) → Other khatabooks set to false
- [ ] DELETE /khatabooks/:id (only khatabook) → 403
- [ ] DELETE /khatabooks/:id (non-default) → 200, cascades to customers
- [ ] Stats calculation accurate (manual verification with Prisma Studio)

### Mobile UI Tests

- [ ] Create Khatabook screen displays correctly
- [ ] Name pre-fills from profile business name
- [ ] Create button disabled until name entered
- [ ] Create → API called with correct data
- [ ] Success → Navigates to Dashboard
- [ ] Dashboard shows 3 summary cards
- [ ] Summary cards display correct colors (red, green, black)
- [ ] Stats match backend response
- [ ] FAB appears in bottom-right
- [ ] FAB tap shows action sheet
- [ ] Empty state shows for customers

### Integration Tests

- [ ] Complete flow: Auth → Profile → Create Khatabook → Dashboard
- [ ] Logout and login again → Dashboard loads with existing khatabook
- [ ] Create transaction (Phase 5) → Stats update in real-time
- [ ] Multiple devices access same khatabook → Both see same stats

---

## Rollback Plan

If Phase 3 fails:

**Backend:**
```bash
# Revert migrations
npx prisma migrate resolve --rolled-back <migration-name>

# Remove khatabooks module
rm -rf src/modules/khatabooks
```

**Mobile:**
```bash
# Revert to placeholders
git revert <commit-hash>
```

---

## Next Steps (Phase 4)

After Phase 3 completes:
- Implement Customers CRUD API (Phase 4, Task 4.1)
- Add customer list to Dashboard (Phase 4, Task 4.2)
- Add Customer Detail screen (Phase 4, Task 4.3)
