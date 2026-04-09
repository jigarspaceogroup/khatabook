# Khatabook Clone - Technical Architecture Document

**Document Version:** 1.0
**Date:** April 3, 2026
**Status:** Design Approved - Ready for Implementation
**Architecture Approach:** Managed Services Hybrid

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [Project Structure](#3-project-structure)
4. [System Architecture](#4-system-architecture)
5. [API Design](#5-api-design)
6. [State Management Strategy](#6-state-management-strategy)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [Environment Variables](#8-environment-variables)
9. [Third-Party Services](#9-third-party-services)
10. [Security Considerations](#10-security-considerations)
11. [Performance Optimizations](#11-performance-optimizations)
12. [Development Workflow](#12-development-workflow)
13. [Deployment Strategy](#13-deployment-strategy)
14. [Monitoring & Observability](#14-monitoring--observability)

---

## 1. Executive Summary

### Project Overview

Building a **Khatabook Clone** - a mobile-first ledger management application for Indian small businesses. The app enables business owners to digitally manage customer credit/debit, send payment reminders, generate GST-compliant invoices, track inventory, and gain business insights.

### Architecture Decision

**Selected Approach:** Managed Services Hybrid (Approach 2)

**Rationale:**

- Balances control with convenience
- Reduces DevOps burden by 60%
- Uses managed services (Supabase, Upstash) while keeping core business logic custom
- Cost-effective: ~$30-40/month in production
- Fast development cycle
- Production-ready scale (handles 100K+ users)

### Key Technical Decisions

| Decision              | Choice                                  | Rationale                                                         |
| --------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| **Mobile Framework**  | React Native                            | Cross-platform (iOS + Android), single codebase, fast development |
| **Backend Framework** | Node.js + Express + TypeScript          | JavaScript ecosystem consistency, excellent async support         |
| **Database**          | Supabase PostgreSQL                     | Managed service, built-in auth, real-time capabilities            |
| **ORM**               | Prisma                                  | Type-safe, excellent DX, auto-generated types                     |
| **Cache**             | Upstash Redis                           | Serverless, pay-per-request, free tier available                  |
| **API Style**         | REST                                    | Simple, widely supported, works everywhere                        |
| **State Management**  | Redux Toolkit + RTK Query               | Official recommendation, built-in best practices                  |
| **File Storage**      | Cloudflare R2 + Cloudinary              | Free tiers, R2 for PDFs, Cloudinary for images                    |
| **Authentication**    | Supabase Auth + Firebase                | Phone OTP, fallback redundancy                                    |
| **Deployment**        | Railway (backend) + App Stores (mobile) | Simple deployment, auto-scaling                                   |

---

## 2. Tech Stack Summary

### Mobile App (React Native)

```yaml
Core:
  Framework: React Native 0.73+
  Language: TypeScript 5.x
  Build Tool: Metro Bundler

State & Data:
  State Management: Redux Toolkit + RTK Query
  Local Database: WatermelonDB (reactive, offline-first, built on SQLite)
  Local Storage: AsyncStorage
  Secure Storage: react-native-keychain

Navigation & UI:
  Navigation: React Navigation 6.x
  UI Framework: React Native Paper (Material Design)
  Forms: React Hook Form + Zod validation
  Lists: FlashList (high-performance)

Utilities:
  Date/Time: date-fns + Day.js
  Charts: Victory Native
  i18n: react-i18next
  Biometrics: react-native-biometrics
  Camera: react-native-vision-camera
  Image Picker: react-native-image-picker
  Network: @react-native-community/netinfo
  Push Notifications: @react-native-firebase/messaging
```

### Backend (Node.js)

```yaml
Core:
  Runtime: Node.js 20 LTS
  Framework: Express.js 4.x
  Language: TypeScript 5.x

Database & Cache:
  ORM: Prisma 5.x
  Database: Supabase PostgreSQL 15
  Cache: Upstash Redis (serverless)

Validation & Security:
  Validation: Zod
  Authentication: JWT + Supabase Auth + Firebase Auth
  Encryption: crypto (AES-256-GCM)

Background Jobs:
  Job Queue: BullMQ
  Scheduler: node-cron

File Processing:
  PDF Generation: Puppeteer
  Excel/CSV: ExcelJS
  Image Processing: Sharp

Utilities:
  Logging: Winston + Morgan
  Testing: Jest + Supertest
  API Docs: Swagger/OpenAPI
```

### Infrastructure & Services

```yaml
Hosting:
  Backend: Railway
  Mobile: App Store + Play Store

Database & Storage:
  Primary DB: Supabase PostgreSQL
  Cache: Upstash Redis
  Files (PDFs): Cloudflare R2
  Images: Cloudinary
  Small Files: Supabase Storage

Third-Party Services:
  Phone OTP: Supabase Auth (primary) + Firebase Auth (backup)
  SMS: MSG91
  WhatsApp: Twilio WhatsApp Business API
  Payments: Razorpay
  Email: Resend
  Push Notifications: Firebase Cloud Messaging

Monitoring:
  Error Tracking: Sentry
  Analytics: PostHog (self-hostable)
  Logging: Winston (JSON format)

Development:
  Version Control: Git + GitHub
  CI/CD: GitHub Actions
  Code Quality: ESLint + Prettier + Husky
```

---

## 3. Project Structure

### Monorepo Layout

```
khatabook-clone/
├── apps/
│   ├── mobile/                 # React Native app
│   └── backend/                # Node.js API server
├── packages/                   # Shared code
│   ├── types/                  # Shared TypeScript types
│   ├── constants/              # Shared constants
│   └── utils/                  # Shared utilities
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   ├── architecture/           # Architecture diagrams
│   └── superpowers/
│       └── specs/              # Design specs
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── docker-compose.yml          # Local development services
├── package.json                # Root package.json (workspaces)
├── pnpm-workspace.yaml         # pnpm workspaces config
└── turbo.json                  # Turborepo config (optional)
```

### Mobile App Structure (`apps/mobile/`)

```
apps/mobile/
├── src/
│   ├── navigation/                    # Navigation setup
│   │   ├── AppNavigator.tsx           # Root navigator
│   │   ├── AuthNavigator.tsx          # Auth flow
│   │   ├── MainNavigator.tsx          # Bottom tabs
│   │   └── types.ts
│   │
│   ├── screens/                       # Screen components
│   │   ├── auth/
│   │   │   ├── LanguageSelectionScreen.tsx
│   │   │   ├── PhoneLoginScreen.tsx
│   │   │   ├── OTPVerificationScreen.tsx
│   │   │   └── ProfileSetupScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── customers/
│   │   │   ├── CustomerListScreen.tsx
│   │   │   ├── CustomerDetailScreen.tsx
│   │   │   └── AddCustomerScreen.tsx
│   │   ├── transactions/
│   │   │   ├── AddTransactionScreen.tsx
│   │   │   └── TransactionDetailScreen.tsx
│   │   ├── invoices/
│   │   │   ├── InvoiceListScreen.tsx
│   │   │   ├── CreateInvoiceScreen.tsx
│   │   │   └── InvoicePreviewScreen.tsx
│   │   ├── reports/
│   │   │   └── ReportsScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/                    # Reusable components
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── FAB.tsx
│   │   ├── customers/
│   │   │   └── CustomerListItem.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionListItem.tsx
│   │   │   └── AmountInput.tsx
│   │   └── shared/
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── OfflineBanner.tsx
│   │
│   ├── store/                         # Redux store
│   │   ├── index.ts                   # Store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── khatabookSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── syncSlice.ts
│   │   └── api/
│   │       ├── baseApi.ts
│   │       ├── authApi.ts
│   │       ├── customerApi.ts
│   │       └── transactionApi.ts
│   │
│   ├── services/                      # Business logic
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── interceptors.ts
│   │   ├── database/
│   │   │   ├── schema.ts              # WatermelonDB schema
│   │   │   └── models/
│   │   │       ├── Customer.ts
│   │   │       ├── Transaction.ts
│   │   │       └── SyncQueue.ts
│   │   ├── sync/
│   │   │   ├── SyncEngine.ts
│   │   │   ├── ConflictResolver.ts
│   │   │   └── QueueManager.ts
│   │   ├── auth/
│   │   │   ├── AuthService.ts
│   │   │   └── BiometricService.ts
│   │   └── notifications/
│   │       └── FCMService.ts
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── useSync.ts
│   │   └── useCustomers.ts
│   │
│   ├── utils/                         # Utilities
│   │   ├── formatters/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   └── number.ts
│   │   ├── validators/
│   │   │   ├── phone.ts
│   │   │   └── schemas.ts
│   │   └── calculations/
│   │       ├── balance.ts
│   │       └── gst.ts
│   │
│   ├── localization/                  # i18n
│   │   ├── i18n.ts
│   │   └── languages/
│   │       ├── en.json
│   │       ├── hi.json
│   │       └── ta.json
│   │
│   ├── theme/                         # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   ├── types/                         # TypeScript types
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── navigation.ts
│   │
│   ├── constants/
│   │   ├── api.ts
│   │   └── config.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── App.tsx
│
├── android/                           # Android native
├── ios/                               # iOS native
├── __tests__/                         # Tests
├── .env.development
├── .env.staging
├── .env.production
├── package.json
└── tsconfig.json
```

### Backend Structure (`apps/backend/`)

```
apps/backend/
├── src/
│   ├── modules/                       # Domain modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validators.ts
│   │   │   └── auth.types.ts
│   │   ├── khatabooks/
│   │   │   ├── khatabook.controller.ts
│   │   │   ├── khatabook.service.ts
│   │   │   └── khatabook.routes.ts
│   │   ├── customers/
│   │   ├── transactions/
│   │   ├── invoices/
│   │   │   └── pdf/
│   │   │       ├── PDFGenerator.ts
│   │   │       └── templates/
│   │   ├── reports/
│   │   ├── notifications/
│   │   │   ├── sms/
│   │   │   │   └── MSG91Service.ts
│   │   │   ├── whatsapp/
│   │   │   │   └── TwilioWhatsAppService.ts
│   │   │   └── push/
│   │   │       └── FCMService.ts
│   │   ├── payments/
│   │   │   └── providers/
│   │   │       └── RazorpayService.ts
│   │   ├── sync/
│   │   │   ├── sync.controller.ts
│   │   │   ├── sync.service.ts
│   │   │   ├── PushHandler.ts
│   │   │   ├── PullHandler.ts
│   │   │   └── ConflictResolver.ts
│   │   └── inventory/                 # P2 feature
│   │
│   ├── database/
│   │   ├── client.ts                  # Prisma client
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── cors.middleware.ts
│   │
│   ├── services/                      # Shared services
│   │   ├── cache/
│   │   │   └── RedisService.ts
│   │   ├── storage/
│   │   │   ├── R2Service.ts
│   │   │   ├── CloudinaryService.ts
│   │   │   └── SupabaseStorageService.ts
│   │   ├── queue/
│   │   │   ├── QueueService.ts
│   │   │   └── jobs/
│   │   │       ├── SendReminderJob.ts
│   │   │       ├── GeneratePDFJob.ts
│   │   │       └── SyncBackupJob.ts
│   │   └── email/
│   │       └── ResendService.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   ├── errors.ts
│   │   └── encryption.ts
│   │
│   ├── types/
│   │   ├── express.d.ts
│   │   ├── models.ts
│   │   └── api.ts
│   │
│   ├── config/
│   │   ├── index.ts
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── supabase.ts
│   │
│   ├── constants/
│   │   ├── errorCodes.ts
│   │   └── httpStatus.ts
│   │
│   ├── app.ts                         # Express app
│   └── server.ts                      # Entry point
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.development
├── .env.staging
├── .env.production
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 4. System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MOBILE CLIENTS                           │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │   iOS App        │              │   Android App     │         │
│  │  React Native    │              │  React Native     │         │
│  └────────┬─────────┘              └─────────┬─────────┘         │
│           │                                   │                   │
│           │  ┌─────────────────────────────┐ │                   │
│           └──│  Local Storage Layer        │─┘                   │
│              │  - WatermelonDB (SQLite)    │                     │
│              │  - AsyncStorage             │                     │
│              │  - Secure Storage           │                     │
│              └──────────┬──────────────────┘                     │
│                         │                                         │
│              ┌──────────▼──────────────────┐                     │
│              │   Sync Engine               │                     │
│              │   - Push Queue              │                     │
│              │   - Pull Handler            │                     │
│              │   - Conflict Resolution     │                     │
│              └──────────┬──────────────────┘                     │
└─────────────────────────┼──────────────────────────────────────┘
                          │
                    HTTPS/TLS (REST API)
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│                    CLOUDFLARE CDN                               │
│                    - DDoS Protection                            │
│                    - SSL/TLS Termination                        │
│                    - R2 Static Assets                           │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│                    RAILWAY PLATFORM                             │
│  ┌────────────────────────────────────────────────────────────┐│
│  │              NODE.JS BACKEND (Express)                     ││
│  │                                                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │  │ Auth Module  │  │Customer Mod  │  │Transaction   │    ││
│  │  │ - OTP        │  │- CRUD        │  │Module        │    ││
│  │  │ - JWT        │  │- Search      │  │- Credit/Debit│    ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘    ││
│  │                                                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │  │Invoice Module│  │Reports Module│  │Notification  │    ││
│  │  │- PDF Gen     │  │- Analytics   │  │Module        │    ││
│  │  │- GST Calc    │  │- Export      │  │- SMS/WhatsApp│    ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘    ││
│  │                                                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │  │Payment Module│  │ Sync Module  │  │Inventory Mod │    ││
│  │  │- Razorpay    │  │- Push/Pull   │  │(P2)          │    ││
│  │  │- Webhooks    │  │- Conflicts   │  │              │    ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘    ││
│  │                                                             ││
│  │  ┌────────────────────────────────────────────────────┐   ││
│  │  │           Middleware Layer                          │   ││
│  │  │  Auth • Validation • Error • Logging • Rate Limit  │   ││
│  │  └────────────────────────────────────────────────────┘   ││
│  └─────────────────────────┬───────────────────────────────────┘│
└────────────────────────────┼────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼─────────┐  ┌──────▼──────────┐
│   SUPABASE     │  │  UPSTASH REDIS   │  │   BULLMQ        │
│   PostgreSQL   │  │  (Serverless)    │  │   Job Queue     │
│                │  │                  │  │                 │
│ - Users        │  │ - Session Cache  │  │ - PDF Jobs      │
│ - Khatabooks   │  │ - Rate Limiting  │  │ - Reminder Jobs │
│ - Customers    │  │ - Temp Data      │  │ - Sync Jobs     │
│ - Transactions │  │ - Bull Queues    │  │ - Email Jobs    │
│ - Invoices     │  │                  │  │                 │
│ - Products     │  └──────────────────┘  └─────────────────┘
│ - Payments     │
│ - Sync Meta    │
└────────────────┘
```

### Architecture Pattern: Modular Monolith

**Why Modular Monolith:**

- Single deployment unit (simpler operations)
- Shared database transactions (data consistency)
- Easy local development
- Can extract modules to microservices later if needed
- Perfect for PRD's feature scope

**Module Independence:**

- Each module is self-contained with controller → service → routes
- Modules don't directly import from each other
- Communication via event emitters or dependency injection
- Clear boundaries enable future extraction

### Data Flow: Transaction Recording (Offline-First)

```
USER RECORDS TRANSACTION
         │
         ▼
MOBILE: Validate Input (Zod)
         │
         ▼
MOBILE: Save to WatermelonDB
- Generate local UUID
- Status: "pending_sync"
- Update balance locally
- Add to sync queue
         │
         ▼
MOBILE: Update UI Immediately
- Show success toast
- User continues working
         │
    (Network Check)
         │
    ┌────┴────┐
OFFLINE      ONLINE
    │            │
    │            ▼
    │    SYNC ENGINE
    │    POST /transactions
    │            │
    │            ▼
    │    BACKEND: Validate
    │            │
    │            ▼
    │    BACKEND: Save to DB
    │            │
    │            ▼
    │    RETURN: {id, timestamp}
    │            │
    │            ▼
    │    MOBILE: Update Local
    │    - Map server ID
    │    - Status: "synced"
    │    - Remove from queue
    │
    └──> Stay in queue
         Show "Pending sync"
         Retry when online
```

### Offline-First Sync Strategy

**Sync Queue Priority:**

1. High: Transactions, Payments
2. Medium: Customers, Invoices
3. Low: Reports, Analytics

**Conflict Resolution:**

1. Server wins: Critical data (payments, balances)
2. Last-write-wins: User data (notes, names)
3. Merge strategy: Non-conflicting fields
4. User prompt: Ambiguous conflicts

**Sync Triggers:**

- Network reconnected (automatic)
- App foreground (automatic)
- User pull-to-refresh (manual)
- Every 5 minutes in background (if online)

---

## 5. API Design

### Base Configuration

```
Base URL: https://api.khatabook-clone.com/api/v1

Authentication: Bearer Token (JWT)
Headers:
  - Authorization: Bearer <token>
  - X-Device-ID: <device_uuid>
  - X-App-Version: 1.0.0
```

### Response Format

**Success:**

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Optional message"
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be positive"
      }
    ],
    "timestamp": "2026-04-03T10:30:00Z",
    "path": "/api/v1/transactions",
    "requestId": "req-uuid"
  }
}
```

### Key Endpoints

#### Authentication

```
POST   /auth/send-otp
POST   /auth/verify-otp
POST   /auth/refresh-token
POST   /auth/logout
```

#### Khatabooks

```
GET    /khatabooks
POST   /khatabooks
GET    /khatabooks/:id
PUT    /khatabooks/:id
DELETE /khatabooks/:id
```

#### Customers

```
GET    /khatabooks/:khatabookId/customers
POST   /khatabooks/:khatabookId/customers
GET    /khatabooks/:khatabookId/customers/:customerId
PUT    /khatabooks/:khatabookId/customers/:customerId
DELETE /khatabooks/:khatabookId/customers/:customerId
POST   /khatabooks/:khatabookId/customers/:customerId/settle
```

#### Transactions

```
GET    /khatabooks/:khatabookId/transactions
POST   /khatabooks/:khatabookId/transactions
GET    /khatabooks/:khatabookId/transactions/:transactionId
PUT    /khatabooks/:khatabookId/transactions/:transactionId
DELETE /khatabooks/:khatabookId/transactions/:transactionId
```

#### Invoices

```
GET    /khatabooks/:khatabookId/invoices
POST   /khatabooks/:khatabookId/invoices
GET    /khatabooks/:khatabookId/invoices/:invoiceId
GET    /khatabooks/:khatabookId/invoices/:invoiceId/pdf
```

#### Reports

```
GET    /khatabooks/:khatabookId/reports/dashboard
GET    /khatabooks/:khatabookId/reports/customer-balance
GET    /khatabooks/:khatabookId/reports/transactions
POST   /khatabooks/:khatabookId/reports/export
```

#### Notifications

```
POST   /khatabooks/:khatabookId/notifications/reminder
POST   /khatabooks/:khatabookId/notifications/bulk-reminder
```

#### Sync

```
POST   /sync/push
POST   /sync/pull
```

### HTTP Status Codes

```
200 OK                  - Success
201 Created             - Resource created
204 No Content          - Success, no response
400 Bad Request         - Validation error
401 Unauthorized        - Invalid/missing token
403 Forbidden           - No permission
404 Not Found           - Resource not found
409 Conflict            - Duplicate/conflict
422 Unprocessable       - Business logic error
429 Too Many Requests   - Rate limit exceeded
500 Internal Error      - Server error
503 Service Unavailable - Maintenance
```

---

## 6. State Management Strategy

### Redux Store Architecture

**State Categories:**

1. **Server State (RTK Query)** - Cached API responses, auto-refetching
2. **Client State (Redux Slices)** - UI state, auth, active khatabook
3. **Local Persistent State (WatermelonDB)** - Offline data

### Store Structure

```typescript
store/
├── index.ts                    # Store configuration
├── slices/
│   ├── authSlice.ts           # User, tokens, authentication
│   ├── khatabookSlice.ts      # Active khatabook selection
│   ├── uiSlice.ts             # Modals, toasts, loading
│   └── syncSlice.ts           # Sync queue status
└── api/
    ├── baseApi.ts             # RTK Query base config
    ├── authApi.ts
    ├── customerApi.ts
    └── transactionApi.ts
```

### Redux Slices

**Auth Slice:**

- User profile
- JWT tokens (access + refresh)
- isAuthenticated flag
- Biometric enabled status

**Khatabook Slice:**

- activeKhatabookId
- Khatabooks list with stats
- Quick stats cache

**UI Slice:**

- Global loading state
- Toast notifications queue
- Active modal/bottom sheet
- Network status (online/offline)

**Sync Slice:**

- isSyncing flag
- lastSyncAt timestamp
- pendingCount
- Sync status (idle/syncing/error)

### RTK Query

**Features:**

- Automatic caching
- Cache invalidation via tags
- Optimistic updates
- Automatic refetching
- Built-in loading/error states

**Base Query with Auto-Refresh:**

```typescript
// Intercepts 401 errors
// Attempts token refresh
// Retries original request
// Logs out if refresh fails
```

---

## 7. Error Handling Strategy

### Error Categories

```
NETWORK         - Connection issues
VALIDATION      - User input errors
AUTHENTICATION  - Auth/permission errors
BUSINESS_LOGIC  - Business rule violations
SERVER          - Server errors (5xx)
SYNC            - Sync conflicts
STORAGE         - Local storage errors
UNKNOWN         - Unexpected errors
```

### Backend Error Handling

**Custom Error Classes:**

- AppError (base)
- ValidationError (400)
- AuthenticationError (401)
- AuthorizationError (403)
- NotFoundError (404)
- ConflictError (409)
- BusinessLogicError (422)
- RateLimitError (429)

**Global Error Handler:**

- Catches all errors
- Converts Prisma/Zod errors to AppError
- Logs to Winston + Sentry
- Returns formatted error response
- Hides stack traces in production

### Mobile Error Handling

**API Interceptor:**

- Catches network errors → show offline banner
- 401 → attempt token refresh → retry or logout
- 400 → validation errors → show field errors
- 429 → rate limit → show retry message
- 5xx → server error → log to Sentry, show generic message

**Error Boundary:**

- Catches React component errors
- Logs to Sentry
- Shows fallback UI
- Provides "Try Again" button

**Graceful Degradation:**

- Network errors → save locally, queue for sync
- Show "Saved locally, will sync when online"
- Continue working offline seamlessly

---

## 8. Environment Variables

### Backend Environment Variables

**Required:**

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<64-char-secret>
JWT_REFRESH_SECRET=<64-char-secret>
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
CLOUDINARY_CLOUD_NAME=...
MSG91_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

**Optional:**

```bash
SENTRY_DSN=https://...
LOG_LEVEL=info
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGINS=https://app.domain.com
```

### Mobile Environment Variables

**Required:**

```bash
APP_ENV=production
API_URL=https://api.khatabook-clone.com/api/v1
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
FIREBASE_ANDROID_API_KEY=...
FIREBASE_IOS_API_KEY=...
RAZORPAY_KEY_ID=...
```

**Optional:**

```bash
SENTRY_DSN=...
POSTHOG_API_KEY=...
ENABLE_OFFLINE_MODE=true
ENABLE_BIOMETRIC_AUTH=true
```

### Environment Management

**Files:**

- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.example` - Template (committed to git)

**Validation:**

- Use Zod schemas to validate env vars on startup
- Fail fast if required variables missing
- Type-safe config object exported from `config/index.ts`

---

## 9. Third-Party Services

### Service Integration Matrix

| Service           | Purpose                     | Priority | Cost                |
| ----------------- | --------------------------- | -------- | ------------------- |
| **Supabase**      | PostgreSQL + Auth + Storage | P0       | $25/mo Pro          |
| **Upstash Redis** | Cache + Sessions            | P0       | Free → $10/mo       |
| **Firebase Auth** | Phone OTP backup            | P0       | Free (< 10K/mo)     |
| **Firebase FCM**  | Push notifications          | P0       | Free                |
| **Cloudflare R2** | File storage (PDFs)         | P0       | Free (10GB)         |
| **Cloudinary**    | Image optimization          | P0       | Free tier           |
| **MSG91**         | SMS/OTP                     | P0       | ~₹0.15/SMS          |
| **Razorpay**      | Payments                    | P1       | 2% + ₹0             |
| **Twilio**        | WhatsApp Business           | P1       | Pay-as-go           |
| **Sentry**        | Error tracking              | P1       | Free (5K events/mo) |
| **Resend**        | Transactional email         | P1       | Free (3K/mo)        |
| **PostHog**       | Analytics                   | P1       | Self-hosted (free)  |

### Key Integrations

**Supabase:**

- PostgreSQL database (managed)
- Built-in authentication (phone OTP)
- Realtime subscriptions
- Storage for small files (avatars, logos)

**Upstash Redis:**

- Serverless Redis (pay-per-request)
- Session management
- Rate limiting counters
- BullMQ job queues

**MSG91:**

- SMS OTP delivery (India-focused)
- Transaction SMS
- ~₹0.15 per SMS
- Excellent delivery rates in India

**Cloudflare R2:**

- S3-compatible object storage
- Free tier: 10GB storage
- Zero egress fees (unlimited downloads)
- Store invoices, reports, receipts

**Cloudinary:**

- Image optimization and transformation
- Automatic format conversion (WebP)
- Thumbnail generation
- Free tier: 25GB storage + 25GB bandwidth/month

**Razorpay:**

- Payment gateway (UPI, cards, wallets)
- Payment links generation
- Webhook notifications
- 2% transaction fee

**Twilio WhatsApp:**

- WhatsApp Business API
- Send reminders via WhatsApp
- Share invoices
- Pay-per-message pricing

---

## 10. Security Considerations

### Authentication & Authorization

**Phone + OTP Authentication:**

- Primary: Supabase Auth
- Backup: Firebase Auth
- SMS via MSG91
- JWT access tokens (24h expiry)
- Refresh tokens (30 days)

**Token Management:**

- Stored securely (Keychain/Keystore on mobile)
- Automatic refresh on 401
- Token blacklist in Redis on logout
- Device-specific tokens (one device = one token)

**Resource Ownership:**

- Middleware checks user owns khatabook
- All queries scoped to user ID
- No cross-user data leakage

### Input Security

**Validation:**

- Zod schemas on both frontend and backend
- Type-safe validation
- Sanitize HTML content (DOMPurify)
- SQL injection prevention (Prisma parameterized queries)

**Rate Limiting:**

- Global: 100 requests per 15 minutes
- OTP: 5 requests per hour per phone
- Login: 10 attempts per hour per IP
- Implemented via Upstash Redis

### Data Security

**Encryption:**

- TLS 1.3 for all API communication
- AES-256-GCM for sensitive data at rest
- SQLCipher for local mobile database
- Encrypted backups

**Secrets Management:**

- Environment variables (never in code)
- Separate secrets per environment
- Rotate secrets regularly
- No secrets in git history

### Security Headers

```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
```

### Compliance

**RBI Guidelines:**

- Data stored in India region (for production)
- Payment gateway compliance
- Secure financial transactions

**GST Compliance:**

- Invoice format per CBIC guidelines
- Proper tax calculations
- E-invoice support (future)

---

## 11. Performance Optimizations

### Database Optimizations

**Indexing:**

```prisma
model Transaction {
  @@index([customerId])
  @@index([khatabookId])
  @@index([customerId, date])
  @@index([khatabookId, createdAt])
}

model Customer {
  @@index([khatabookId])
  @@index([phoneNumber])
}
```

**Query Optimization:**

- Use `include` to avoid N+1 queries
- Limit result sets
- Cursor-based pagination
- Select only needed fields

**Connection Pooling:**

- Prisma connection pool: 10 connections
- Supabase handles connection pooling

### Caching Strategy

**Redis Cache:**

- Customer details (5 min TTL)
- Dashboard stats (2 min TTL)
- User sessions (24 hour TTL)
- Rate limit counters (window-based)

**Cache Invalidation:**

- On update/delete: clear specific cache keys
- On create: invalidate list caches
- Tagged invalidation for related data

### API Performance

**Response Compression:**

- Gzip compression (level 6)
- Reduces bandwidth by ~70%

**API Response Times (Target):**

- P50: < 100ms
- P95: < 200ms
- P99: < 500ms

### Mobile Performance

**React Native Optimizations:**

- Use `React.memo` for expensive components
- `FlashList` for large lists (not FlatList)
- Debounce search inputs
- Lazy load heavy screens
- Optimize images with `FastImage`

**Bundle Size:**

- Code splitting where possible
- Remove unused dependencies
- Compress assets

**Offline Performance:**

- WatermelonDB for reactive local data
- Instant UI updates (optimistic updates)
- Background sync (doesn't block UI)

---

## 12. Development Workflow

### Local Setup

**Prerequisites:**

- Node.js 20+
- pnpm 8+
- Docker Desktop
- PostgreSQL 15+ / Redis 7+
- React Native development environment

**Quick Start:**

```bash
# Clone and install
git clone https://github.com/your-org/khatabook-clone.git
cd khatabook-clone
pnpm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env.development
cp apps/mobile/.env.example apps/mobile/.env.development

# Start services
docker-compose up -d

# Run migrations
cd apps/backend && pnpm prisma migrate dev

# Start backend
pnpm dev

# Start mobile (new terminal)
cd apps/mobile && pnpm ios  # or pnpm android
```

### Git Workflow

**Branches:**

- `main` - Production
- `develop` - Development
- `feature/*` - Features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

**Commit Convention:**

```
feat: add customer search
fix: correct balance calculation
docs: update API docs
chore: upgrade dependencies
test: add customer service tests
```

### Code Quality

**Pre-commit Hooks:**

- ESLint + Prettier
- Type checking
- Lint staged files
- Commitlint

**Required Checks:**

- All tests pass
- No TypeScript errors
- Linting passes
- No console.logs in production code

---

## 13. Deployment Strategy

### Backend Deployment (Railway)

**Process:**

1. Push to `main` branch
2. GitHub Actions runs tests
3. Railway auto-deploys on success
4. Run migrations: `railway run pnpm prisma migrate deploy`
5. Monitor logs: `railway logs`

**Environments:**

- Development: Auto-deploy from `develop`
- Staging: Auto-deploy from `staging`
- Production: Manual deploy from `main`

**Health Checks:**

- `/health` - Overall health
- `/health/db` - Database connection
- `/health/redis` - Redis connection

### Mobile Deployment

**iOS (App Store):**

1. Update version in `package.json` and `Info.plist`
2. Build: `ENVFILE=.env.production`
3. Archive with Xcode
4. Upload to App Store Connect
5. Submit for review

**Android (Play Store):**

1. Update version in `build.gradle`
2. Generate signed AAB: `./gradlew bundleRelease`
3. Upload to Play Console
4. Submit for review

**Automated Deployments:**

- Use Fastlane for both platforms
- GitHub Actions can trigger builds
- Distribute beta builds via TestFlight/Internal Testing

### CI/CD Pipeline

**GitHub Actions:**

- **Backend:** Test → Build → Deploy (Railway)
- **Mobile:** Test → Build → Upload artifacts
- Runs on push to `main` and PR creation
- Codecov for test coverage

---

## 14. Monitoring & Observability

### Error Tracking

**Sentry:**

- Capture exceptions automatically
- Source maps for stack traces
- Release tracking
- Performance monitoring
- Alert on error spikes

**Logging:**

- Winston (backend) - JSON format
- Structured logs with context
- Log levels: error, warn, info, debug
- Separate log files per level

### Metrics & Analytics

**Application Metrics:**

- API response times (P50, P95, P99)
- Error rates per endpoint
- Active users (DAU, MAU)
- Sync success rate
- Database query performance

**Business Metrics:**

- User signups
- Transaction volume
- Invoice generation
- Payment success rate
- Feature adoption rates

### Health Monitoring

**Uptime Monitoring:**

- Railway provides built-in health checks
- External monitoring via UptimeRobot
- Alert on downtime > 2 minutes

**Database Monitoring:**

- Supabase dashboard for metrics
- Query performance insights
- Connection pool usage
- Storage usage

### Alerting

**Critical Alerts:**

- Error rate > 1%
- API response time P95 > 500ms
- Database connection failures
- Sync failure rate > 5%
- Payment webhook failures

**Notification Channels:**

- Email (immediate)
- Slack (optional)
- PagerDuty (production only)

---

## Production Checklist

### Pre-Launch

- [ ] All P0 features implemented and tested
- [ ] Environment variables configured in production
- [ ] Database migrations applied
- [ ] SSL certificates configured (Railway handles this)
- [ ] CORS restricted to production domains
- [ ] Rate limiting enabled
- [ ] Sentry error tracking active
- [ ] Database backups configured (Supabase auto-backup)
- [ ] Load testing completed (100 concurrent users)
- [ ] Security audit passed
- [ ] API documentation published (Swagger)
- [ ] Mobile apps submitted for review
- [ ] Privacy Policy & Terms of Service live
- [ ] Support system ready
- [ ] Analytics tracking configured

### Post-Launch Monitoring

- [ ] Monitor error rates (target: < 0.5%)
- [ ] Check API response times (P95 < 200ms)
- [ ] Verify sync success rate (> 99%)
- [ ] Monitor database performance
- [ ] Track user retention (Day 1, 7, 30)
- [ ] Review Sentry errors daily (first week)
- [ ] Check server resource usage
- [ ] Validate payment webhooks
- [ ] Test SMS/WhatsApp delivery
- [ ] Monitor app store ratings
- [ ] Track crash-free users (> 99.5%)

---

## Cost Breakdown (Monthly)

### Production Infrastructure

```
Supabase Pro:              $25.00
Upstash Redis:             $10.00
Railway Hobby:              $5.00
Cloudflare R2:              $0.00  (10GB free)
Cloudinary:                 $0.00  (free tier)
Firebase (Auth + FCM):      $0.00  (free tier)
Domain (.com):              $1.00  (annual / 12)
SSL Certificate:            $0.00  (Let's Encrypt)
-----------------------------------
Infrastructure Total:      ~$41.00/month

Variable Costs:
MSG91 SMS:                  ~₹0.15 per SMS
Razorpay:                   2% per transaction
Twilio WhatsApp:            ~$0.005 per message
Sentry:                     $0.00 (free tier: 5K events/mo)
Resend:                     $0.00 (free tier: 3K emails/mo)
```

### Scaling Costs

**At 1,000 users:**

- ~$50/month (base + minimal variable costs)

**At 10,000 users:**

- Upgrade Supabase to Pro+ ($99/mo)
- Upgrade Upstash ($20/mo)
- Railway Pro ($20/mo)
- **Total: ~$150/month**

**At 100,000 users:**

- Migrate to custom infrastructure or upgrade tiers
- **Estimated: $500-1000/month**

---

## Timeline Summary (from PRD)

**Phase 1: P0 MVP Development** - 8 weeks

- Authentication, customer management, transactions, sync

**Phase 2: P0 Completion** - 4 weeks

- Reminders, basic reports, data backup

**Phase 3: P1 Features** - 6 weeks

- Invoicing, payments, multiple ledgers, advanced dashboard

**Phase 4: P2 Features** - 6 weeks

- Inventory, multi-language, offline refinement

**Total to Full Launch:** ~27 weeks (6.5 months)

---

## Appendix

### Key Design Decisions

| Decision                | Rationale                                        |
| ----------------------- | ------------------------------------------------ |
| Managed Services Hybrid | Reduces ops burden, focuses on features          |
| React Native            | Single codebase for iOS + Android                |
| Prisma ORM              | Type-safety, excellent DX, auto-generated types  |
| Modular Monolith        | Simple deployment, can extract later             |
| REST over tRPC/GraphQL  | Simpler, widely supported, works everywhere      |
| Redux Toolkit           | Official recommendation, built-in best practices |
| WatermelonDB            | Best offline-first reactive database for RN      |
| Supabase                | Managed PostgreSQL + auth + realtime + storage   |
| Railway                 | Simple deployment, auto-scaling, great DX        |

### Related Documents

- [Product Requirements Document (PRD)](./PRD.md)
- [API Documentation](../api/swagger.json) - (To be generated)
- [Database Schema](../../apps/backend/prisma/schema.prisma) - (To be created)

### Document Control

| Version | Date       | Author            | Changes                     |
| ------- | ---------- | ----------------- | --------------------------- |
| 1.0     | 2026-04-03 | Architecture Team | Initial architecture design |

---

**END OF DOCUMENT**

_This Technical Architecture Document has been reviewed and approved for implementation. All architectural decisions align with the PRD requirements and are optimized for a solo/small-team development approach with managed services._
