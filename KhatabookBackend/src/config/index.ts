/**
 * Environment Configuration
 * Validates and exports environment variables using Zod
 */

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Environment validation schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),
  API_VERSION: z.string().default('v1'),

  // Database (optional for Phase 0, required later)
  DATABASE_URL: z.string().url().optional(),

  // Redis (optional for Phase 0, required for queue service)
  // Format: redis://user:password@host:port or rediss:// for TLS
  // Upstash format: rediss://default:password@host.upstash.io:port
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_TLS: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default('24h'),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default('30d'),

  // Supabase (optional for Phase 0)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  // MSG91 (optional for Phase 0)
  MSG91_API_KEY: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),

  // Razorpay (optional for Phase 0)
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  // Cloudflare R2 (optional for Phase 0)
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().url().optional(),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),

  // Cloudinary (optional for Phase 0)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Sentry (optional for Phase 0)
  SENTRY_DSN: z.string().url().optional(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Validate environment variables
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Environment validation failed:');
    console.error(JSON.stringify(error.errors, null, 2));
    process.exit(1);
  }
  throw error;
}

// Export validated config
export const config = {
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    apiVersion: env.API_VERSION,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    tls: env.REDIS_TLS,
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTokenExpiry: env.JWT_ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: env.JWT_REFRESH_TOKEN_EXPIRY,
  },
  supabase: {
    url: env.SUPABASE_URL,
    serviceKey: env.SUPABASE_SERVICE_KEY,
    anonKey: env.SUPABASE_ANON_KEY,
  },
  msg91: {
    apiKey: env.MSG91_API_KEY,
    senderId: env.MSG91_SENDER_ID,
  },
  razorpay: {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
  },
  cloudflareR2: {
    accountId: env.CLOUDFLARE_R2_ACCOUNT_ID,
    accessKey: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    bucketName: env.CLOUDFLARE_R2_BUCKET_NAME,
    endpoint: env.CLOUDFLARE_R2_ENDPOINT,
    publicUrl: env.CLOUDFLARE_R2_PUBLIC_URL,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
  sentry: {
    dsn: env.SENTRY_DSN,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
} as const;

export type Config = typeof config;
