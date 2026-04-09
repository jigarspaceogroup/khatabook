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
