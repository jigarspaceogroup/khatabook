# Khatabook Clone - Implementation Plan

**Document Version:** 1.0
**Date:** April 3, 2026
**Author:** Engineering Team / Tech Lead
**Status:** Ready for Execution
**Approach:** Feature Slices (Full-Stack Per Feature)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Implementation Strategy](#2-implementation-strategy)
3. [Phase Breakdown](#3-phase-breakdown)
4. [Task Catalog](#4-task-catalog)
5. [Timeline & Resources](#5-timeline--resources)
6. [Success Criteria](#6-success-criteria)
7. [Risk Mitigation](#7-risk-mitigation)

---

## 1. Executive Summary

### Purpose

This document provides a complete, actionable implementation plan for building the Khatabook Clone mobile application. It breaks down development into **13 phases** and **~90 medium-sized tasks** (4-8 hours each), enabling systematic feature-by-feature delivery with continuous validation.

### Implementation Approach

**Feature Slices (Full-Stack Vertical Slices)**

- Build each feature completely (backend API + mobile UI + tests) before moving to next
- Each phase delivers a working, testable feature
- Continuous end-to-end validation throughout development
- Discover integration issues early
- Demo-able progress after each phase

### Key Statistics

- **Total Tasks:** ~90 medium tasks
- **Estimated Duration:** 12-13 weeks for P0 + P1 features
- **Team Size:** 1-2 developers (full-stack)
- **Task Size:** 4-8 hours each (fits in Claude Code sessions)
- **Phases:** 13 phases from setup to deployment
- **Deliverables:** 72 API endpoints, 18 mobile screens, 15 database tables

---

## 2. Implementation Strategy

### Build Order Rationale

**Phase Order (Priority-Driven):**

```
Setup → Database → Auth → Core Features (P0) → Enhanced Features (P1) → Advanced Features (P2) → Polish
```

**Why Feature Slices:**

1. **Early Integration Testing** - API + UI working together from Phase 2
2. **Risk Reduction** - Discover sync issues in Phase 5, not Phase 12
3. **Continuous Validation** - Users can test features as they're built
4. **Motivating Progress** - See working features quickly
5. **Flexible Scope** - Can stop at any phase with partial working app

### Task Structure (Medium Granularity)

**Each task:**

- **Size:** 4-8 hours (one Claude Code session or one focused work day)
- **Scope:** Complete unit of work (e.g., "Customer CRUD API" = all 5 endpoints)
- **Inputs:** Which files to read, which specs to reference
- **Outputs:** Which files created/modified, what should work after
- **Testing:** How to verify completion (manual steps + automated tests)

**Task Types:**

- **API Task:** Backend endpoints + validation + business logic
- **Mobile Task:** Screens + components + navigation + API integration
- **Integration Task:** Connect backend + mobile, test end-to-end
- **Infrastructure Task:** Setup, configuration, deployment

---

## 3. Phase Breakdown

### Phase Summary

| Phase | Name                 | Duration | Tasks | Deliverable                        |
| ----- | -------------------- | -------- | ----- | ---------------------------------- |
| 0     | Project Setup        | 3 days   | 4     | Monorepo ready, CI/CD working      |
| 1     | Database             | 2 days   | 3     | Schema migrated, seeded data       |
| 2     | Auth                 | 4 days   | 4     | Login flow working end-to-end      |
| 3     | Khatabooks           | 3 days   | 3     | Multi-ledger management working    |
| 4     | Customers            | 4 days   | 4     | Customer CRUD complete             |
| 5     | Transactions         | 7 days   | 7     | Core ledger feature + offline sync |
| 6     | Reminders            | 3 days   | 3     | WhatsApp/SMS reminders working     |
| 7     | Reports & PDF        | 4 days   | 4     | Analytics and exports working      |
| 8     | Invoices (P1)        | 5 days   | 5     | GST invoices + PDF generation      |
| 9     | Inventory (P2)       | 3 days   | 2     | Stock tracking working             |
| 10    | Dashboard            | 3 days   | 2     | Analytics charts working           |
| 11    | Settings & i18n      | 3 days   | 3     | Multi-language + settings          |
| 12    | Payments (P1)        | 3 days   | 2     | Payment collection working         |
| 13    | Testing & Deployment | 5 days   | 6     | Production-ready                   |

**Total:** ~53 working days (~12-13 weeks with weekends)

---

## 4. Task Catalog

### Phase 0: Project Setup & Infrastructure (Week 1 - 3 days)

**Milestone:** Monorepo scaffolded, tools configured, CI/CD ready

---

#### Task 0.1: Initialize Monorepo (4 hours)

**Inputs:**

- Empty project directory
- TECH_STACK.md (section on monorepo)
- CLAUDE.md (file structure reference)

**Actions:**

1. Initialize pnpm workspace
2. Create folder structure:
   ```
   khatabook-clone/
   ├── apps/
   │   ├── backend/
   │   └── mobile/
   ├── packages/
   │   ├── types/
   │   └── utils/
   ├── docs/
   └── package.json
   ```
3. Setup root package.json with workspaces
4. Configure TypeScript (tsconfig.json, strict mode)
5. Setup ESLint + Prettier (extends recommended configs)
6. Setup Husky pre-commit hooks (lint, type-check)
7. Add .gitignore (node_modules, .env, build artifacts)

**Outputs:**

- `package.json` (root with pnpm workspaces)
- `pnpm-workspace.yaml`
- `tsconfig.json` (root + extends in packages)
- `.eslintrc.js`, `.prettierrc`
- `.husky/pre-commit`
- `.gitignore`

**Testing Checklist:**

- [ ] `pnpm install` succeeds without errors
- [ ] `pnpm lint` runs and passes
- [ ] `pnpm type-check` passes
- [ ] Git commit triggers pre-commit hook
- [ ] Husky prevents commit if lint fails

---

#### Task 0.2: Backend Scaffold (4 hours)

**Inputs:**

- Monorepo from Task 0.1
- TECH_STACK.md (backend stack)
- CLAUDE.md (backend structure, conventions)

**Actions:**

1. Initialize Express app with TypeScript in apps/backend
2. Create folder structure:
   ```
   src/
   ├── modules/
   ├── middleware/
   ├── services/
   ├── database/
   ├── config/
   ├── utils/
   ├── types/
   └── constants/
   ```
3. Setup environment variables (dotenv, validation with Zod)
4. Configure Winston logger (JSON format, separate files per level)
5. Create app.ts (Express setup, middleware)
6. Create server.ts (start server, graceful shutdown)
7. Add GET /health endpoint (returns status, uptime, services)
8. Add error handling middleware
9. Add request logging middleware (Morgan)

**Outputs:**

- `apps/backend/package.json`
- `apps/backend/src/app.ts`
- `apps/backend/src/server.ts`
- `apps/backend/src/config/index.ts` (env validation)
- `apps/backend/src/utils/logger.ts`
- `apps/backend/src/middleware/error.middleware.ts`
- `apps/backend/src/middleware/logger.middleware.ts`
- `apps/backend/.env.example`
- `apps/backend/tsconfig.json`

**Testing Checklist:**

- [ ] `cd apps/backend && pnpm dev` starts server on port 3000
- [ ] GET http://localhost:3000/api/v1/health returns 200 OK
- [ ] Response: `{"success": true, "data": {"status": "healthy", "uptime": 5}}`
- [ ] Invalid route returns 404 with standard error format
- [ ] Logs appear in console (development) or file (production)
- [ ] CTRL+C gracefully shuts down server

---

#### Task 0.3: Mobile Scaffold (6 hours)

**Inputs:**

- Monorepo from Task 0.1
- TECH_STACK.md (mobile stack)
- SCREEN_SPEC.md (design system)
- CLAUDE.md (mobile structure)

**Actions:**

1. Initialize React Native project (0.73+) in apps/mobile
2. Setup folder structure (screens, components, navigation, store, services)
3. Install core dependencies:
   - React Navigation 6.x
   - Redux Toolkit + RTK Query
   - React Native Paper (UI components)
4. Configure React Navigation:
   - AuthNavigator (stack)
   - MainNavigator (bottom tabs)
   - AppNavigator (conditional on auth state)
5. Setup Redux store (empty slices, middleware config)
6. Create theme constants from UI_SCREENS.md:
   - colors.ts (#E53935 red, #1FAF38 green, #2C60E4 blue, etc.)
   - typography.ts (font sizes, weights, Roboto for Android)
   - spacing.ts (8px grid)
7. Create placeholder screens (show "Coming soon")
8. Configure environment variables

**Outputs:**

- `apps/mobile/package.json`
- `apps/mobile/src/App.tsx`
- `apps/mobile/src/navigation/AppNavigator.tsx`
- `apps/mobile/src/navigation/AuthNavigator.tsx`
- `apps/mobile/src/navigation/MainNavigator.tsx`
- `apps/mobile/src/store/index.ts`
- `apps/mobile/src/theme/colors.ts`
- `apps/mobile/src/theme/typography.ts`
- `apps/mobile/src/theme/spacing.ts`
- `apps/mobile/.env.example`

**Testing Checklist:**

- [ ] `cd apps/mobile && pnpm ios` launches iOS simulator
- [ ] `pnpm android` launches Android emulator
- [ ] App shows placeholder home screen
- [ ] Bottom tab navigation shows 4 tabs (inactive)
- [ ] No console errors or warnings
- [ ] Hot reload works (change text, see update)

---

#### Task 0.4: File Storage Setup (4 hours)

**Inputs:**

- TECH_STACK.md (Cloudflare R2, Cloudinary)
- API_SPEC.md (file upload pattern)

**Actions:**

1. Setup Cloudflare R2:
   - Configure R2 credentials
   - Create bucket for PDFs and documents
   - Test upload/download
2. Setup Cloudinary:
   - Configure Cloudinary credentials
   - Create upload presets (transaction_attachments, logos, product_images)
   - Configure transformations (thumbnails, compression)
3. Create storage service abstraction layer
4. Implement presigned URL generation for secure uploads

**Outputs:**

- `services/storage/R2Service.ts`
- `services/storage/CloudinaryService.ts`
- `services/storage/StorageFactory.ts`
- Updated `.env.example`

**Testing Checklist:**

- [ ] Upload file to R2 → File accessible via URL
- [ ] Upload image to Cloudinary → Returns URL with transformations
- [ ] Presigned URL generated → Can upload directly from client
- [ ] Presigned URL expires after 15 minutes

---

#### Task 0.5: Background Jobs Queue Setup (4 hours)

**Inputs:**

- TECH_STACK.md (BullMQ + Redis)

**Actions:**

1. Install BullMQ: `pnpm add bullmq`
2. Configure Redis connection (Upstash)
3. Create queue service:
   - Job queue factory
   - Queue monitoring
   - Failed job retry logic
4. Setup job processors folder structure
5. Create basic job template
6. Add queue dashboard (Bull Board - optional)

**Outputs:**

- `services/queue/QueueService.ts`
- `services/queue/QueueConfig.ts`
- `services/queue/jobs/` (folder)
- Bull Board UI (optional)

**Testing Checklist:**

- [ ] Queue service initializes successfully
- [ ] Can add job to queue
- [ ] Worker picks up job and processes
- [ ] Failed job retries with exponential backoff
- [ ] Bull Board accessible (if installed)

---

#### Task 0.6: Logging & Monitoring Setup (4 hours)

**Inputs:**

- TECH_STACK.md (Winston, Morgan)
- CLAUDE.md (logging guidelines)

**Actions:**

1. Configure Winston logger:
   - Log levels (error, warn, info, debug)
   - Separate log files per level
   - JSON format for production
   - Console format for development
2. Configure Morgan (HTTP request logging)
3. Setup Sentry SDK:
   - Backend integration
   - Mobile integration (React Native)
   - Environment-specific DSN
   - Source maps upload
4. Create logging utilities
5. Add request ID generation (UUID per request)

**Outputs:**

- `utils/logger.ts` (Winston config)
- `middleware/logger.middleware.ts` (Morgan)
- `utils/sentry.ts` (Sentry initialization)
- Updated `app.ts` (Sentry middleware)

**Testing Checklist:**

- [ ] Logs appear in console (development)
- [ ] Logs written to files (production simulation)
- [ ] Request ID appears in all logs
- [ ] Errors sent to Sentry (test by throwing error)
- [ ] Sentry dashboard shows error with stack trace

---

#### Task 0.7: CI/CD Pipeline (4 hours)

**Inputs:**

- GitHub repository
- TECH_STACK.md (deployment section)

**Actions:**

1. Create GitHub Actions workflow for backend:
   - On push to develop/main
   - Lint → Type-check → Test → Build
   - Deploy to Railway (on main branch only)
2. Create GitHub Actions workflow for mobile:
   - On push to develop/main
   - Lint → Type-check → Test → Build iOS/Android
3. Setup branch protection:
   - Require CI checks pass before merge
   - Require 1 approval for main branch
4. Configure Railway:
   - Connect GitHub repo
   - Set environment variables
   - Auto-deploy on main branch push

**Outputs:**

- `.github/workflows/backend-ci.yml`
- `.github/workflows/mobile-ci.yml`
- `.github/workflows/deploy-backend.yml`
- Railway project configured

**Testing Checklist:**

- [ ] Push to develop → CI runs automatically
- [ ] All checks pass (lint, type-check, test)
- [ ] Push to main → Railway auto-deploys
- [ ] Failed lint → prevents commit via Husky
- [ ] Failed tests → CI fails, prevents merge

---

### Phase 1: Database Setup (Week 1 - 2 days)

**Milestone:** Complete database schema created, seeded with realistic test data

---

#### Task 1.1: Prisma Setup & Schema (6 hours)

**Inputs:**

- DATABASE_SCHEMA.md (all 15 tables, indexes, relationships)
- Task 0.2 (backend scaffold)

**Actions:**

1. Install Prisma: `pnpm add -D prisma` and `pnpm add @prisma/client`
2. Initialize Prisma: `npx prisma init`
3. Configure Supabase connection string in .env
4. Create complete schema.prisma:
   - All 15 tables (users, khatabooks, customers, transactions, invoices, invoice_items, invoice_settings, inventory_items, stock_logs, payments, reminder_logs, sessions, sync_metadata, audit_logs)
   - All 9 enums (TransactionType, InvoiceStatus, PaymentStatus, etc.)
   - All foreign keys with cascade rules
   - All indexes (45+ indexes)
   - Soft delete (deleted_at) on all tables
5. Generate Prisma Client: `npx prisma generate`
6. Create Prisma client singleton in database/client.ts

**Outputs:**

- `apps/backend/prisma/schema.prisma` (complete schema, ~600 lines)
- `apps/backend/src/database/client.ts` (Prisma client export)
- `.env` (DATABASE_URL configured)

**Testing Checklist:**

- [ ] `npx prisma validate` passes (no schema errors)
- [ ] `npx prisma generate` succeeds
- [ ] `npx prisma format` formats schema correctly
- [ ] Import Prisma client in app.ts (no errors)
- [ ] TypeScript autocomplete shows all models (prisma.customer.findMany)

---

#### Task 1.2: Database Migrations (4 hours)

**Inputs:**

- Task 1.1 (schema.prisma)
- Supabase database (empty)

**Actions:**

1. Create initial migration: `npx prisma migrate dev --name init`
2. Apply migration to development database
3. Verify migration SQL:
   - All tables created
   - All columns with correct types
   - All foreign keys created
   - All indexes created
   - All enums created
4. Test migration rollback (create snapshot first)
5. Document migration workflow in README

**Outputs:**

- `prisma/migrations/20260403_init/migration.sql`
- `apps/backend/README.md` (migration instructions)

**Testing Checklist:**

- [ ] `npx prisma migrate dev` succeeds
- [ ] `npx prisma studio` opens database GUI
- [ ] All 15 tables visible in Prisma Studio
- [ ] Foreign keys enforced (try deleting user with khatabooks → fails)
- [ ] Unique constraints work (try duplicate phone → fails)
- [ ] Soft delete works (deleted_at IS NULL filter)
- [ ] Indexes exist (check in Prisma Studio or pg_indexes view)

---

#### Task 1.3: Seed Script (4 hours)

**Inputs:**

- DATABASE_SCHEMA.md (seed data requirements)
- Task 1.2 (migrated database)

**Actions:**

1. Install faker: `pnpm add -D @faker-js/faker`
2. Create prisma/seed.ts:
   - Generate 2 test users with realistic data
   - Generate 2 khatabooks per user (Business, Personal)
   - Generate 10-15 customers per khatabook
   - Generate 50-100 transactions (mix of GAVE/GOT)
   - Calculate realistic balances (opening_balance + transaction sum)
   - Generate 5 inventory items per khatabook
   - Generate 2 sample invoices
   - Generate invoice_settings per khatabook
3. Configure package.json prisma.seed script
4. Run seed: `npx prisma db seed`

**Outputs:**

- `prisma/seed.ts` (~300 lines)
- package.json (prisma.seed config)

**Testing Checklist:**

- [ ] `npx prisma db seed` succeeds
- [ ] Prisma Studio shows realistic data
- [ ] User 1: 2 khatabooks, each with 10+ customers
- [ ] Customers have realistic balances (positive and negative)
- [ ] Transactions sum to customer balances correctly
- [ ] Invoices have items with tax calculations
- [ ] Can login as test user (phone from seed data)

---

### Phase 2: Authentication (Week 2 - 4 days)

**Milestone:** Complete auth flow (Phone OTP → JWT → Multi-device sessions) working end-to-end

---

#### Task 2.1: Auth API Endpoints (6 hours)

**Inputs:**

- API_SPEC.md Section 3 (Authentication & User Management)
- DATABASE_SCHEMA.md (users, sessions tables)
- Task 1.2 (database ready)

**Actions:**

1. Create auth module folder structure
2. Setup Supabase Auth SDK (phone OTP)
3. Setup MSG91 as backup SMS provider
4. Implement POST /auth/send-otp:
   - Validate phone number (E.164 format)
   - Call Supabase Auth to send OTP
   - Rate limit: 5 per hour per phone
   - Return expires_at, retry_after
5. Implement POST /auth/verify-otp:
   - Verify OTP with Supabase
   - Generate JWT access token (24h expiry)
   - Generate JWT refresh token (30d expiry)
   - Create session in database
   - Return user + tokens
6. Implement POST /auth/refresh-token (validate refresh, return new access)
7. Implement POST /auth/logout (revoke session)
8. Implement GET /auth/me, PUT /auth/me (user profile)
9. Create Zod validators for all endpoints
10. Add to main app routes

**Outputs:**

- `modules/auth/auth.controller.ts` (HTTP handlers)
- `modules/auth/auth.service.ts` (business logic)
- `modules/auth/auth.routes.ts` (Express routes)
- `modules/auth/auth.validators.ts` (Zod schemas)
- `modules/auth/auth.types.ts` (TypeScript interfaces)
- `services/auth/SupabaseAuthService.ts`
- `services/auth/MSG91Service.ts`
- `utils/jwt.ts` (JWT sign/verify helpers)

**Testing Checklist:**

- [ ] POST /auth/send-otp with valid phone → 200 OK, OTP sent to phone
- [ ] POST /auth/send-otp with invalid phone → 400 validation error
- [ ] POST /auth/send-otp 6 times → 429 rate limit error
- [ ] POST /auth/verify-otp with correct OTP → 200, returns access + refresh tokens
- [ ] POST /auth/verify-otp with wrong OTP → 401 unauthorized
- [ ] POST /auth/refresh-token with valid refresh → 200, new access token
- [ ] POST /auth/refresh-token with invalid refresh → 401
- [ ] GET /auth/me with valid token → 200, user data
- [ ] GET /auth/me without token → 401
- [ ] PUT /auth/me updates user profile
- [ ] Session created in database with device_id

---

#### Task 2.2: Auth Middleware & Session Management (4 hours)

**Inputs:**

- Task 2.1 (auth endpoints)
- API_SPEC.md (auth requirements, rate limiting)

**Actions:**

1. Create auth middleware:
   - Extract JWT from Authorization header
   - Verify token (check expiry, signature)
   - Attach user to req.user
   - Return 401 if invalid/expired
2. Create rate limiting middleware:
   - Use Upstash Redis for counters
   - OTP send: 5 per hour per phone
   - OTP verify: 10 per hour per phone
   - Global: 100 requests per 15 min per user
3. Implement session management endpoints:
   - GET /auth/sessions (list all sessions for user)
   - DELETE /auth/sessions/:id (revoke specific session)
   - DELETE /auth/me (soft delete user account)
4. Add X-Device-ID header requirement
5. Token refresh on 401 logic (auto-retry)

**Outputs:**

- `middleware/auth.middleware.ts`
- `middleware/rateLimit.middleware.ts`
- `services/cache/RedisService.ts`
- Updated auth.controller.ts (session endpoints)

**Testing Checklist:**

- [ ] Protected endpoint without token → 401
- [ ] Protected endpoint with valid token → 200
- [ ] Expired token → 401 with TOKEN_EXPIRED code
- [ ] Rate limit: 6th OTP request within hour → 429
- [ ] Response headers include X-RateLimit-\* headers
- [ ] Multiple devices create separate sessions (different device_id)
- [ ] GET /auth/sessions shows all devices
- [ ] DELETE /auth/sessions/:id logs out that device only
- [ ] DELETE /auth/me soft deletes user (deleted_at set)

---

#### Task 2.3: Mobile Auth Screens (8 hours)

**Inputs:**

- SCREEN_SPEC.md Screens 0-3 (Language, Login, OTP, Profile)
- Task 0.3 (mobile scaffold)
- API_SPEC.md auth endpoints

**Actions:**

1. Build Screen 0: Language Selection
   - Grid of 11 language cards (2 columns)
   - Native scripts (हिंदी, தமிழ், etc.)
   - Selection state (blue border)
   - Save to AsyncStorage
2. Build Screen 1: Phone Login
   - Phone input with +91 prefix
   - Validation (10 digits)
   - Get OTP button (disabled until valid)
   - Terms & Privacy links
3. Build Screen 2: OTP Verification
   - 6-digit OTP input (auto-advance boxes)
   - Auto-submit when 6 digits entered
   - Resend OTP with countdown (30s)
   - Back button confirmation
4. Build Screen 3: Profile Setup
   - Name input (required)
   - Business name (optional)
   - Business type dropdown
   - Skip button
5. Create auth Redux slice (user, tokens, isAuthenticated)
6. Create RTK Query auth API (sendOTP, verifyOTP, refreshToken)
7. Setup react-native-keychain (secure token storage)
8. Implement auto-login (check stored tokens on app launch)

**Outputs:**

- `screens/auth/LanguageSelectionScreen.tsx`
- `screens/auth/PhoneLoginScreen.tsx`
- `screens/auth/OTPVerificationScreen.tsx`
- `screens/auth/ProfileSetupScreen.tsx`
- `store/slices/authSlice.ts`
- `store/api/authApi.ts`
- `services/auth/SecureStorage.ts`
- `components/auth/PhoneInput.tsx`
- `components/auth/OTPInput.tsx`

**Testing Checklist:**

- [ ] App launches → Language selection screen (first time)
- [ ] Select Hindi → UI text changes to Hindi (if translations ready)
- [ ] Enter phone → Get OTP button enables
- [ ] Tap Get OTP → Loading spinner → Navigate to OTP screen
- [ ] Receive OTP on phone (check SMS)
- [ ] Enter OTP → Auto-verifies → Navigate to Profile Setup
- [ ] Enter name → Continue → Navigate to Create Khatabook
- [ ] Tokens stored securely (check with SecureStorage.get('access_token'))
- [ ] Close app, reopen → Auto-logs in (skips auth screens)
- [ ] Invalid OTP → Shows error, boxes shake, clears input

---

#### Task 2.4: Auth Integration Tests (4 hours)

**Inputs:**

- Task 2.1-2.3 (complete auth system)

**Actions:**

1. Backend integration tests:
   - Test complete OTP flow (send → verify → get tokens)
   - Test token refresh flow
   - Test multi-device sessions
   - Test rate limiting
   - Test session management
2. Mobile E2E tests (Detox):
   - Test onboarding flow (language → phone → OTP → profile → khatabook)
   - Test login for returning user
   - Test auto-login on app restart
   - Test logout

**Outputs:**

- `apps/backend/tests/integration/auth.test.ts`
- `apps/mobile/__tests__/e2e/auth.e2e.ts`

**Testing Checklist:**

- [ ] Backend: All auth integration tests pass
- [ ] Mobile: Detox E2E test completes onboarding flow
- [ ] Code coverage >80% for auth module
- [ ] All edge cases tested (wrong OTP, expired token, etc.)

---

### Phase 3: Khatabooks CRUD (Week 2 - 3 days)

**Milestone:** Users can create and manage multiple ledger books (P1 feature)

---

#### Task 3.1: Khatabooks API (5 hours)

**Inputs:**

- API_SPEC.md Section 4 (Khatabooks Management)
- DATABASE_SCHEMA.md (khatabooks, invoice_settings tables)

**Actions:**

1. Create khatabooks module
2. Implement GET /khatabooks:
   - List all for authenticated user
   - Include stats (total_customers, total_receivable, total_payable, net_balance)
   - Cursor pagination
3. Implement POST /khatabooks (create new)
4. Implement GET /khatabooks/:id (with stats)
5. Implement PUT /khatabooks/:id (update)
6. Implement DELETE /khatabooks/:id:
   - Soft delete
   - Cascade to customers, transactions, invoices
   - Cannot delete if is_default=true and only khatabook
7. Implement GET/PUT /khatabooks/:id/invoice-settings
8. Add ownership validation middleware (user owns khatabook)
9. Default khatabook logic (ensure only one is_default per user)
10. Stats calculation (aggregate from customers table)

**Outputs:**

- `modules/khatabooks/khatabook.controller.ts`
- `modules/khatabooks/khatabook.service.ts`
- `modules/khatabooks/khatabook.routes.ts`
- `modules/khatabooks/khatabook.validators.ts`
- `modules/khatabooks/invoice-settings.controller.ts`
- `middleware/ownership.middleware.ts`

**Testing Checklist:**

- [ ] POST /khatabooks → 201, khatabook created, is_default=true
- [ ] GET /khatabooks → Returns user's khatabooks with stats
- [ ] GET /khatabooks/:id → Returns khatabook with detailed stats
- [ ] PUT /khatabooks/:id → Updates name/business details
- [ ] DELETE /khatabooks/:id → Soft deletes (deleted_at set)
- [ ] Cascading soft delete verified (customers also marked deleted)
- [ ] Cannot access another user's khatabook (403 forbidden)
- [ ] GET /khatabooks/:id/invoice-settings → Returns settings
- [ ] PUT /khatabooks/:id/invoice-settings → Updates GSTIN, logo, etc.
- [ ] Stats calculate correctly (query customers for balances)

---

#### Task 3.2: Mobile Khatabook Creation & Dashboard (4 hours)

**Inputs:**

- SCREEN_SPEC.md Screens 4, 5
- Task 2.3 (auth screens)

**Actions:**

1. Build Screen 4: Create First Khatabook
   - Pre-filled name suggestion
   - Create button
   - Connect to POST /khatabooks
   - Navigate to Dashboard on success
2. Build Screen 5: Dashboard/Home (structure):
   - Top App Bar (hamburger, khatabook name, search)
   - Summary Cards × 3 (Component 1)
   - Customer list section header
   - Empty state (no customers yet)
   - FAB (Component 7)
   - Bottom Tab Navigation (Component 6)
3. Create khatabook Redux slice
4. Create RTK Query khatabooks API
5. Integrate with backend API

**Outputs:**

- `screens/onboarding/CreateKhatabookScreen.tsx`
- `screens/home/DashboardScreen.tsx`
- `components/ui/SummaryCard.tsx` (Component 1)
- `components/ui/FAB.tsx` (Component 7)
- `components/navigation/BottomTabNav.tsx` (Component 6)
- `store/slices/khatabookSlice.ts`
- `store/api/khatabookApi.ts`

**Testing Checklist:**

- [ ] After profile setup → Create Khatabook screen appears
- [ ] Default name pre-filled (uses business name from profile)
- [ ] Tap Create → Loading → Success → Navigate to Dashboard
- [ ] Dashboard shows 3 summary cards (all ₹0 initially)
- [ ] Dashboard shows empty state: "No Customers Yet"
- [ ] FAB visible and tappable
- [ ] Bottom tabs visible (Home active)
- [ ] Khatabook name in top bar

---

#### Task 3.3: Khatabook Switcher (P1 - 4 hours)

**Inputs:**

- SCREEN_SPEC.md Khatabook Switcher Modal
- Task 3.2 (dashboard)

**Actions:**

1. Build Khatabook Switcher modal:
   - List all user's khatabooks
   - Show net balance per khatabook
   - Highlight active khatabook (blue background)
   - "+ Create New Khatabook" button at bottom
2. Add hamburger menu to Dashboard:
   - Opens drawer with switcher
   - Settings link
   - Help & Support link
3. Switch khatabook logic:
   - Update activeKhatabookId in Redux
   - Refetch dashboard data for new khatabook
   - Close modal
4. Create new khatabook from modal

**Outputs:**

- `components/khatabooks/KhatabookSwitcherModal.tsx`
- `components/navigation/DrawerMenu.tsx`
- Updated `DashboardScreen.tsx` (hamburger handler)

**Testing Checklist:**

- [ ] Tap hamburger → Drawer opens
- [ ] Drawer shows "Switch Khatabook" option
- [ ] Tap Switch Khatabook → Modal opens
- [ ] Modal shows all khatabooks with balances
- [ ] Active khatabook highlighted
- [ ] Tap different khatabook → Dashboard refreshes with new data
- [ ] Tap "+ Create New" → Create Khatabook screen → After creation, switches to it
- [ ] Close modal (tap outside or X) → Stays on current khatabook

---

### Phase 4: Customers CRUD (Week 3 - 4 days)

**Milestone:** Complete customer management with search, sorting, and balance tracking

---

#### Task 4.1: Customers API (6 hours)

**Inputs:**

- API_SPEC.md Section 5 (Customers Management)
- DATABASE_SCHEMA.md (customers table)

**Actions:**

1. Create customers module
2. Implement GET /customers:
   - Filter by khatabook_id (required)
   - Search by name/phone (fuzzy with pg_trgm)
   - Sort by balance, name, created_at
   - Filter: balance_gt, balance_lt
   - Cursor-based pagination
3. Implement POST /customers (create)
4. Implement GET /customers/:id (with summary: total_gave, total_got, transaction_count)
5. Implement PUT /customers/:id (update)
6. Implement DELETE /customers/:id:
   - Check if has transactions (restrict if yes)
   - Soft delete if no transactions
   - Return 422 if has transactions
7. Implement POST /customers/:id/settle:
   - Create offsetting transaction
   - Set balance to 0
   - Return settlement transaction
8. Add ownership validation (customer belongs to user's khatabook)

**Outputs:**

- `modules/customers/customer.controller.ts`
- `modules/customers/customer.service.ts`
- `modules/customers/customer.routes.ts`
- `modules/customers/customer.validators.ts`

**Testing Checklist:**

- [ ] POST /customers with valid data → 201, customer created
- [ ] GET /customers?khatabook_id=X → Returns customer list
- [ ] GET /customers?q=kumar → Fuzzy search works
- [ ] GET /customers?sort=-balance → Sorted by highest balance first
- [ ] GET /customers/:id → Returns customer with summary stats
- [ ] PUT /customers/:id → Updates customer details
- [ ] DELETE /customers/:id (no transactions) → 200, soft deleted
- [ ] DELETE /customers/:id (has transactions) → 422 error
- [ ] POST /customers/:id/settle → Balance becomes 0, transaction created
- [ ] Cannot access another user's customer (403)

---

#### Task 4.2: Mobile Customer List & Components (6 hours)

**Inputs:**

- SCREEN_SPEC.md Component 2, Screen 5
- Task 3.2 (dashboard structure)

**Actions:**

1. Build Component 2: Customer List Item
   - Avatar (first letter, random pastel color)
   - Name, phone, balance
   - Last activity timestamp
   - Color-coded balance (red/green)
   - Swipe actions (remind, delete)
2. Integrate customer list into Dashboard:
   - Fetch customers from API
   - Infinite scroll (pagination)
   - Pull-to-refresh
3. Add search functionality (search icon in top bar)
4. Add sort dropdown (by balance, name, activity)
5. Add empty state
6. Connect to GET /customers API

**Outputs:**

- `components/customers/CustomerListItem.tsx`
- Updated `screens/home/DashboardScreen.tsx` (customer list integrated)
- `components/ui/SearchBar.tsx`
- `components/ui/SortDropdown.tsx`
- `store/api/customerApi.ts`

**Testing Checklist:**

- [ ] Dashboard shows customer list from API (seeded data)
- [ ] Customers sorted by balance (highest first) by default
- [ ] Tap search → Search bar appears
- [ ] Type in search → Filters customers (debounced)
- [ ] Tap sort → Dropdown opens → Select "By Name" → List re-sorts
- [ ] Scroll to bottom → Loads next page (pagination)
- [ ] Pull down → Refreshes list
- [ ] Swipe customer left → Shows "Remind" and "Delete" buttons
- [ ] Empty state shows if no customers

---

#### Task 4.3: Mobile Customer Detail Screen (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 6
- Task 4.2 (customer list)

**Actions:**

1. Build Screen 6: Customer Detail
2. Customer info card:
   - Phone with call/WhatsApp icons
   - Current balance (large, color-coded)
   - Summary (total_gave, total_got, transaction_count)
3. Action Button Pair (Component 4):
   - YOU GAVE button (red)
   - YOU GOT button (green)
   - Navigate to transaction entry (pre-select type)
4. Transaction list section (empty for now - Phase 5 will populate)
5. Connect to GET /customers/:id API

**Outputs:**

- `screens/customers/CustomerDetailScreen.tsx`
- `components/customers/CustomerInfoCard.tsx`
- `components/transactions/ActionButtonPair.tsx` (Component 4)

**Testing Checklist:**

- [ ] Tap customer in dashboard → Navigate to Customer Detail
- [ ] Shows customer name in top bar
- [ ] Shows balance correctly (₹5,000 You'll Get in red)
- [ ] Shows summary stats (Total Gave, Total Got, Transaction count)
- [ ] Phone icon tappable → Opens dialer with number
- [ ] WhatsApp icon tappable → Navigate to Send Reminder (not built yet, shows placeholder)
- [ ] YOU GAVE button → Navigate to Add Transaction (type=GAVE, not built yet)
- [ ] YOU GOT button → Navigate to Add Transaction (type=GOT, not built yet)
- [ ] Transaction list shows empty state (Phase 5 will populate)

---

#### Task 4.4: Add/Edit Customer Screens (4 hours)

```

[Previous Task 4.4 content stays here]

```

---

#### Task 4.5: Customer Settlement UI (P1 - 4 hours)

**Inputs:**

- SCREEN_SPEC.md Settlement Confirmation Dialog
- API_SPEC.md POST /customers/:id/settle

**Actions:**

1. Build Settlement Confirmation dialog
2. Show current balance, customer name
3. Optional settlement note field
4. Confirmation button "Settle ₹5,000"
5. Connect to POST /customers/:id/settle API
6. On success: Balance becomes 0, transaction created
7. Add to Customer Detail overflow menu

**Outputs:**

- `components/customers/SettlementDialog.tsx`
- Updated `CustomerDetailScreen.tsx` (menu option)

**Testing Checklist:**

- [ ] Customer Detail → Menu → "Settle Balance"
- [ ] Dialog shows customer and balance
- [ ] Add note → Save → API called
- [ ] Customer balance becomes ₹0
- [ ] Settlement transaction created (type=GOT)
- [ ] Transaction history shows settlement entry

---

#### Task 4.6: Customer Unit Tests (3 hours)

**Inputs:**

- Completed customer module

**Actions:**

1. Unit tests for customer service:
   - Create customer (valid data)
   - Create customer (validation errors)
   - Update customer
   - Balance calculations
   - Search functionality
   - Settle balance logic
2. Integration tests for customer API:
   - Full CRUD flow
   - Search and filter
   - Pagination
3. Target 80%+ coverage

**Outputs:**

- `modules/customers/tests/customer.service.test.ts`
- `tests/integration/customers.test.ts`

**Testing Checklist:**

- [ ] All unit tests pass
- [ ] Coverage >80%
- [ ] Edge cases tested (duplicate phone, missing fields)

---

#### Task 4.7: Add/Edit Customer Screens (4 hours)

**Inputs:**

- SCREEN_SPEC.md (inferred from similar screens)
- Task 4.2 (customer list)

**Actions:**

1. Build Add Customer screen:
   - Form: Name (required), Phone (optional), Opening Balance (optional)
   - Balance toggle: "You'll Give" / "You'll Get"
   - Address field (optional, collapsed)
   - Import from contacts button
   - Form validation (Zod)
   - Connect to POST /customers
2. Build Edit Customer screen (same form, pre-filled)
3. Add FAB action (Dashboard → FAB → Add Customer option)
4. Add context menu (Long press customer → Edit)

**Outputs:**

- `screens/customers/AddCustomerScreen.tsx`
- `screens/customers/EditCustomerScreen.tsx`
- Updated `DashboardScreen.tsx` (FAB action sheet)

**Testing Checklist:**

- [ ] Tap FAB on Dashboard → Action sheet opens → "Add Customer" option
- [ ] Tap Add Customer → Navigate to Add Customer screen
- [ ] Fill name, phone → Tap Save → Creates customer → Navigate back to Dashboard
- [ ] New customer appears in list with correct balance
- [ ] Long press customer → Context menu → "Edit"
- [ ] Edit screen pre-filled → Change phone → Save → Updates in list
- [ ] Opening balance (You'll Get ₹1000) → Customer balance = ₹1000

---

### Phase 5: Transactions (Week 4-5 - 7 days) **CRITICAL PHASE**

**Milestone:** Full transaction recording with photos, offline sync, balance calculations - THE CORE FEATURE

---

#### Task 5.1: Transactions API - CRUD (6 hours)

**Inputs:**

- API_SPEC.md Section 6 (Transactions Management)
- DATABASE_SCHEMA.md (transactions, transaction_attachments tables)

**Actions:**

1. Create transactions module
2. Implement GET /transactions:
   - Filter by khatabook_id, customer_id, type, date_from, date_to, payment_mode
   - Sort by transaction_date (default: newest first)
   - Cursor pagination
   - Return summary when filtered (total_gave, total_got)
   - Join customer_name for display
3. Implement POST /transactions:
   - Validate all fields (Zod)
   - Create transaction record
   - Create transaction_attachments if files provided
   - **Recalculate customer balance** (CRITICAL)
   - Return customer_balance_after
   - Queue confirmation SMS (async)
4. Implement GET /transactions/:id
5. Implement PUT /transactions/:id:
   - Update fields
   - Recalculate balance if amount changed
6. Implement DELETE /transactions/:id:
   - Soft delete
   - Recalculate customer balance
7. Implement GET /customers/:customer_id/transactions (nested route)
8. Implement POST /transactions/:id/undo (5-minute window)

**Outputs:**

- `modules/transactions/transaction.controller.ts`
- `modules/transactions/transaction.service.ts`
- `modules/transactions/transaction.routes.ts`
- `modules/transactions/transaction.validators.ts`

**Testing Checklist:**

- [ ] POST /transactions (type=GAVE, amount=500) → Customer balance increases by 500
- [ ] POST /transactions (type=GOT, amount=300) → Customer balance decreases by 300
- [ ] GET /transactions?customer_id=X → Returns transactions for customer
- [ ] GET /transactions?date_from=2026-03-01&date_to=2026-03-31 → Date filter works
- [ ] PUT /transactions/:id (change amount 500→600) → Balance recalculates (+100)
- [ ] DELETE /transactions/:id → Transaction soft deleted, balance reverts
- [ ] POST /transactions/:id/undo (within 5 min) → Deletes transaction, recalculates balance
- [ ] POST /transactions/:id/undo (after 5 min) → 422 error "Undo window expired"
- [ ] Concurrent transactions → Balances calculate correctly (no race conditions)

---

#### Task 5.2: Balance Calculation Logic (4 hours)

**Inputs:**

- DATABASE_SCHEMA.md (balance calculation logic)
- Task 5.1 (transactions API)

**Actions:**

1. Create balance calculation service:
   - Incremental update (on single transaction create/update/delete)
   - Batch recalculation (background job for validation)
   - Atomic operations (use Prisma transactions)
2. Implement incremental logic:
   ```typescript
   if (type === 'GAVE') customer.balance += amount;
   if (type === 'GOT') customer.balance -= amount;
   ```
3. Implement batch recalculation:
   - Query all transactions for customer
   - Sum: GAVE transactions (+) and GOT transactions (-)
   - Add opening_balance
   - Update customer.current_balance
4. Create background job for validation (runs nightly)
5. Add audit logging for balance changes

**Outputs:**

- `modules/customers/balance.service.ts`
- `services/queue/jobs/RecalculateBalancesJob.ts`
- `utils/balanceCalculator.ts`

**Testing Checklist:**

- [ ] Create 5 transactions (3 GAVE, 2 GOT) → Balance = (GAVE sum) - (GOT sum)
- [ ] Manually verify: Opening balance + transactions = current_balance
- [ ] Update transaction amount → Balance recalculates correctly
- [ ] Delete transaction → Balance reverts
- [ ] Batch recalculation job runs → All balances match incremental
- [ ] Edge case: Customer with 0 transactions → Balance = opening_balance
- [ ] Edge case: All transactions deleted → Balance = opening_balance

---

#### Task 5.3: Mobile WatermelonDB Setup (6 hours)

**Inputs:**

- TECH_STACK.md (offline-first architecture)
- Task 0.3 (mobile scaffold)

**Actions:**

1. Install WatermelonDB: `pnpm add @nozbe/watermelondb`
2. Configure WatermelonDB with SQLite adapter
3. Create local database schema:
   - customers table (mirror of server schema)
   - transactions table
   - invoices table (P1)
   - sync_queue table (pending operations)
4. Create model classes:
   - Customer model (with @field decorators)
   - Transaction model
   - SyncQueueItem model
5. Setup database initialization
6. Create database hooks (onMount, migrations)
7. Add database provider to App.tsx

**Outputs:**

- `services/database/schema.ts` (WatermelonDB schema)
- `services/database/models/Customer.ts`
- `services/database/models/Transaction.ts`
- `services/database/models/SyncQueue.ts`
- `services/database/index.ts` (database initialization)
- `services/database/migrations.ts`

**Testing Checklist:**

- [ ] App launches → WatermelonDB initializes
- [ ] Can create customer locally: `await database.write(() => customers.create(...))`
- [ ] Can query: `await customers.query().fetch()`
- [ ] Data persists across app restarts (close app, reopen, data still there)
- [ ] Reactive queries work (create customer → list updates automatically)
- [ ] Database inspector (Flipper plugin) shows tables

---

#### Task 5.4: Mobile Transaction Entry Screen (8 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 7, Components 4, 5
- Task 4.3 (customer detail with action buttons)

**Actions:**

1. Build Component 5: Amount Input with Numpad
   - Display area (₹ X,XXX.XX formatted)
   - Numpad grid (3×4 buttons: 1-9, 0, ., ⌫)
   - Input handling (append digit, decimal, backspace)
   - Auto-formatting with commas
   - Haptic feedback
2. Build Screen 7: Add/Edit Transaction
   - Customer name (readonly at top)
   - Current balance display
   - Amount Input component
   - "+ Add Note" expandable field
   - "📷 Add Photo" button (camera/gallery picker)
   - Date/Time picker (default: now, allow past)
   - SAVE button (green)
3. Photo upload flow:
   - Pick photo → Upload to Cloudinary/R2 via POST /uploads/presigned-url
   - Show thumbnail in form
   - Include file_url in transaction
4. Form validation (amount > 0)
5. Connect to POST /transactions API
6. Success flow:
   - Toast: "Transaction saved"
   - Snackbar with "Undo" (5 seconds)
   - Optional: "Send SMS confirmation?" prompt
   - Navigate back to Customer Detail

**Outputs:**

- `components/transactions/AmountInput.tsx` (Component 5)
- `screens/transactions/AddTransactionScreen.tsx` (Screen 7)
- `components/transactions/NoteInput.tsx`
- `components/transactions/PhotoPicker.tsx`
- `components/transactions/DateTimePicker.tsx`
- `store/api/transactionApi.ts`
- `utils/imageUpload.ts`

**Testing Checklist:**

- [ ] Customer Detail → YOU GAVE button → Navigate to Add Transaction
- [ ] Title shows "You Gave" (red) or "You Got" (green) based on type
- [ ] Customer name and balance display at top
- [ ] Tap numpad digits → Amount updates with live formatting (500 → ₹500 → ₹5,000)
- [ ] Tap decimal → Allows 2 decimal places (₹5,000.50)
- [ ] Tap backspace → Deletes last character
- [ ] Tap "+ Add Note" → Text area expands
- [ ] Tap "📷 Add Photo" → Camera/gallery picker opens → Shows thumbnail
- [ ] Tap date/time → Picker opens → Can select past date
- [ ] Tap SAVE with amount=0 → Validation error "Please enter an amount"
- [ ] Tap SAVE with amount=500 → Success → Navigate to Customer Detail
- [ ] Customer Detail balance updated (+500 for GAVE)
- [ ] New transaction appears at top of list
- [ ] Undo snackbar appears (5s) → Tap Undo → Transaction deleted, balance reverts

---

#### Task 5.5: Transaction List Component (4 hours)

**Inputs:**

- SCREEN_SPEC.md Component 3
- Task 5.4 (transactions created)

**Actions:**

1. Build Component 3: Transaction List Item
   - Amount with type icon (↑ for GAVE, ↓ for GOT)
   - Color-coded amount (#E53935 for GAVE, #1FAF38 for GOT)
   - Note text (gray, truncated if long)
   - Date and time (DD/MM/YYYY, HH:MM AM/PM)
   - Photo thumbnail (48x48 dp, rounded)
   - Swipe left to delete
2. Integrate into Customer Detail Screen:
   - Fetch GET /customers/:customer_id/transactions
   - Infinite scroll
   - Filter dropdown (All / Gave / Got / Date Range)
3. Add transaction tap action (navigate to view/edit)

**Outputs:**

- `components/transactions/TransactionListItem.tsx` (Component 3)
- Updated `CustomerDetailScreen.tsx` (transaction list)
- `components/transactions/TransactionFilterModal.tsx`

**Testing Checklist:**

- [ ] Customer Detail shows transaction list (from seeded data)
- [ ] Transactions sorted newest first
- [ ] GAVE transactions show ↑ icon and red amount
- [ ] GOT transactions show ↓ icon and green amount
- [ ] Note truncates if >50 characters, shows "..." (tap to expand)
- [ ] Photo thumbnail visible if transaction has attachment
- [ ] Tap transaction → Navigate to Transaction Detail (view mode)
- [ ] Swipe transaction left → Delete button appears
- [ ] Tap Delete → Confirmation dialog → Delete → Transaction removed, balance updates
- [ ] Filter dropdown works (show only GAVE or GOT)
- [ ] Scroll to bottom → Loads more transactions

---

#### Task 5.6: Offline Sync - Queue & Network Monitoring (6 hours)

**Inputs:**

- API_SPEC.md Section 12
- TECH_STACK.md sync architecture

**Actions:**

1. Install @react-native-community/netinfo
2. Create network status monitor service
3. Create sync queue manager:
   - Queue pending operations
   - Priority system (transactions > customers > other)
   - Persistence (AsyncStorage for queue state)
4. Create sync metadata tracking:
   - Track pending count
   - Track last sync timestamp
   - Track sync health status
5. Implement sync triggers:
   - On network reconnect
   - On app foreground
   - Manual trigger (pull-to-refresh)
   - Periodic (every 5 minutes if online)

**Outputs:**

- `services/sync/NetworkMonitor.ts`
- `services/sync/QueueManager.ts`
- `services/sync/SyncMetadata.ts`
- `hooks/useNetworkStatus.ts`
- `store/slices/syncSlice.ts` (status tracking)

**Testing Checklist:**

- [ ] Turn off WiFi → Network status updates to offline
- [ ] Turn on WiFi → Network status updates to online, triggers sync
- [ ] Create item offline → Added to queue
- [ ] Queue persists (close app, reopen, queue still there)
- [ ] High priority items processed first

---

#### Task 5.7: Offline Sync - Push Handler (6 hours)

**Inputs:**

- Task 5.6 (queue manager)
- API_SPEC.md POST /sync/push

**Actions:**

1. Create Push Handler service
2. Implement push logic:
   - Collect pending operations from queue
   - Batch into sync request (max 100 items)
   - Call POST /sync/push
   - Handle response (synced, conflicts, errors)
   - Update local records with server IDs
   - Remove synced items from queue
3. Implement retry logic:
   - Exponential backoff (1s, 2s, 4s, 8s, 16s)
   - Max 5 retries
   - Mark as failed after max retries
4. Optimistic updates:
   - Show success immediately
   - Sync in background
   - Revert if sync fails (rare)

**Outputs:**

- `services/sync/PushHandler.ts`
- `services/sync/RetryManager.ts`

**Testing Checklist:**

- [ ] Create 5 items offline → All added to queue
- [ ] Go online → Push handler batches and sends
- [ ] Server receives all 5 items
- [ ] Local records updated with server IDs
- [ ] Queue cleared
- [ ] Network fails mid-sync → Retry with backoff
- [ ] Max retries exceeded → Item marked failed

---

#### Task 5.8: Offline Sync - Pull Handler (6 hours)

**Inputs:**

- Task 5.6 (queue manager)
- API_SPEC.md POST /sync/pull

**Actions:**

1. Create Pull Handler service
2. Implement pull logic:
   - Call POST /sync/pull with last_sync_timestamp
   - Apply server changes to WatermelonDB
   - Update local records
   - Mark items as synced
   - Update last_sync_timestamp
3. Handle incremental pull (only changes since last sync)
4. Handle full pull (all data on first sync)
5. Reactive updates (WatermelonDB observables update UI automatically)

**Outputs:**

- `services/sync/PullHandler.ts`
- `services/sync/ChangeApplicator.ts`

**Testing Checklist:**

- [ ] Device A creates customer → Device B pulls → Customer appears
- [ ] Pull with last_sync_timestamp → Only new changes returned
- [ ] Pull without timestamp (first sync) → All data returned
- [ ] Deleted items pulled → Local records marked deleted
- [ ] UI updates automatically (WatermelonDB observables)

---

#### Task 5.9: Offline Sync - Conflict Resolution (6 hours)

**Inputs:**

- Tasks 5.7, 5.8 (push/pull handlers)
- API_SPEC.md POST /sync/resolve-conflict

**Actions:**

1. Create Conflict Resolver service
2. Implement conflict detection:
   - Compare local version vs server version
   - Detect concurrent updates
3. Implement resolution strategies:
   - Server wins (default for critical data like balances)
   - Last write wins (for user-editable fields)
   - Merge strategy (non-conflicting fields)
   - User prompt (for ambiguous conflicts)
4. Build conflict resolution modal:
   - Show both versions side-by-side
   - Let user choose or merge
   - Apply resolution
5. Call POST /sync/resolve-conflict with user's choice

**Outputs:**

- `services/sync/ConflictResolver.ts`
- `components/sync/ConflictResolutionModal.tsx`
- `utils/conflictDetector.ts`

**Testing Checklist:**

- [ ] Edit customer on Device A (offline), edit same on Device B (offline)
- [ ] Both go online → Conflict detected
- [ ] Modal appears showing both versions
- [ ] Select "Use Device A" → Device A version applied to both
- [ ] Server updated with resolution
- [ ] Both devices show same data after resolution

---

#### Task 5.10: Offline Sync - Integration & Testing (4 hours)

**Inputs:**

- Tasks 5.6-5.9 (complete sync engine)

**Actions:**

1. Integration testing for sync engine
2. Test multi-device scenarios
3. Test edge cases (poor network, large batches)
4. Load test sync (1000 items)
5. Fix integration bugs

**Outputs:**

- `tests/integration/sync.test.ts`
- Bug fixes

**Testing Checklist:**

- [ ] Sync 1000 items successfully
- [ ] Multi-device sync works
- [ ] Poor network handled gracefully
- [ ] All sync tests pass

---

#### Task 5.11: Transaction Module Integration Tests (4 hours)

**Inputs:**

- API_SPEC.md Section 12 (Offline Sync)
- TECH_STACK.md (offline-first architecture)
- Task 5.3 (WatermelonDB setup)

**Actions:**

1. Create sync engine architecture:
   - SyncEngine.ts (orchestrator)
   - PushHandler.ts (local → server)
   - PullHandler.ts (server → local)
   - ConflictResolver.ts (handle conflicts)
   - QueueManager.ts (pending operations queue)
2. Implement push logic:
   - Collect pending changes from sync_queue
   - Batch into POST /sync/push request
   - Handle response (synced, conflicts, errors)
   - Update local records with server IDs
   - Remove from queue if synced
3. Implement pull logic:
   - Call POST /sync/pull with last_sync_timestamp
   - Apply server changes to WatermelonDB
   - Detect conflicts (version mismatch)
   - Store conflicts for resolution
4. Implement conflict resolution:
   - Detect: local version ≠ server version
   - Strategies: use_local, use_server, merge
   - Default: server_wins for critical data
   - Prompt user for ambiguous conflicts
5. Network status monitoring (@react-native-community/netinfo)
6. Auto-sync triggers:
   - On network reconnect
   - On app foreground
   - Every 5 minutes (if online)
7. Sync status tracking (Redux slice)

**Outputs:**

- `services/sync/SyncEngine.ts`
- `services/sync/PushHandler.ts`
- `services/sync/PullHandler.ts`
- `services/sync/ConflictResolver.ts`
- `services/sync/QueueManager.ts`
- `store/slices/syncSlice.ts`
- `hooks/useSync.ts`
- `hooks/useNetworkStatus.ts`

**Testing Checklist:**

- [ ] **Offline creation:** Turn off WiFi → Create transaction → Saves to WatermelonDB
- [ ] Offline banner appears (yellow)
- [ ] Transaction shows sync pending icon (🔄)
- [ ] Turn on WiFi → Auto-sync triggers
- [ ] Sync banner shows "Syncing..." (blue)
- [ ] Transaction uploads to server
- [ ] Local record updated with server ID
- [ ] Sync pending icon disappears
- [ ] Banner changes to "Synced" (green) → Auto-dismisses
- [ ] **Conflict scenario:** Edit transaction on Device A offline, edit same on Device B offline → Both go online → Conflict detected → Resolution modal appears
- [ ] **Pull sync:** Create transaction on Device A → Device B pulls changes → Transaction appears
- [ ] Sync status in Settings shows "Last synced: X ago"

---

#### Task 5.7: Sync API Endpoints (6 hours)

**Inputs:**

- API_SPEC.md Section 12 (Offline Sync)
- DATABASE_SCHEMA.md (sync_metadata table)
- Task 5.6 (sync engine design)

**Actions:**

1. Create sync module
2. Implement POST /sync/push:
   - Accept batch of changes (entity_type, operation, data)
   - Validate each change
   - Apply to database (create/update/delete)
   - Detect conflicts (version mismatch)
   - Return: synced items, conflicts, errors
   - Update sync_metadata table
3. Implement POST /sync/pull:
   - Filter changes since last_sync_timestamp
   - Return all changes for khatabook
   - Include deleted items (deleted_at set)
   - Return new sync_timestamp
4. Implement POST /sync/resolve-conflict:
   - Accept resolution (use_local, use_server, merge)
   - Apply resolution to database
   - Return final data
5. Implement GET /sync/status:
   - Return pending items count
   - Return last_sync_at
   - Return conflicts count

**Outputs:**

- `modules/sync/sync.controller.ts`
- `modules/sync/sync.service.ts`
- `modules/sync/sync.routes.ts`
- `modules/sync/PushHandler.ts`
- `modules/sync/PullHandler.ts`

**Testing Checklist:**

- [ ] POST /sync/push with 3 changes → All synced successfully
- [ ] POST /sync/push with conflict → Returns conflict in response
- [ ] POST /sync/pull with last_sync_timestamp → Returns changes since then
- [ ] POST /sync/pull with no timestamp → Returns all data (full sync)
- [ ] POST /sync/resolve-conflict with use_server → Applies server version
- [ ] GET /sync/status → Returns correct pending count
- [ ] Sync metadata table updated with operations

---

#### Task 5.8: Integration - Transactions End-to-End (4 hours)

**Inputs:**

- Tasks 5.1-5.7 (all transaction pieces)

**Actions:**

1. Test complete transaction flow:
   - Online: Create → Shows immediately → Syncs to server
   - Offline: Create → Saves local → Queues for sync → Goes online → Syncs
   - Conflict: Create on 2 devices offline → Both online → Conflict → Resolve
2. Test balance calculations end-to-end
3. Test with photo attachments (upload queue)
4. Performance test (100 transactions, smooth scroll)
5. Fix any integration bugs discovered

**Outputs:**

- Integration test suite
- Bug fixes (if any)

**Testing Checklist:**

- [ ] Complete flow: Add 10 transactions across 3 customers → All balances correct
- [ ] Offline flow: Create 5 transactions offline → Go online → All sync successfully
- [ ] Photo flow: Add transaction with photo → Photo uploads → Thumbnail shows in list
- [ ] Conflict flow: Edit same transaction on 2 devices → Conflict detected → Resolve → Data consistent
- [ ] Performance: List of 100 transactions scrolls smoothly (60fps)
- [ ] All automated tests pass (unit + integration + E2E)

---

### Phase 6: Reminders (Week 6 - 3 days)

**Milestone:** WhatsApp/SMS payment reminders working with logging

---

#### Task 6.1: Reminders API & Integrations (6 hours)

**Inputs:**

- API_SPEC.md Section 10 (Reminders & Notifications)
- DATABASE_SCHEMA.md (reminder_logs table)
- TECH_STACK.md (MSG91, Twilio integrations)

**Actions:**

1. Create notifications module
2. Setup MSG91 SDK for SMS
3. Setup Twilio WhatsApp Business API
4. Implement POST /reminders/send:
   - Validate customer has phone/email
   - Render message template
   - Send via selected type (WHATSAPP/SMS/EMAIL)
   - Log to reminder_logs table
   - Return provider_message_id
5. Implement POST /reminders/send-bulk:
   - Queue background job (BullMQ)
   - Filter customers by min_balance
   - Send to all filtered customers
   - Return job_id
6. Implement GET /reminders (with filters)
7. Implement GET /customers/:customer_id/reminders
8. Create message templates

**Outputs:**

- `modules/notifications/notification.controller.ts`
- `modules/notifications/notification.service.ts`
- `modules/notifications/sms/MSG91Service.ts`
- `modules/notifications/whatsapp/TwilioWhatsAppService.ts`
- `modules/notifications/email/ResendService.ts`
- `services/queue/jobs/SendBulkRemindersJob.ts`
- `modules/notifications/templates/reminder.template.ts`

**Testing Checklist:**

- [ ] POST /reminders/send (type=WHATSAPP) → Logs reminder, returns provider ID
- [ ] Check WhatsApp → Message received with correct balance
- [ ] POST /reminders/send (type=SMS) → SMS received on phone
- [ ] POST /reminders/send-bulk (min_balance=1000) → Job queued
- [ ] GET /jobs/:job_id → Shows progress (5 of 10 sent)
- [ ] GET /reminders?customer_id=X → Returns reminder history
- [ ] GET /reminders?khatabook_id=X&type=WHATSAPP → Filters work
- [ ] reminder_logs table populated with all fields

---

#### Task 6.2: Mobile Send Reminder Screen (5 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 8 (Send Reminder)
- Task 6.1 (reminders API)

**Actions:**

1. Build Screen 8: Send Reminder
2. Type selector (segmented control):
   - WhatsApp tab (default if phone exists)
   - SMS tab
   - Email tab (disabled if no email)
3. Message preview (TextArea):
   - Pre-filled with template
   - Editable
   - Variables replaced ({customer_name}, {balance}, {business_name})
4. Send button:
   - Color based on type (green for WhatsApp, blue for SMS/Email)
   - Icon prefix (💬, 💬, 📧)
5. Connect to POST /reminders/send
6. On success:
   - Open WhatsApp/SMS app with pre-filled message
   - Log reminder
   - Navigate back to Customer Detail
   - Toast: "Reminder sent"
7. Show "Last reminded" metadata

**Outputs:**

- `screens/reminders/SendReminderScreen.tsx`
- `components/reminders/MessagePreview.tsx`
- `components/reminders/TypeSelector.tsx`
- `store/api/reminderApi.ts`

**Testing Checklist:**

- [ ] Customer Detail → WhatsApp icon → Navigate to Send Reminder
- [ ] WhatsApp tab active by default
- [ ] Message preview shows customer name and balance
- [ ] Edit message → Changes saved
- [ ] Tap "Send via WhatsApp" → API called → WhatsApp opens with message
- [ ] Message in WhatsApp contains correct balance
- [ ] User manually sends in WhatsApp
- [ ] Return to app → Customer Detail shows "Last reminded: Just now"
- [ ] SMS tab → Tap Send → SMS app opens with message
- [ ] Email tab disabled if customer has no email

---

#### Task 6.3: Bulk Reminders & Job Tracking (4 hours)

**Inputs:**

- API_SPEC.md (bulk reminders, jobs endpoint)
- Task 6.1 (bulk reminders API)

**Actions:**

1. Implement GET /jobs/:id endpoint:
   - Return job status, progress, result
   - Poll-able (check every 2s)
2. Add "Remind All" button to Dashboard:
   - Shows if any customers have balance > 0
   - Badge shows count of customers
3. Build Bulk Reminder modal:
   - Filter: Min balance (default: ₹0)
   - Customer count preview
   - Type selector (WhatsApp/SMS)
   - Send button
4. Job progress tracking:
   - Show progress: "Sending... 5 of 15"
   - Complete: "Sent to 15 customers"
   - Show results (sent, failed)
5. Connect to POST /reminders/send-bulk and GET /jobs/:id

**Outputs:**

- `modules/jobs/job.controller.ts`
- `modules/jobs/job.service.ts`
- Updated `DashboardScreen.tsx` (Remind All button)
- `components/reminders/BulkReminderModal.tsx`
- `components/jobs/JobProgressModal.tsx`

**Testing Checklist:**

- [ ] Dashboard shows "Remind All" button (if >0 customers with balance)
- [ ] Tap "Remind All" → Modal opens
- [ ] Shows: "Send reminder to 15 customers owing ₹1,000+"
- [ ] Set min balance to ₹5000 → Count updates to 3 customers
- [ ] Tap Send → Job queued → Progress modal shows
- [ ] Poll job status → Progress updates (5/15, 10/15, 15/15)
- [ ] Job completes → Success message: "Sent to 15 customers"
- [ ] Check reminder_logs → 15 new entries
- [ ] Some customers don't have WhatsApp → Fallback to SMS or show in failed list

---

### Phase 7: Reports & PDF Generation (Week 7 - 4 days)

**Milestone:** Business analytics and exportable reports (PDF, CSV)

---

#### Task 7.1: Reports API Endpoints (6 hours)

**Inputs:**

- API_SPEC.md Section 9 (Reports & Dashboard)
- DATABASE_SCHEMA.md (query patterns for reports)

**Actions:**

1. Create reports module
2. Implement GET /khatabooks/:id/reports/dashboard:
   - Summary (total_receivable, total_payable, net_balance)
   - Top 5 defaulters (highest balance)
   - Top 5 customers (by transaction volume)
   - Chart data (transactions_over_time, balance_trend)
   - Recent transactions (last 10)
3. Implement GET /khatabooks/:id/reports/customer-balance:
   - List all customers with opening_balance, total_gave, total_got, current_balance
   - Filter: balance_type (receivable/payable/all)
   - Sort: by balance
   - Totals row (sum of receivables, payables, net)
   - Format options: json, pdf, csv
4. Implement GET /khatabooks/:id/reports/transactions:
   - Date range filter (required)
   - Customer filter (optional)
   - Type filter (GAVE/GOT)
   - Summary (total_gave, total_got, net_amount, transaction_count)
   - Pagination for JSON format
5. Implement GET /khatabooks/:id/reports/cash-flow:
   - Date range filter
   - Group by (day/week/month)
   - Cash in (GOT), cash out (GAVE), net flow per period
6. Add Redis caching (2-5 min TTL for reports)

**Outputs:**

- `modules/reports/reports.controller.ts`
- `modules/reports/reports.service.ts`
- `modules/reports/reports.routes.ts`
- `modules/reports/queries/dashboard.queries.ts`
- `modules/reports/queries/customer-balance.queries.ts`

**Testing Checklist:**

- [ ] GET /khatabooks/:id/reports/dashboard → Returns all required fields
- [ ] Top defaulters sorted correctly (highest balance first)
- [ ] Chart data has correct structure (date, gave_amount, got_amount)
- [ ] GET /khatabooks/:id/reports/customer-balance → Lists all customers
- [ ] Totals row sums correctly
- [ ] GET /khatabooks/:id/reports/transactions?date_from=2026-03-01&date_to=2026-03-31 → Filters work
- [ ] Summary calculations correct (manual verification)
- [ ] GET /khatabooks/:id/reports/cash-flow?group_by=week → Groups by week correctly
- [ ] Subsequent identical requests fast (Redis cache hit)

---

#### Task 7.2: PDF Generation Service (6 hours)

**Inputs:**

- TECH_STACK.md (Puppeteer for PDF)
- Task 7.1 (reports data)

**Actions:**

1. Setup Puppeteer (headless Chrome)
2. Create HTML templates for reports:
   - Customer Balance Report template (table with customer rows)
   - Transaction Report template (table with transaction rows)
   - Professional styling (borders, headers, footers)
   - Include business logo (if configured)
3. Create PDFGenerator service:
   - renderHTML(template, data)
   - generatePDF(html) → Buffer
   - uploadPDF(buffer, filename) → R2 URL
4. Integrate Cloudflare R2 for PDF storage:
   - R2Service.ts (upload, get presigned URL)
   - Bucket configuration
5. Implement PDF generation for each report type
6. Add to report endpoints (format=pdf query param)

**Outputs:**

- `services/pdf/PDFGenerator.ts`
- `services/pdf/templates/customer-balance.html`
- `services/pdf/templates/transaction-report.html`
- `services/storage/R2Service.ts`
- `utils/htmlRenderer.ts`

**Testing Checklist:**

- [ ] GET /khatabooks/:id/reports/customer-balance?format=pdf → Returns file_url
- [ ] Download PDF from URL → Opens correctly
- [ ] PDF contains customer list with correct balances
- [ ] PDF has professional formatting (table borders, headers)
- [ ] Business logo appears in header (if configured)
- [ ] GET /khatabooks/:id/reports/transactions?format=pdf&date_from=...&date_to=... → PDF generated
- [ ] Transaction PDF shows date range in title
- [ ] PDFs stored in R2 bucket (check R2 dashboard)
- [ ] Presigned URLs expire after 24 hours

---

#### Task 7.3: Mobile Reports Screens (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screens 9, Report view pattern
- Task 7.1 (reports API)

**Actions:**

1. Build Screen 9: Reports List
   - Report type cards × 5
   - Icons for each report type
   - Tap to navigate to report config
2. Build Report Configuration modal:
   - Date range picker (Today, Week, Month, Year, Custom)
   - Filter options (customer, type)
   - Format selector (View / PDF / Excel)
   - Generate button
3. Build Report View screen:
   - Table display for customer balance, transaction reports
   - Scrollable data table
   - Export actions (Download PDF, Share)
4. Connect to reports API endpoints
5. Implement PDF download and share

**Outputs:**

- `screens/reports/ReportsListScreen.tsx`
- `screens/reports/ReportViewScreen.tsx`
- `components/reports/ReportTypeCard.tsx`
- `components/reports/DateRangePicker.tsx`
- `components/reports/ReportTable.tsx`
- `store/api/reportsApi.ts`

**Testing Checklist:**

- [ ] Navigate to Reports tab → Reports List appears
- [ ] See 5 report type cards (Customer Balance, Transactions, Cash Flow, GST, Analytics)
- [ ] Tap "Customer Balance" → Config modal opens
- [ ] Select "This Month" → Generate → Report view shows customer list
- [ ] Data matches API response
- [ ] Tap "Download PDF" → PDF downloads to device
- [ ] Tap "Share" → Share sheet opens → Share via WhatsApp → PDF attached
- [ ] Transaction report with custom date range works
- [ ] Cash Flow report shows chart (placeholder for now, real chart in Phase 10)

---

#### Task 7.4: Advanced Analytics Screen (P1 - 6 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 14 (Advanced Analytics)
- Task 7.1 (dashboard API with chart data)

**Actions:**

1. Install Victory Native: `pnpm add victory-native react-native-svg`
2. Build Screen 14: Advanced Analytics
3. Transaction trends chart:
   - Bar chart or line chart
   - X-axis: Dates/weeks
   - Y-axis: Amount
   - Two series: You Gave (red bars), You Got (green bars)
4. Top customers ranked list (with medals 🥇🥈🥉)
5. Top defaulters list (with warning icons)
6. Cash flow card (total in, total out, net with arrow)
7. Date range filter (updates all charts)
8. Connect to dashboard API

**Outputs:**

- `screens/analytics/AnalyticsScreen.tsx`
- `components/charts/TransactionTrendChart.tsx`
- `components/charts/CashFlowCard.tsx`
- `components/charts/RankedList.tsx`

**Testing Checklist:**

- [ ] Navigate to Reports → Business Analytics
- [ ] Transaction trends chart renders with real data
- [ ] Chart shows 2 series (red bars for GAVE, green bars for GOT)
- [ ] Top customers list shows 5 customers sorted by volume
- [ ] Top defaulters shows customers with highest outstanding balance
- [ ] Tap date range → Modal opens → Select "This Week" → Charts update
- [ ] Tap customer in list → Navigate to Customer Detail
- [ ] Charts responsive (rotates on device rotation)

---

### Phase 8: Invoices (Week 8 - 5 days) **P1 Feature**

**Milestone:** GST-compliant invoice generation with PDF output and WhatsApp sharing

---

#### Task 8.1: Invoice Settings API (4 hours)

**Inputs:**

- API_SPEC.md (invoice-settings endpoints)
- DATABASE_SCHEMA.md (invoice_settings table)

**Actions:**

1. Implement GET /khatabooks/:id/invoice-settings:
   - Return business details, GSTIN, logo, invoice prefix, bank details
   - Create default settings if not exists
2. Implement PUT /khatabooks/:id/invoice-settings:
   - Update all fields
   - Validate GSTIN format (15 chars, specific pattern)
   - Upload logo to Cloudinary (if provided)
   - Update next_invoice_number
3. Add to khatabooks module

**Outputs:**

- `modules/khatabooks/invoice-settings.controller.ts`
- `modules/khatabooks/invoice-settings.service.ts`
- `utils/validators/gstin.validator.ts`

**Testing Checklist:**

- [ ] GET /khatabooks/:id/invoice-settings → Returns settings (or creates default)
- [ ] PUT /khatabooks/:id/invoice-settings → Updates business name
- [ ] Update GSTIN with valid format → Saves correctly
- [ ] Update GSTIN with invalid format → 400 validation error
- [ ] Upload logo → Cloudinary URL saved
- [ ] Bank details (JSONB) save correctly
- [ ] Next invoice number increments on invoice creation

---

#### Task 8.2: Invoices API - CRUD (8 hours)

**Inputs:**

- API_SPEC.md Section 7 (Invoices Management)
- DATABASE_SCHEMA.md (invoices, invoice_items tables)

**Actions:**

1. Create invoices module
2. Implement POST /invoices:
   - Create invoice with items array
   - Auto-generate invoice_number (from invoice_settings)
   - Calculate subtotal (sum of item totals)
   - Calculate taxes per item (based on tax_rate)
   - Determine CGST/SGST vs IGST (same state vs different state)
   - Calculate total (subtotal + taxes)
   - Create invoice_items records
   - Auto-create transaction (type=GAVE) if create_transaction=true
   - Return complete invoice with items and tax_breakdown
3. Implement GET /invoices (list with filters)
4. Implement GET /invoices/:id (with customer and business details)
5. Implement PUT /invoices/:id (only DRAFT can be edited)
6. Implement DELETE /invoices/:id (soft delete)
7. Tax calculation logic:
   - Item total = quantity × rate
   - Item tax = item_total × (tax_rate / 100)
   - If same state: CGST = tax/2, SGST = tax/2
   - If different state: IGST = tax
8. Amount in words conversion (utility function)

**Outputs:**

- `modules/invoices/invoice.controller.ts`
- `modules/invoices/invoice.service.ts`
- `modules/invoices/invoice.routes.ts`
- `modules/invoices/invoice.validators.ts`
- `modules/invoices/tax-calculator.service.ts`
- `utils/amountToWords.ts`

**Testing Checklist:**

- [ ] POST /invoices with 2 items → Invoice created with correct totals
- [ ] Tax calculation: Item ₹100 @ 12% GST → Tax = ₹12 → Total = ₹112
- [ ] CGST + SGST = Total tax (same state)
- [ ] Subtotal + Tax = Total amount
- [ ] Invoice number auto-generated (INV-0001, INV-0002, ...)
- [ ] Invoice number unique per khatabook
- [ ] Transaction auto-created if create_transaction=true
- [ ] Customer balance increases by invoice total
- [ ] GET /invoices?khatabook_id=X&status=DRAFT → Filters work
- [ ] PUT /invoices/:id (status=DRAFT) → Updates successfully
- [ ] PUT /invoices/:id (status=PAID) → 422 error (cannot edit paid invoice)
- [ ] Amount in words: ₹11,200 → "Eleven Thousand Two Hundred Rupees Only"

---

#### Task 8.3: Invoice PDF Template (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 11 (Invoice Preview - PDF structure)
- Task 7.2 (PDF generation infrastructure)
- GST invoice format requirements

**Actions:**

1. Create GST invoice HTML template:
   - Header: Business logo, name, GSTIN, address
   - Invoice details: Invoice #, Date, Due Date
   - Bill To: Customer name, phone, address, GSTIN (if applicable)
   - Items table: Item, Qty, Unit, Rate, Tax %, Tax Amount, Total
   - Tax summary: Subtotal, CGST, SGST/IGST, Grand Total
   - Total in words
   - Bank details (if configured)
   - Terms & Conditions
   - Footer: "This is a computer-generated invoice"
2. Create non-GST invoice template (simpler, no tax breakdown)
3. Professional CSS styling:
   - Table borders
   - Alternating row colors
   - Bold totals
   - Page breaks for multi-page
4. Implement GET /invoices/:id/pdf:
   - Check if pdf_url exists
   - If not, generate PDF (async job)
   - Upload to R2
   - Update invoice.pdf_url
   - Return URL
5. Implement PUT /invoices/:id (update status: SENT, PAID, CANCELLED)

**Outputs:**

- `services/pdf/templates/gst-invoice.html`
- `services/pdf/templates/simple-invoice.html`
- `modules/invoices/InvoicePDFGenerator.ts`
- Updated invoice.controller.ts (PDF endpoint)

**Testing Checklist:**

- [ ] GET /invoices/:id/pdf → PDF URL returned
- [ ] Download PDF → Opens in viewer
- [ ] PDF contains all fields (business, customer, items, taxes, total)
- [ ] GST invoice shows CGST + SGST breakdown
- [ ] Non-GST invoice shows simple total (no tax breakdown)
- [ ] Logo appears in header (if configured)
- [ ] Bank details appear in footer (if configured)
- [ ] Amount in words: "Eleven Thousand Two Hundred Rupees Only"
- [ ] Table has borders, professional formatting
- [ ] Multi-page invoice breaks pages correctly
- [ ] PDF regenerates if ?regenerate=true query param

---

#### Task 8.4: Mobile Create Invoice Screen (8 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 10 (Create Invoice)
- Task 8.2 (invoices API)

**Actions:**

1. Build Screen 10: Create Invoice
2. Customer dropdown (searchable)
3. Invoice number input (auto-filled, editable)
4. Date picker (invoice date, due date)
5. GST invoice checkbox (toggles tax fields)
6. Add Item functionality:
   - Opens Add Item modal (bottom sheet)
   - Form: Item name, quantity, unit, rate, tax rate, HSN code
   - Real-time total calculation per item
   - Add multiple items
7. Invoice items list:
   - Show each item with qty × rate = total
   - Swipe to delete item
   - Tap to edit item
8. Totals summary card:
   - Subtotal
   - CGST, SGST (if GST invoice)
   - Grand Total (bold, large)
9. Preview button → Calls POST /invoices → Navigate to Preview
10. Settings icon → Navigate to Invoice Settings screen

**Outputs:**

- `screens/invoices/CreateInvoiceScreen.tsx`
- `components/invoices/AddItemModal.tsx`
- `components/invoices/InvoiceItemCard.tsx`
- `components/invoices/InvoiceTotalsCard.tsx`
- `screens/invoices/InvoiceSettingsScreen.tsx`
- `store/api/invoiceApi.ts`

**Testing Checklist:**

- [ ] Open Create Invoice → Form loads
- [ ] Select customer from dropdown
- [ ] Invoice number auto-filled (INV-0001)
- [ ] Tap "+ Add Item" → Modal opens
- [ ] Fill item (Cotton Fabric, 100m, ₹80/m, 12% GST) → Tap Add
- [ ] Item appears in list: 100m × ₹80 + 12% tax = ₹8,960
- [ ] Add 2nd item → Totals update
- [ ] Subtotal = sum of items before tax
- [ ] CGST + SGST = total tax
- [ ] Total = subtotal + tax
- [ ] Toggle GST checkbox off → Tax fields disappear, simple total
- [ ] Tap Preview → Loading → Success → Navigate to Invoice Preview
- [ ] Invoice created in database
- [ ] Transaction auto-created (customer balance increases)

---

#### Task 8.5: Mobile Invoice Preview & Share (5 hours)

[Keep existing Task 8.5 content]

---

#### Task 8.6: Invoice Module Integration Tests (4 hours)

**Inputs:**

- Tasks 8.1-8.5 (complete invoice module)

**Actions:**

1. Integration tests for invoice creation flow
2. Test tax calculations (CGST/SGST/IGST)
3. Test PDF generation pipeline
4. Test invoice-transaction linkage
5. Verify GST compliance

**Outputs:**

- `tests/integration/invoices.test.ts`

**Testing Checklist:**

- [ ] Create invoice → Transaction auto-created
- [ ] Tax calculations verified mathematically
- [ ] PDF contains all required fields
- [ ] Integration tests pass

---

#### Task 8.7: Mobile Invoice Preview & Share (5 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 11 (Invoice Preview)
- Task 8.3 (invoice PDF generation)

**Actions:**

1. Build Screen 11: Invoice Preview
2. PDF Viewer:
   - Install react-native-pdf or use WebView
   - Load PDF from GET /invoices/:id/pdf
   - Scrollable, zoomable
   - Loading state while generating (2-5s)
3. Action buttons:
   - Share via WhatsApp (opens WhatsApp with PDF attached)
   - Download PDF (saves to device Downloads folder)
   - Print (opens system print dialog)
4. Overflow menu:
   - Edit Invoice → Navigate back to Create Invoice (edit mode)
   - Change Status (SENT, PAID, CANCELLED)
   - Delete Invoice
5. Implement share functionality (react-native-share)

**Outputs:**

- `screens/invoices/InvoicePreviewScreen.tsx`
- `components/invoices/PDFViewer.tsx`
- `utils/sharePDF.ts`

**Testing Checklist:**

- [ ] After creating invoice → Navigate to Preview
- [ ] PDF loads and displays (may take 3-5 seconds)
- [ ] Can scroll through PDF
- [ ] Pinch to zoom works (if supported)
- [ ] Tap "Share via WhatsApp" → WhatsApp opens with PDF attached
- [ ] Message pre-filled: "Hi {customer}, here's your invoice..."
- [ ] Send in WhatsApp → Returns to app → Invoice status updated to SENT
- [ ] Tap "Download" → PDF saves to device → Toast: "Invoice saved to Downloads"
- [ ] Tap folder icon (notification) → Opens PDF in viewer
- [ ] Tap "Print" → Print dialog opens
- [ ] Overflow → "Mark as Paid" → Confirmation → Status updated
- [ ] Overflow → "Edit" → Navigate to Edit screen → Can modify items

---

### Phase 9: Inventory Management (Week 9 - 3 days) **P2 Feature**

**Milestone:** Product inventory tracking with low stock alerts

---

#### Task 9.1: Inventory API (6 hours)

**Inputs:**

- API_SPEC.md Section 8 (Inventory Management)
- DATABASE_SCHEMA.md (inventory_items, stock_logs tables)

**Actions:**

1. Create inventory module
2. Implement GET /inventory:
   - List all items for khatabook
   - Filter: low_stock_only (current_stock <= min_stock_level)
   - Search by item name, SKU, barcode
   - Return is_low_stock flag
   - Summary: total_items, low_stock_items, total_stock_value
3. Implement POST /inventory (create item)
4. Implement GET /inventory/:id
5. Implement PUT /inventory/:id (update details, not stock)
6. Implement DELETE /inventory/:id (soft delete)
7. Implement POST /inventory/:id/adjust-stock:
   - Type: IN, OUT, ADJUSTMENT
   - Create stock_log entry
   - Update current_stock
   - Return balance_before, balance_after
8. Implement GET /inventory/:id/stock-logs (pagination)
9. Low stock detection logic

**Outputs:**

- `modules/inventory/inventory.controller.ts`
- `modules/inventory/inventory.service.ts`
- `modules/inventory/stock-logs.service.ts`
- `modules/inventory/inventory.routes.ts`

**Testing Checklist:**

- [ ] POST /inventory (Rice, 50 pcs, ₹100) → Item created
- [ ] GET /inventory?khatabook_id=X → Returns items list
- [ ] GET /inventory?low_stock_only=true → Filters low stock items
- [ ] POST /inventory/:id/adjust-stock (IN, +20) → Stock increases, log created
- [ ] POST /inventory/:id/adjust-stock (OUT, -5) → Stock decreases
- [ ] GET /inventory/:id/stock-logs → Shows all movements
- [ ] Item with current_stock=8, min_stock_level=10 → is_low_stock=true
- [ ] Summary calculates total_stock_value correctly (sum of current_stock × selling_price)

---

#### Task 9.2: Mobile Inventory Screens (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screens 12, 13 (Inventory)
- Task 9.1 (inventory API)

**Actions:**

1. Build Screen 12: Inventory List
   - Stats summary card (total items, stock value, low stock count)
   - Filter tabs (All Items / Low Stock)
   - Inventory item cards
   - Low stock indicator (orange background, ⚠️ icon)
   - FAB (add new item)
2. Build Screen 13: Add/Edit Inventory Item
   - Form: Item name, SKU, barcode, description
   - Pricing: Purchase price, selling price
   - Stock: Current stock, min stock level, unit dropdown
   - Tax: GST rate, HSN code
   - Image upload
3. Stock adjustment quick modal (from item context menu)
4. Connect to inventory API

**Outputs:**

- `screens/inventory/InventoryListScreen.tsx`
- `screens/inventory/AddEditItemScreen.tsx`
- `components/inventory/InventoryItemCard.tsx`
- `components/inventory/StockAdjustModal.tsx`
- `store/api/inventoryApi.ts`

**Testing Checklist:**

- [ ] Navigate to Inventory (add nav item or access via menu)
- [ ] Shows stats: "45 items, ₹1.25L value, 5 low stock"
- [ ] Items list displays (from seeded data)
- [ ] Low stock items have orange background and ⚠️ icon
- [ ] Tap "Low Stock" tab → Filters to low stock items only
- [ ] Tap item → Navigate to Edit screen
- [ ] Tap FAB → Navigate to Add Item screen
- [ ] Fill form → Save → Item created → Appears in list
- [ ] Tap item menu → "Adjust Stock" → Quick modal → +20 → Stock updates
- [ ] Barcode scanner button (may require native module or skip for MVP)

---

### Phase 10: Dashboard & Charts (Week 10 - 3 days)

**Milestone:** Complete Dashboard with real-time stats and visual analytics

---

#### Task 10.1: Dashboard Stats Calculation & Caching (4 hours)

**Inputs:**

- Task 3.1 (khatabooks API with basic stats)
- Task 7.1 (dashboard report API)

**Actions:**

1. Enhance GET /khatabooks/:id with complete stats:
   - Total customers (count)
   - Total receivable (sum of positive balances)
   - Total payable (sum of negative balances)
   - Net balance (receivable - payable)
   - Total transactions (count)
   - Transactions this month (count with date filter)
   - Top 5 defaulters (customers with highest positive balance)
   - Top 5 customers (by transaction volume)
2. Implement Redis caching:
   - Cache dashboard stats (TTL: 2 minutes)
   - Invalidate cache on data changes (new transaction, customer, etc.)
   - Cache key pattern: `dashboard:stats:{khatabook_id}`
3. Optimize queries (use indexes, single query where possible)
4. Add cache hit/miss logging

**Outputs:**

- Updated `khatabook.service.ts` (enhanced stats queries)
- `services/cache/RedisService.ts` (caching layer)
- `services/cache/CacheInvalidator.ts` (invalidation logic)

**Testing Checklist:**

- [ ] GET /khatabooks/:id → Returns all stats fields
- [ ] Stats calculations correct (manually verify sums)
- [ ] First request → Cache miss (slower, ~100-150ms)
- [ ] Second request within 2 min → Cache hit (faster, ~20-30ms)
- [ ] Create new transaction → Cache invalidated
- [ ] Next request → Cache miss (recalculates with new transaction)
- [ ] Top defaulters sorted correctly (highest balance first)
- [ ] Top customers include transaction volume metric

---

#### Task 10.2: Mobile Dashboard Complete (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 5 (complete Dashboard)
- Task 10.1 (dashboard stats API)
- Task 4.2 (customer list already integrated)

**Actions:**

1. Finalize Dashboard screen with all components:
   - Summary cards update from API stats
   - Customer list with infinite scroll
   - Search integration
   - Sort dropdown
   - FAB with action sheet (Add Customer / Add Transaction)
   - Pull-to-refresh
   - Offline banner (Component 12)
2. Implement real-time stat updates:
   - After transaction → Optimistically update summary cards
   - Background refetch for accuracy
3. Add sync status indicator in top bar
4. Polish animations and transitions

**Outputs:**

- Completed `screens/home/DashboardScreen.tsx`
- `components/ui/OfflineBanner.tsx` (Component 12)
- `components/dashboard/FABActionSheet.tsx`

**Testing Checklist:**

- [ ] Dashboard loads with real stats from API
- [ ] Summary cards show: ₹1,25,000 (receivable), ₹25,000 (payable), ₹1,00,000 (net)
- [ ] Customer list shows all customers sorted by balance
- [ ] Tap search → Search filters list in real-time
- [ ] Tap FAB → Action sheet: "Add Customer" / "Add Transaction"
- [ ] Tap "Add Transaction" → Customer selector modal → Select customer → Transaction entry
- [ ] Pull down → Refreshes stats and customer list
- [ ] Create new transaction → Dashboard stats update immediately (optimistic)
- [ ] Go offline → Offline banner appears
- [ ] Create transaction offline → Saves locally → Banner shows "1 pending"
- [ ] Go online → Auto-syncs → Banner dismisses

---

### Phase 11: Settings & Internationalization (Week 11 - 3 days)

**Milestone:** Multi-language support (11 languages) and complete settings

---

#### Task 11.1: Settings API Endpoints (4 hours)

**Inputs:**

- API_SPEC.md (auth endpoints for settings)
- Task 2.1 (auth API)

**Actions:**

1. Implement GET /auth/sessions:
   - List all active sessions for user
   - Show device_id, device_type, device_name, last_activity_at
   - Mark current session (is_current=true)
2. Implement DELETE /auth/sessions/:id:
   - Revoke specific session
   - Blacklist refresh token
3. Implement DELETE /auth/me:
   - Soft delete user account (deleted_at)
   - 30-day grace period before permanent deletion
   - Can restore by logging in again within 30 days
4. Implement POST /khatabooks/:id/reports/export:
   - Queue export job
   - Generate CSV with all data (customers, transactions, invoices)
   - Return job_id
   - On complete, return file_url

**Outputs:**

- Updated `modules/auth/auth.controller.ts`
- `services/export/DataExporter.ts`
- `services/queue/jobs/ExportDataJob.ts`

**Testing Checklist:**

- [ ] GET /auth/sessions → Lists all sessions with device info
- [ ] Current session marked with is_current=true
- [ ] DELETE /auth/sessions/:id (different device) → Logs out that device
- [ ] Try using token from revoked session → 403 forbidden
- [ ] DELETE /auth/me → User soft deleted (deleted_at set)
- [ ] Try logging in with deleted account → Restores account (deleted_at = null)
- [ ] POST /khatabooks/:id/reports/export → Job queued
- [ ] Poll job → CSV generated with all data
- [ ] Download CSV → Contains customers, transactions, balances

---

#### Task 11.2: Mobile Settings Screen (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 15 (Settings)
- Task 11.1 (settings API)

**Actions:**

1. Build Screen 15: Settings (complete)
2. Account section:
   - Profile row (navigate to Edit Profile screen)
   - Language row (opens language selector modal)
   - Active Khatabook row (opens switcher modal)
3. Security section:
   - Biometric toggle (react-native-biometrics)
   - App PIN row (navigate to Set PIN screen)
4. Invoice Settings section (P1):
   - Business Details row (navigate to Invoice Settings)
5. Data & Backup section:
   - Sync status display (last_sync_at, pending_count)
   - Export Data button (downloads CSV)
6. About section:
   - Version number (from package.json)
   - Terms & Privacy links
   - Help & Support
   - Rate App
7. Log Out button (destructive, red text)
8. Build Edit Profile screen (name, email, photo upload)
9. Build Set PIN screen (enter 4-digit PIN, confirm)

**Outputs:**

- `screens/settings/SettingsScreen.tsx`
- `screens/settings/EditProfileScreen.tsx`
- `screens/settings/SetPINScreen.tsx`
- `services/auth/BiometricService.ts`
- `services/auth/PINService.ts`

**Testing Checklist:**

- [ ] Navigate to Settings tab → All sections visible
- [ ] Tap Profile → Edit Profile screen → Change name → Save → Updates in Settings
- [ ] Tap Language → Modal opens (language list)
- [ ] Tap Biometric toggle → Requests permission → Enables Face ID/Fingerprint
- [ ] Close app → Reopen → Biometric prompt appears → Authenticate → App unlocks
- [ ] Tap App PIN → Set PIN screen → Enter 1234 → Confirm 1234 → PIN saved
- [ ] Close app → Reopen → PIN prompt → Enter 1234 → App unlocks
- [ ] Tap Business Details → Invoice Settings screen → Edit GSTIN → Save
- [ ] Sync status shows: "✓ All synced (2 min ago)" or "⚡ 3 pending"
- [ ] Tap Export Data → Downloads CSV → Toast: "Data exported"
- [ ] Tap Log Out → Confirmation → Logs out → Navigate to Login screen

---

#### Task 11.3: i18n Setup + English + Hindi (8 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 0 (Language Selection)
- PRD multi-language requirements

**Actions:**

1. Install react-i18next
2. Configure i18n framework
3. Create English translation file (en.json) - ALL strings
4. Create Hindi translation file (hi.json) - professional translation
5. Wrap all hardcoded strings with t() function
6. Number/date formatting (Indian locale)
7. Update all screens to use translations

**Outputs:**

- `localization/i18n.ts`
- `localization/languages/en.json` (complete ~500 strings)
- `localization/languages/hi.json` (complete)
- `utils/formatters/currency.ts`
- `utils/formatters/date.ts`

**Testing Checklist:**

- [ ] Switch to Hindi → All UI text in Hindi
- [ ] Currency formats as ₹1,25,000
- [ ] Dates format as DD/MM/YYYY
- [ ] Language persists across app restarts

---

#### Task 11.4: South Indian Languages (Tamil, Telugu, Kannada, Malayalam) (6 hours)

**Inputs:**

- Task 11.3 (i18n setup)
- English strings

**Actions:**

1. Translate en.json to Tamil (ta.json)
2. Translate en.json to Telugu (te.json)
3. Translate en.json to Kannada (kn.json)
4. Translate en.json to Malayalam (ml.json)
5. Test rendering of Dravidian scripts
6. Native speaker review (if possible)

**Outputs:**

- `localization/languages/ta.json`
- `localization/languages/te.json`
- `localization/languages/kn.json`
- `localization/languages/ml.json`

**Testing Checklist:**

- [ ] Switch to Tamil → UI in Tamil script
- [ ] All 4 languages render correctly
- [ ] No character encoding issues

---

#### Task 11.5: North/West Indian Languages (Marathi, Gujarati, Punjabi) (5 hours)

**Inputs:**

- Task 11.3 (i18n setup)

**Actions:**

1. Translate to Marathi (mr.json)
2. Translate to Gujarati (gu.json)
3. Translate to Punjabi (pa.json)
4. Test Devanagari and Gujarati scripts

**Outputs:**

- `localization/languages/mr.json`
- `localization/languages/gu.json`
- `localization/languages/pa.json`

**Testing Checklist:**

- [ ] All 3 languages work correctly
- [ ] Gujarati script renders properly

---

#### Task 11.6: Bengali + Odia + Translation QA (5 hours)

**Inputs:**

- Task 11.3-11.5 (other languages)

**Actions:**

1. Translate to Bengali (bn.json)
2. Translate to Odia (or.json)
3. Comprehensive translation QA:
   - Verify all keys present in all languages
   - Check for missing translations
   - Verify special characters and numbers
4. RTL support check (if applicable)
5. Test language switching edge cases

**Outputs:**

- `localization/languages/bn.json`
- `localization/languages/or.json`
- `docs/TRANSLATION_QA.md`

**Testing Checklist:**

- [ ] All 11 languages complete
- [ ] Language selector shows all options
- [ ] No missing translations
- [ ] Currency/dates format correctly in all languages

---

### Phase 12: Payments Integration (Week 11-12 - 3 days) **P1 Feature**

**Milestone:** Digital payment collection via UPI/cards/wallets using Razorpay

---

#### Task 12.1: Razorpay Integration (6 hours)

**Inputs:**

- API_SPEC.md Section 11 (Payments)
- DATABASE_SCHEMA.md (payments table)
- TECH_STACK.md (Razorpay)

**Actions:**

1. Setup Razorpay SDK (backend)
2. Implement POST /payments/create-link:
   - Create Razorpay order
   - Generate payment link (short URL)
   - Save to payments table (status=PENDING)
   - Return payment_link, gateway_order_id
3. Implement POST /payments/webhook:
   - Verify Razorpay signature (CRITICAL - security)
   - Handle payment.captured event
   - Update payment status to SUCCESS
   - Auto-create GOT transaction (update customer balance)
   - Send payment confirmation SMS to customer
   - Handle payment.failed event
4. Implement GET /payments/:id (payment details)
5. Implement GET /payments (list with filters)
6. Configure webhook URL in Razorpay dashboard

**Outputs:**

- `modules/payments/payment.controller.ts`
- `modules/payments/payment.service.ts`
- `modules/payments/providers/RazorpayService.ts`
- `modules/payments/webhook.controller.ts`
- `modules/payments/signature.validator.ts`

**Testing Checklist:**

- [ ] POST /payments/create-link (amount=5000) → Razorpay order created, link returned
- [ ] Open payment link in browser → Razorpay checkout page loads
- [ ] Test payment (use Razorpay test cards) → Payment succeeds
- [ ] Webhook received → Signature verified → Payment status updated
- [ ] GOT transaction auto-created (customer balance decreases by 5000)
- [ ] Customer receives SMS: "You paid ₹5,000 to {business}..."
- [ ] GET /payments/:id → Shows status=SUCCESS, paid_at timestamp
- [ ] Test failed payment → Webhook handled → Status=FAILED, failed_reason logged
- [ ] GET /payments?customer_id=X → Lists payments for customer

---

#### Task 12.2: Mobile Payment Link Generation (5 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 13B (Generate Payment Link)
- Task 12.1 (payments API)

**Actions:**

1. Build Screen 13B: Generate Payment Link
2. Amount input (default to customer full balance)
3. Quick chips: "Full Balance ₹5,000" / "Custom"
4. Payment method checkboxes (UPI, Cards, Wallets, Netbanking - all checked)
5. Optional note field
6. Generate button → Calls POST /payments/create-link
7. Success screen:
   - Shows payment link (https://rzp.io/l/...)
   - Copy link button
   - Share via WhatsApp button
   - Share via SMS button
8. Add to Customer Detail overflow menu: "Collect Payment"

**Outputs:**

- `screens/payments/GeneratePaymentLinkScreen.tsx`
- `components/payments/PaymentLinkSuccessCard.tsx`
- `store/api/paymentApi.ts`

**Testing Checklist:**

- [ ] Customer Detail → Menu → "Collect Payment" → Navigate to Generate Link screen
- [ ] Amount pre-filled with customer balance
- [ ] Tap "Full Balance" chip → Sets exact balance amount
- [ ] Tap Generate → Loading → Success screen appears
- [ ] Payment link displayed
- [ ] Tap "Copy" → Clipboard has link → Toast: "Link copied"
- [ ] Tap "Share via WhatsApp" → WhatsApp opens → Link in message
- [ ] Customer opens link → Razorpay checkout → Pays → Webhook triggers
- [ ] Return to app → Customer balance updated (check Customer Detail)
- [ ] Payment listed in GET /payments

---

### Phase 13: Testing, Security, Deployment & Launch (Week 12-13 - 8 days)

**Milestone:** Production-ready app with comprehensive tests, security hardening, and deployed to stores

---

#### Task 13.1: Comprehensive Testing Suite (8 hours)

**Inputs:**

- All implemented features (Phases 0-12)
- CLAUDE.md (testing strategy)

**Actions:**

1. Backend unit tests:
   - All service functions (balance calculation, tax calculation, etc.)
   - All validators (Zod schemas)
   - All utilities (formatters, converters)
   - Target: 80%+ coverage
2. Backend integration tests:
   - All API endpoints (request → response)
   - Auth flow (OTP → JWT → refresh)
   - Transaction creation → balance update
   - Invoice creation → tax calculation
   - Sync push/pull
3. Mobile component tests:
   - All reusable components (12 components)
   - Snapshot tests for UI consistency
4. Mobile E2E tests (Detox):
   - Complete onboarding flow
   - Add customer → Add transaction → Check balance
   - Generate invoice → Preview → Share
   - Offline scenario (create transaction offline → sync online)
5. Load testing:
   - 100 concurrent users
   - API response times (P95 < 200ms)

**Outputs:**

- `apps/backend/tests/unit/**/*.test.ts`
- `apps/backend/tests/integration/**/*.test.ts`
- `apps/mobile/__tests__/components/**/*.test.tsx`
- `apps/mobile/__tests__/e2e/**/*.e2e.ts`
- `tests/load/k6-script.js` (load testing)

**Testing Checklist:**

- [ ] Backend: `pnpm test` → All tests pass, coverage >80%
- [ ] Mobile: `pnpm test` → All component tests pass
- [ ] E2E: Onboarding flow completes without errors
- [ ] E2E: Transaction flow works (add customer → transaction → balance updates)
- [ ] E2E: Offline sync works (create offline → go online → syncs)
- [ ] Load test: 100 users → API stable, P95 <200ms
- [ ] No memory leaks (check with profiler)

---

#### Task 13.1B: Verify All Endpoints Implemented (3 hours)

**Inputs:**

- API_SPEC.md (all 72 endpoints)
- Implemented backend modules

**Actions:**

1. Create endpoint verification checklist (all 72 endpoints)
2. Test each endpoint with Postman/Thunder Client
3. Verify request/response matches API_SPEC.md
4. Document any deviations
5. Create automated API test suite

**Outputs:**

- `docs/ENDPOINT_VERIFICATION.md` (checklist)
- `tests/api/all-endpoints.test.ts` (automated tests)

**Testing Checklist:**

- [ ] All 72 endpoints return expected status codes
- [ ] All request bodies validate correctly (Zod)
- [ ] All response formats match API_SPEC.md
- [ ] All error codes work as specified
- [ ] Rate limiting enforced on protected endpoints

---

#### Task 13.1C: Verify All Screens Built (2 hours)

**Inputs:**

- SCREEN_SPEC.md (all 18 screens)
- Implemented mobile screens

**Actions:**

1. Navigate through all 18 screens
2. Verify layout matches SCREEN_SPEC.md
3. Check all components present
4. Verify colors match design system
5. Verify spacing follows 8px grid
6. Take screenshots for documentation

**Outputs:**

- `docs/SCREEN_VERIFICATION.md` (checklist with screenshots)

**Testing Checklist:**

- [ ] All 18 screens accessible via navigation
- [ ] Layouts match specifications
- [ ] Colors match UI_SCREENS.md (#E53935 red, #1FAF38 green, #2C60E4 blue)
- [ ] Spacing follows design system
- [ ] All user actions work as specified

---

#### Task 13.2: Error Handling & User Experience Polish (6 hours)

**Inputs:**

- SCREEN_SPEC.md Screen 16 (Error states)
- All implemented screens

**Actions:**

1. Build Screen 16: Error/404 page (all variants):
   - 404 Not Found
   - Network Error (offline)
   - Server Error (500)
   - Permission Error (403)
   - Session Expired (401)
2. Global error boundary (catches React errors)
3. API error interceptor:
   - 401 → Auto refresh token → Retry request
   - 429 → Show rate limit message with retry time
   - 5xx → Log to Sentry → Show generic error
4. Validation error display (inline, red text)
5. Toast notification system:
   - Success toasts (green)
   - Error toasts (red)
   - Info toasts (blue)
   - Warning toasts (orange)
6. Loading states for all screens:
   - Skeleton loaders
   - Button spinners
   - Full screen spinners
7. Empty states for all lists

**Outputs:**

- `screens/ErrorScreen.tsx`
- `components/ErrorBoundary.tsx`
- `services/api/interceptors.ts`
- `components/ui/Toast.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/EmptyState.tsx` (Component 9)
- `components/ui/Loading.tsx` (Component 10)

**Testing Checklist:**

- [ ] Navigate to invalid route → 404 error page appears
- [ ] Go offline → Network error page with "Try Again" button
- [ ] Server returns 500 → Error page with auto-retry countdown
- [ ] React component throws error → Error boundary catches → Shows error UI
- [ ] 401 error → Token refreshes automatically → Request retries → Succeeds
- [ ] Rate limit (429) → Toast: "Too many requests. Try again in 5 minutes"
- [ ] Form validation fails → Inline errors below fields (red text)
- [ ] Create transaction → Success toast appears → Auto-dismisses after 3s
- [ ] API call in progress → Loading spinner visible
- [ ] Empty customer list → Empty state: "No Customers Yet" with Add button

---

#### Task 13.3: Performance Optimization (6 hours)

**Inputs:**

- CLAUDE.md (performance guidelines)
- All implemented features

**Actions:**

1. Backend optimizations:
   - Add Redis caching for frequently-accessed data
   - Review all database queries (ensure indexes used)
   - Add database query logging (slow query detection)
   - Compression middleware (gzip)
   - Connection pooling (Prisma config)
2. Mobile optimizations:
   - Replace FlatList with FlashList (high-performance lists)
   - Add React.memo to expensive components (CustomerListItem, TransactionListItem)
   - Image optimization (Cloudinary transformations)
   - Lazy load heavy screens (React.lazy)
   - Debounce search inputs (300ms)
   - Virtualized lists for long data
3. Bundle size optimization:
   - Code splitting
   - Remove unused dependencies
   - Analyze bundle (react-native-bundle-visualizer)

**Outputs:**

- Updated backend middleware (compression, caching)
- Updated mobile components (FlashList, React.memo)
- `utils/debounce.ts`

**Testing Checklist:**

- [ ] API response times: P50 <100ms, P95 <200ms, P99 <500ms
- [ ] Dashboard loads in <1s (from cold start)
- [ ] Customer list scrolls smoothly (60fps, test with 500+ customers)
- [ ] Search input debounced (doesn't call API on every keystroke)
- [ ] Images load quickly (Cloudinary auto-optimizes)
- [ ] App bundle size <30MB (check in Xcode/Android Studio)
- [ ] Memory usage stable (no leaks, test with profiler)
- [ ] Database connections don't exceed pool limit

---

#### Task 13.4A: Security - Headers & CORS (4 hours)

**Inputs:**

- CLAUDE.md security guidelines

**Actions:**

1. Install and configure Helmet middleware
2. Set security headers (CSP, HSTS, X-Frame-Options)
3. Configure CORS properly (restrict to mobile app origins)
4. Test CORS from unauthorized origin

**Outputs:**

- Updated `app.ts` with Helmet and CORS
- `config/cors.config.ts`

**Testing Checklist:**

- [ ] Response headers include Helmet security headers
- [ ] CORS blocks unauthorized origins
- [ ] CORS allows mobile app requests

---

#### Task 13.4B: Security - Rate Limiting (3 hours)

**Inputs:**

- API_SPEC.md rate limiting requirements

**Actions:**

1. Implement rate limiting for all endpoints
2. Global: 100 requests per 15 min
3. OTP specific: 5 per hour
4. Store counters in Redis (Upstash)

**Outputs:**

- Enhanced `middleware/rateLimit.middleware.ts`

**Testing Checklist:**

- [ ] 101st request in 15 min returns 429
- [ ] 6th OTP request in hour returns 429
- [ ] Rate limit headers present

---

#### Task 13.4C: Security - Input Sanitization (3 hours)

**Inputs:**

- CLAUDE.md XSS prevention

**Actions:**

1. Audit all user inputs
2. Add sanitization middleware
3. Verify Zod validation everywhere
4. Test XSS prevention

**Outputs:**

- `middleware/sanitize.middleware.ts`
- `utils/sanitize.ts`

**Testing Checklist:**

- [ ] XSS attempt blocked
- [ ] All inputs validated with Zod
- [ ] No raw user input in responses

---

#### Task 13.4D: Security Audit & Penetration Testing (4 hours)

**Inputs:**

- Complete application

**Actions:**

1. Run `pnpm audit` → Fix vulnerabilities
2. OWASP Top 10 checklist
3. SQL injection testing (Prisma should prevent)
4. Auth bypass attempts
5. Session hijacking tests

**Outputs:**

- Security audit report
- Fixed vulnerabilities

**Testing Checklist:**

- [ ] No high/critical npm vulnerabilities
- [ ] SQL injection blocked
- [ ] Auth cannot be bypassed
- [ ] Sessions cannot be hijacked

---

#### Task 13.5: Production Environment Setup (5 hours)

**Inputs:**

- CLAUDE.md (security guidelines)
- All API endpoints

**Actions:**

1. Enable Helmet (security headers):
   - Content Security Policy
   - HSTS
   - X-Frame-Options
   - X-Content-Type-Options
2. CORS configuration (restrict to mobile app origins only)
3. Rate limiting on all endpoints:
   - Global: 100 req / 15 min per user
   - Auth: Specific limits per endpoint
4. Input sanitization:
   - HTML sanitization (DOMPurify) - though API is JSON-only
   - SQL injection prevention (Prisma handles, but verify)
   - XSS prevention (validate/escape user input)
5. Secrets audit:
   - No API keys in code (all in .env)
   - .env not in git (verify)
   - Rotate test secrets
6. Dependency audit:
   - `pnpm audit` → Fix vulnerabilities
   - Update vulnerable packages
7. SSL/TLS enforcement (HTTPS only)

**Outputs:**

- Updated `app.ts` (Helmet, CORS, security middleware)
- `middleware/sanitize.middleware.ts`
- `utils/sanitize.ts`
- Security audit checklist

**Testing Checklist:**

- [ ] Response headers include security headers (X-Frame-Options, CSP, HSTS)
- [ ] CORS: Request from unauthorized origin → 403 blocked
- [ ] Rate limiting works (101st request in 15 min → 429)
- [ ] XSS attempt in input → Sanitized (e.g., `<script>alert(1)</script>` → escaped)
- [ ] SQL injection attempt → Blocked (Prisma parameterizes)
- [ ] `pnpm audit` → No high/critical vulnerabilities
- [ ] No secrets in git history (check with git log --all --full-history)
- [ ] Production: HTTP requests redirect to HTTPS

---

#### Task 13.5: Production Deployment (6 hours)

**Inputs:**

- TECH_STACK.md (deployment strategy)
- Task 0.4 (CI/CD pipeline)

**Actions:**

1. Configure Railway deployment:
   - Connect GitHub repo
   - Set production environment variables
   - Configure health check endpoint
   - Setup auto-deploy on main branch
2. Run database migrations in production:
   - `railway run pnpm prisma migrate deploy`
3. Configure monitoring:
   - Sentry for error tracking (backend + mobile)
   - PostHog for analytics (optional)
   - Uptime monitoring (UptimeRobot or Railway built-in)
4. Performance monitoring:
   - API response times
   - Error rates
   - Database query performance
5. Setup alerts:
   - Email/Slack on errors >1%
   - Alert on API downtime >2 min
6. Create deployment runbook:
   - Pre-deployment checklist
   - Rollback procedure
   - Smoke test script

**Outputs:**

- `railway.json` (Railway configuration)
- Production environment variables in Railway
- `docs/DEPLOYMENT.md` (runbook)
- Monitoring dashboards (Sentry, Railway)

**Testing Checklist:**

- [ ] Deploy to staging: `git push origin staging`
- [ ] Railway auto-deploys → Health check passes
- [ ] Smoke test: Call all critical endpoints → All return 200
- [ ] Check logs (Railway dashboard) → No errors
- [ ] Deploy to production: `git push origin main`
- [ ] Production health check: GET https://api.khatabook.com/health → 200 OK
- [ ] Create test transaction via mobile (connected to prod API) → Works
- [ ] Sentry receives error events (test by triggering error)
- [ ] Monitoring dashboard shows metrics (requests/min, errors, latency)

---

#### Task 13.6: Environment & Secrets Management (4 hours)

**Inputs:**

- CLAUDE.md environment variables
- All service credentials

**Actions:**

1. Document all environment variables
2. Create .env.example for all environments
3. Setup secrets in Railway (production)
4. Configure mobile environment variables
5. Secrets rotation plan

**Outputs:**

- `.env.example` (complete template)
- `docs/ENVIRONMENT_SETUP.md`
- Railway environment vars configured

**Testing Checklist:**

- [ ] All required env vars documented
- [ ] Production env vars set in Railway
- [ ] Mobile .env connects to correct API
- [ ] No secrets in git history

---

#### Task 13.7: Production Database Migration (3 hours)

**Inputs:**

- All Prisma migrations
- Production database (Supabase)

**Actions:**

1. Backup production database
2. Run `railway run pnpm prisma migrate deploy`
3. Verify all tables created
4. Run seed script (if needed)
5. Test database connectivity

**Outputs:**

- Production database migrated
- Migration log

**Testing Checklist:**

- [ ] All 15 tables exist in production
- [ ] Foreign keys working
- [ ] Indexes created
- [ ] Can connect from Railway app

---

#### Task 13.8: Monitoring Dashboard Setup (4 hours)

**Inputs:**

- Task 13.5 (deployment)

**Actions:**

1. Configure Railway monitoring
2. Setup UptimeRobot (external monitoring)
3. Configure Sentry alerts
4. Create health check dashboard
5. Setup Slack/email notifications

**Outputs:**

- Monitoring dashboards configured
- Alert rules set

**Testing Checklist:**

- [ ] Health check monitored (alerts on downtime)
- [ ] Sentry alerts on error rate >1%
- [ ] Notifications received (test)

---

#### Task 13.9: iOS App Store Submission (6 hours)

**Inputs:**

- Complete mobile app
- SCREEN_SPEC.md

**Actions:**

1. Create app icons (all iOS sizes)
2. Create splash screen
3. Take screenshots (6.5" and 5.5" displays)
4. Write app description and keywords
5. Create App Store Connect listing
6. Build production IPA
7. Upload to TestFlight
8. Submit for review

**Outputs:**

- iOS app icons
- App Store screenshots
- App Store listing
- Production IPA

**Testing Checklist:**

- [ ] TestFlight build installs successfully
- [ ] All features work on real iPhone
- [ ] Screenshots look professional
- [ ] App description complete
- [ ] Submitted for review

---

#### Task 13.10: Android Play Store Submission (6 hours)

**Inputs:**

- Complete mobile app

**Actions:**

1. Create app icons (all Android sizes)
2. Create splash screen
3. Take screenshots (phone and tablet)
4. Write Play Store description
5. Build production AAB
6. Create Play Console listing
7. Upload to Internal Testing
8. Submit for review

**Outputs:**

- Android app icons
- Play Store screenshots
- Play Store listing
- Production AAB

**Testing Checklist:**

- [ ] Internal testing build installs
- [ ] All features work on real Android device
- [ ] Screenshots professional
- [ ] Submitted for review

---

#### Task 13.11: Launch Preparation & Rollback Plan (3 hours)

**Inputs:**

- Complete deployed app

**Actions:**

1. Create launch checklist
2. Create rollback procedure
3. Prepare support documentation
4. Setup customer support system
5. Create incident response plan

**Outputs:**

- `docs/LAUNCH_CHECKLIST.md`
- `docs/ROLLBACK_PROCEDURE.md`
- `docs/SUPPORT_GUIDE.md`

**Testing Checklist:**

- [ ] Can rollback to previous version
- [ ] Support team trained
- [ ] Incident plan documented

---

#### Task 13.12: End-to-End P0 Feature Validation (6 hours)

**Inputs:**

- Complete P0 features
- PRD P0 feature list

**Actions:**

1. Test complete user journey:
   - Onboarding → Login → Create Khatabook
   - Add Customer → Add Transaction → Check Balance
   - Send Reminder → Generate Report
2. Verify all P0 acceptance criteria met
3. User acceptance testing (internal team)
4. Document any remaining bugs

**Outputs:**

- `docs/P0_VALIDATION_REPORT.md`
- Bug list (if any)

**Testing Checklist:**

- [ ] Can complete full onboarding flow
- [ ] Can add customer and record transactions
- [ ] Balance calculates correctly
- [ ] Can send WhatsApp reminder
- [ ] Can generate and download report
- [ ] Works offline (create transaction → sync when online)
- [ ] All P0 features working end-to-end

---

#### Task 13.13: Performance Benchmarking (4 hours)

**Inputs:**

- Task 13.3 (optimization complete)

**Actions:**

1. API performance testing:
   - Measure P50, P95, P99 response times
   - Load test (100 concurrent users)
   - Database query performance
2. Mobile performance testing:
   - App launch time
   - Screen navigation speed
   - List scroll performance (FlashList)
   - Memory usage profiling
3. Document results vs targets

**Outputs:**

- `docs/PERFORMANCE_BENCHMARKS.md`

**Testing Checklist:**

- [ ] API P95 <200ms (target met)
- [ ] App launches in <2s
- [ ] Lists scroll at 60fps
- [ ] No memory leaks

---

#### Task 13.14: Accessibility Audit (3 hours)

**Inputs:**

- SCREEN_SPEC.md (touch targets, contrast requirements)
- Complete mobile app

**Actions:**

1. Screen reader testing (iOS VoiceOver, Android TalkBack)
2. Color contrast verification (WCAG AA minimum)
3. Touch target verification (44x44 dp minimum)
4. Text scaling support
5. Fix accessibility issues

**Outputs:**

- `docs/ACCESSIBILITY_AUDIT.md`
- Accessibility fixes

**Testing Checklist:**

- [ ] All interactive elements have labels
- [ ] Color contrast ratio >4.5:1
- [ ] All touch targets >44x44 dp
- [ ] Works with text size 200%
- [ ] Screen reader announces all elements

---

#### Task 13.15: Code Review & Refactoring (5 hours)

**Inputs:**

- All implemented code

**Actions:**

1. Code review all modules against CLAUDE.md conventions
2. Refactor code smells
3. Remove unused code
4. Consistent error handling
5. Documentation (JSDoc comments)

**Outputs:**

- Cleaned codebase
- Code review checklist completed

**Testing Checklist:**

- [ ] All code follows CLAUDE.md conventions
- [ ] No unused imports/variables
- [ ] Consistent naming (camelCase, PascalCase, snake_case)
- [ ] All functions documented
- [ ] ESLint passes with no warnings

---

#### Task 13.16: Production Smoke Testing (4 hours)

**Inputs:**

- Deployed production app
- Task 13.5 (production deployment)

**Actions:**

1. Deploy to production staging environment
2. Run smoke test suite:
   - Health check
   - Auth flow
   - Create customer
   - Create transaction
   - Generate invoice
   - Send reminder
3. Load testing on production
4. Monitor for errors (Sentry)
5. Fix critical issues

**Outputs:**

- `tests/smoke/production.test.ts`
- Production readiness report

**Testing Checklist:**

- [ ] All smoke tests pass on production
- [ ] No errors in Sentry
- [ ] Performance metrics acceptable
- [ ] Ready for launch

---

#### Task 13.17: Post-Launch Monitoring Setup (3 hours)

**Inputs:**

- Launched application

**Actions:**

1. Configure production monitoring:
   - Error tracking (Sentry)
   - Analytics (PostHog - optional)
   - Performance monitoring
   - User feedback system
2. Setup on-call rotation
3. Create incident response playbook

**Outputs:**

- Monitoring dashboards
- `docs/ON_CALL_GUIDE.md`
- `docs/INCIDENT_RESPONSE.md`

**Testing Checklist:**

- [ ] Dashboards show live data
- [ ] Alerts trigger correctly
- [ ] Team knows incident response process

---

#### Task 13.18: Final Integration Validation (4 hours)

**Inputs:**

- All completed features (P0 + P1)
- All specification documents

**Actions:**

1. Verify against PRD: All P0 features implemented
2. Verify against API_SPEC: All 72 endpoints working
3. Verify against SCREEN_SPEC: All 18 screens built
4. Verify against DATABASE_SCHEMA: All 15 tables used correctly
5. Verify against TECH_STACK: All technologies integrated
6. Create final compliance report

**Outputs:**

- `docs/FINAL_COMPLIANCE_REPORT.md`

**Testing Checklist:**

- [ ] All PRD P0 features checked off
- [ ] All API endpoints verified working
- [ ] All screens match specifications
- [ ] Database schema matches implementation
- [ ] No deviations from specifications

---

#### Task 13.19: App Store Launch & Marketing (4 hours)

**Inputs:**

- Approved app store submissions

**Actions:**

1. Schedule launch date
2. Prepare marketing materials
3. App store optimization (ASO)
4. Launch day monitoring
5. User feedback collection

**Outputs:**

- Launch plan
- Marketing assets
- Feedback forms

**Testing Checklist:**

- [ ] Apps live on both stores
- [ ] No critical bugs reported
- [ ] Monitoring shows healthy metrics
- [ ] User feedback tracked

---

#### Task 13.19: Mobile App Store Preparation (8 hours)

**Inputs:**

- SCREEN_SPEC.md (complete app)
- All mobile features implemented

**Actions:**

1. Create app icons (all required sizes):
   - iOS: 20@2x, 20@3x, 29@2x, 29@3x, 40@2x, 40@3x, 60@2x, 60@3x, 1024×1024
   - Android: mipmap hdpi/mdpi/xhdpi/xxhdpi/xxxhdpi
2. Create splash screen (iOS + Android)
3. App store screenshots:
   - Take screenshots of all key screens (5-6 per platform)
   - Dashboard, Customer Detail, Transaction Entry, Invoice Preview, Reports
4. App store metadata:
   - App name (your branding, not "Khatabook")
   - Description (highlight features)
   - Keywords
   - Category: Business, Finance
   - Privacy policy URL
   - Support URL
5. Build production APK/IPA:
   - Android: `./gradlew bundleRelease` (AAB for Play Store)
   - iOS: Archive in Xcode
6. Test on real devices (iOS + Android)
7. Submit for review (App Store Connect, Play Console)

**Outputs:**

- App icons (all sizes)
- Splash screens
- Screenshots (6 per platform)
- `docs/APP_STORE_LISTING.md` (descriptions, keywords)
- `docs/PRIVACY_POLICY.md`
- `docs/TERMS_OF_SERVICE.md`
- Production builds (APK, IPA)

**Testing Checklist:**

- [ ] App installs on real iPhone → No crashes
- [ ] App installs on real Android → No crashes
- [ ] All features work on real devices
- [ ] Splash screen shows on launch
- [ ] App icons appear correctly (home screen, settings, etc.)
- [ ] No debug/development code in production build
- [ ] App size: iOS <50MB, Android <30MB (initial download)
- [ ] Privacy policy accessible from app (Settings → Terms & Privacy)
- [ ] App Store submission: No rejections, passes review guidelines

---

## 5. Timeline & Resources

### Timeline Overview

| Week  | Phase(s) | Deliverable         | Demo-able Feature              |
| ----- | -------- | ------------------- | ------------------------------ |
| 1     | 0, 1     | Setup + Database    | Project initialized, DB ready  |
| 2     | 2, 3     | Auth + Khatabooks   | Can log in, create ledger      |
| 3     | 4        | Customers           | Can add/manage customers       |
| 4-5   | 5        | Transactions + Sync | Can record transactions (CORE) |
| 6     | 6        | Reminders           | Can send payment reminders     |
| 7     | 7        | Reports             | Can generate reports, PDFs     |
| 8     | 8        | Invoices (P1)       | Can create GST invoices        |
| 9     | 9        | Inventory (P2)      | Can track stock                |
| 10    | 10       | Dashboard Complete  | Analytics charts working       |
| 11    | 11       | Settings + i18n     | Multi-language support         |
| 11-12 | 12       | Payments (P1)       | Can collect payments           |
| 12-13 | 13       | Testing + Deploy    | Production launch              |

**Total Duration:** 12-13 weeks

### Resource Requirements

**Team:**

- 1-2 Full-stack developers (Node.js + React Native)
- OR 1 Backend + 1 Mobile developer (parallel work possible)

**Time per Task:**

- Average: 5-6 hours
- Range: 4-8 hours
- Total: ~90 tasks × 5.5 hours = 495 hours
- Calendar time: 12-13 weeks (accounting for meetings, breaks, debugging)

**Infrastructure:**

- Supabase (PostgreSQL): $25/month
- Upstash (Redis): $10/month
- Railway (backend hosting): $5-20/month
- Cloudflare R2 (file storage): Free tier
- Cloudinary (images): Free tier
- Total: ~$40-60/month during development

---

## 6. Success Criteria

### Phase Completion Criteria

**Each phase is "done" when:**

- ✅ All tasks in phase completed
- ✅ All features work end-to-end (can demo to user)
- ✅ All tests pass (unit + integration + E2E where applicable)
- ✅ Code reviewed (if team >1) or self-reviewed against CLAUDE.md
- ✅ Documentation updated (if API contracts changed)
- ✅ No critical bugs (P0 bugs block phase completion)

### Final Launch Criteria (Phase 13 Complete)

**Must Have (Go/No-Go):**

- ✅ All P0 features working
- ✅ Test coverage >80%
- ✅ No P0 or P1 critical bugs
- ✅ API P95 response time <200ms
- ✅ Mobile app crash-free rate >99%
- ✅ Security audit passed (no high/critical vulnerabilities)
- ✅ Backend deployed to production (Railway)
- ✅ Mobile apps submitted to App Store + Play Store

**Nice to Have (Can launch without):**

- P2 features (inventory, multi-language beyond English+Hindi)
- Advanced analytics
- Dark mode
- Bulk operations UI polish

---

## 7. Risk Mitigation

### Technical Risks

**Risk 1: Offline Sync Complexity (High)**

- **Impact:** Core feature, affects all data operations
- **Mitigation:**
  - Allocate extra time in Phase 5 (7 days)
  - Test extensively (multiple devices, poor network)
  - Implement simple conflict resolution first (server_wins)
  - Add manual conflict UI later if needed
- **Fallback:** Ship without offline initially, add in 2.0

**Risk 2: Third-Party API Issues (Medium)**

- **Impact:** Razorpay, MSG91, Twilio dependencies
- **Mitigation:**
  - Have backup providers (Firebase Auth for OTP, alternative SMS)
  - Mock external APIs in tests
  - Graceful degradation (if WhatsApp fails, fallback to SMS)
- **Fallback:** Manual reminder sending (copy message to clipboard)

**Risk 3: Mobile Platform Differences (Medium)**

- **Impact:** iOS vs Android behavior differences
- **Mitigation:**
  - Test on both platforms early (Phase 2)
  - Use React Native Paper (handles platform differences)
  - Avoid platform-specific code where possible
- **Fallback:** Focus on one platform (Android first for India market)

**Risk 4: Performance with Large Datasets (Medium)**

- **Impact:** 1000+ customers, 10,000+ transactions
- **Mitigation:**
  - Implement pagination early (Phase 4)
  - Use indexes (defined in DATABASE_SCHEMA.md)
  - Cache aggressively (Redis)
  - Virtualized lists (FlashList)
- **Fallback:** Limit data (max 500 customers per khatabook)

### Schedule Risks

**Risk 1: Feature Creep (High)**

- **Mitigation:**
  - Strict P0/P1/P2 priority (from PRD)
  - Defer all P2 features to post-launch
  - No new features without PRD update
- **Fallback:** Ship P0 only (8 weeks instead of 13)

**Risk 2: Testing Takes Longer (Medium)**

- **Mitigation:**
  - Write tests alongside features (not at end)
  - Automate tests (CI runs on every commit)
  - Allocate Phase 13 buffer (5 days)
- **Fallback:** Ship with manual testing, add automated tests post-launch

---

## Appendix A: Task Template

**Every task follows this format:**

```markdown
#### Task X.Y: Task Name (Estimated Hours)

**Inputs:**

- Which specs to read (PRD section X, API_SPEC section Y)
- Which files to modify (if any)
- What data/setup is required

**Actions:**

1. Specific step-by-step actions
2. What to build/configure/implement
3. What to test

**Outputs:**

- Files created/modified (with paths)
- What should exist after this task

**Testing Checklist:**

- [ ] Specific test case 1
- [ ] Specific test case 2
- [ ] Acceptance criteria met
```

---

## Appendix B: Related Documents

- **[PRD.md](./docs/superpowers/specs/PRD.md)** - Product requirements
- **[TECH_STACK.md](./docs/superpowers/specs/TECH_STACK.md)** - Technical architecture
- **[DATABASE_SCHEMA.md](./docs/superpowers/specs/DATABASE_SCHEMA.md)** - Database design
- **[API_SPEC.md](./API_SPEC.md)** - API endpoints specification
- **[SCREEN_SPEC.md](./SCREEN_SPEC.md)** - UI/UX screen specifications
- **[CLAUDE.md](./CLAUDE.md)** - Project context and coding conventions

---

## Document Control

| Version | Date       | Author           | Changes                                             |
| ------- | ---------- | ---------------- | --------------------------------------------------- |
| 1.0     | 2026-04-03 | Engineering Team | Initial implementation plan - complete and approved |

---

**END OF DOCUMENT**

_This Implementation Plan provides a complete roadmap from project setup to production deployment. Each task is sized for one Claude Code session (4-8 hours) with clear inputs, outputs, and testing criteria. Follow the phases sequentially for systematic, validated progress._
