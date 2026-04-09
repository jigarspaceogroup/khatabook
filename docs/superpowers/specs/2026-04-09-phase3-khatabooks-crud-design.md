# Phase 3: Khatabooks CRUD - Design Specification

**Date:** 2026-04-09
**Status:** Approved
**Phase:** 3 of 13
**Dependencies:** Phase 2 (Authentication) complete

---

## Overview

Implement complete Khatabooks management system allowing users to create and manage multiple ledger books. Each khatabook acts as a separate business ledger with its own customers, transactions, and financial data. This phase includes backend APIs for CRUD operations and mobile screens for creating the first khatabook and viewing the dashboard.

## Requirements

**Source Documents:**
- IMPLEMENTATION_PLAN.md Phase 3 (Tasks 3.1-3.3)
- API_SPEC.md Section 4: Khatabooks Management (lines 574-881)
- UI_SCREENS.md Screens 4-5 (Create Khatabook, Dashboard)
- DATABASE_SCHEMA.md (khatabooks, invoice_settings tables)

**Backend (Task 3.1) - Per API_SPEC.md:**
- GET /khatabooks - List with stats (total_customers, total_receivable, total_payable, net_balance)
- POST /khatabooks - Create with business_name, business_type (enum: retail/wholesale/services/other)
- GET /khatabooks/:id - Detailed stats including top_defaulters, total_transactions, etc.
- PUT /khatabooks/:id - Update name, business_name, business_type, is_default
- DELETE /khatabooks/:id - Soft delete with cascade (customers, transactions, invoices)
- GET/PUT /khatabooks/:id/invoice-settings - GSTIN, logo, bank details, T&C
- Ownership validation middleware (403 if user doesn't own khatabook)
- Default khatabook logic (ensure only one is_default per user)
- Stats aggregation from customers table (real-time calculation)

**Mobile (Tasks 3.2, 3.3):**
- Screen 4: Create First Khatabook (onboarding)
- Screen 5: Dashboard with summary cards and customer list
- Khatabook switcher modal (P1 - for multiple khatabooks)
- Redux integration for active khatabook state

## Architecture

### Backend Module Structure

```
src/modules/khatabooks/
├── khatabook.controller.ts    # HTTP handlers
├── khatabook.service.ts        # Business logic
├── khatabook.routes.ts         # Express routes
├── khatabook.validators.ts     # Zod schemas
├── khatabook.types.ts          # TypeScript interfaces
└── invoice-settings.controller.ts  # Invoice settings sub-resource
```

### Mobile Component Structure

```
src/
├── screens/
│   ├── onboarding/
│   │   └── CreateKhatabookScreen.tsx
│   └── home/
│       └── DashboardScreen.tsx (updated)
├── components/
│   ├── ui/
│   │   ├── SummaryCard.tsx         # Financial summary component
│   │   └── FAB.tsx                  # Floating action button
│   └── khatabooks/
│       └── KhatabookSwitcherModal.tsx
└── store/
    ├── slices/
    │   └── khatabookSlice.ts       # Active khatabook state
    └── api/
        └── khatabookApi.ts         # RTK Query endpoints
```

### Data Flow

1. **Onboarding:** ProfileSetup → CreateKhatabook → Dashboard
2. **Active Khatabook:** Stored in Redux (khatabookSlice.activeKhatabookId)
3. **Dashboard Data:** Fetch khatabook stats + customers list
4. **Switching:** Change activeKhatabookId → Refetch dashboard data

---

## Backend Implementation Details

### Khatabook Service Logic

**Stats Calculation:**
```typescript
// Aggregate from customers table
{
  total_customers: count(customers where deleted_at IS NULL),
  total_receivable: sum(customers.current_balance where balance > 0),
  total_payable: sum(abs(customers.current_balance) where balance < 0),
  net_balance: total_receivable - total_payable
}
```

**Default Khatabook Logic:**
- When creating first khatabook → Automatically set is_default=true
- When creating additional → is_default=false (user can change via PUT)
- When changing default → Old default becomes false, new becomes true
- Cannot delete if is_default=true AND it's the only khatabook

**Soft Delete Cascading:**
- DELETE /khatabooks/:id sets deleted_at
- Also sets deleted_at on: customers, transactions, invoices, inventory_items
- Uses Prisma updateMany in transaction

**Ownership Middleware:**
```typescript
// Ensures user owns the khatabook being accessed
middleware.ownership.khatabook(req.params.id, req.user.id)
```

### API Endpoints Specification (Per API_SPEC.md Section 4)

**GET /khatabooks** (API_SPEC.md lines 582-630)
- Query params: limit?, cursor? (pagination)
- Response: Array of khatabooks with stats object per khatabook
- Stats includes: total_customers, total_receivable, total_payable, net_balance
- Filters: deleted_at IS NULL automatically
- Ordered by: is_default DESC, created_at DESC
- Returns pagination: { next_cursor, has_more }

**POST /khatabooks** (API_SPEC.md lines 633-685)
- Body: { name (required), business_name?, business_type?, is_default?, currency_code? }
- Validation: name required (max 255 chars), business_type enum validation
- Business type enum: 'retail' | 'wholesale' | 'services' | 'other'
- Logic: Auto-set is_default=true if user's first khatabook
- Response: 201 Created with khatabook object + stats (all zeros initially)
- Error 409: If khatabook name already exists for user

**GET /khatabooks/:id** (API_SPEC.md lines 688-730)
- Response: Khatabook with detailed stats
- Detailed stats include: total_transactions, total_invoices, transactions_this_month, top_defaulters[]
- top_defaulters: Top 5 customers by balance (customer_id, customer_name, balance)
- Stats calculated fresh from database (not cached)

**PUT /khatabooks/:id** (API_SPEC.md lines 733-762)
- Body: { name?, business_name?, business_type?, is_default? }
- Validation: Ownership check (403 if not owner)
- Logic: If is_default changes to true, set other khatabooks to false (only one default per user)
- Error 409: If new name conflicts with existing khatabook

**DELETE /khatabooks/:id** (API_SPEC.md lines 765-793)
- Validation: Cannot delete if is_default=true (must set another as default first)
- Logic: Soft delete (set deleted_at) + cascade to customers, transactions, invoices
- Response: { id, deleted: true, deleted_at, cascade_deleted: { customers: N, transactions: N, invoices: N } }
- Error 403: Cannot delete default khatabook

**GET /khatabooks/:id/invoice-settings** (API_SPEC.md lines 796-838)
- Response: Invoice settings object (business details, GSTIN, logo, terms, bank_details JSONB)
- Returns defaults if not configured yet

**PUT /khatabooks/:id/invoice-settings** (API_SPEC.md lines 840-879)
- Body: business_name?, business_address?, business_phone?, business_email?, gstin?, logo_url?, invoice_prefix?, next_invoice_number?, terms_and_conditions?, bank_details?
- Validation: GSTIN format validation (15 chars)
- Logic: Creates invoice_settings row if doesn't exist, updates if exists (upsert)
- bank_details is JSONB: { account_name?, account_number?, ifsc?, bank_name?, branch? }

---

## Mobile Implementation Details

### Screen 4: Create First Khatabook

**Purpose:** Onboarding step after profile setup

**Layout (per UI_SCREENS.md lines 1290-1361):**
- Icon illustration (64x64 dp, khatabook icon)
- Title: "Create Your First Khata Book"
- Subtitle: "Start managing your business transactions digitally"
- Input: Khatabook name (pre-filled from business name or "My Business Khata")
- Info text: "💡 You can create more khatabooks later..."
- Button: "Create Khatabook"

**Flow:**
1. Pre-fill name from ProfileSetupScreen route params (businessName)
2. User can edit or use default
3. Tap Create → POST /khatabooks
4. On success → Navigate to Dashboard (reset navigation)
5. Created khatabook auto-set as active in Redux

**Validation:**
- Name required (pre-filled, so always valid)
- Max 255 characters
- Trim whitespace

### Screen 5: Dashboard (Initial Structure)

**Purpose:** Main home screen with financial summary

**Layout (per UI_SCREENS.md lines 1367-1567):**
- Top bar: Hamburger, khatabook name, search icon
- Summary Cards × 3:
  - YOU'LL GET ↑ (total receivable, red)
  - YOU'LL GIVE ↓ (total payable, green)
  - NET BALANCE (net, black)
- Section header: "Customers (45)" with sort dropdown
- Customer list: Empty state initially (Phase 4 will populate)
- FAB: Bottom-right (+) button
- Bottom navigation: Home tab active

**API Integration:**
- On mount: GET /khatabooks/:id (get stats)
- Stats update Redux khatabook slice
- Empty state for customers (Phase 4 adds customer list)

**Summary Card Component:**
```typescript
<SummaryCard
  label="YOU'LL GET ↑"
  amount={125000}
  type="receivable"
/>
```

### Redux State Management

**khatabookSlice.ts:**
```typescript
{
  activeKhatabookId: string | null,
  khatabooks: Khatabook[],
  currentStats: {
    total_customers: number,
    total_receivable: number,
    total_payable: number,
    net_balance: number
  }
}
```

**Actions:**
- setActiveKhatabook(id)
- addKhatabook(khatabook)
- updateKhatabookStats(stats)
- removeKhatabook(id)

### Khatabook Switcher Modal (P1 - Optional for Phase 3)

**Purpose:** Switch between multiple khatabooks

**Layout:**
- List of user's khatabooks
- Show name + net balance per khatabook
- Highlight active khatabook (blue background)
- "+ Create New Khatabook" button

**Trigger:** Tap hamburger menu or khatabook name in top bar

**Note:** Can be implemented in Phase 3 or deferred if time-constrained

---

## Component Library

### SummaryCard Component

**File:** `src/components/ui/SummaryCard.tsx`

**Props:**
```typescript
interface SummaryCardProps {
  label: string;
  amount: number;
  type: 'receivable' | 'payable' | 'net';
  subtitle?: string;
}
```

**Styling (per UI_SCREENS.md Component 1):**
- Background: #FFFFFF
- Padding: 16px
- Border-radius: 8px
- Shadow: Elevation Level 2 (0 2px 6px rgba(0,0,0,0.16))
- Margin-bottom: 12px
- Label: 11px Regular, #757575, uppercase
- Amount: 28px Bold, color based on type:
  - receivable: #FF4444 (red)
  - payable: #00C853 (green)
  - net: #212121 (black)

### FAB Component

**File:** `src/components/ui/FAB.tsx`

**Styling (per UI_SCREENS.md Component 7):**
- Size: 56x56 dp circle
- Background: #2196F3 (primary blue)
- Icon: + (white, 24x24 dp)
- Shadow: Elevation Level 3
- Position: Fixed bottom-right
- Bottom: 72px (above bottom nav)
- Right: 16px

**Behavior:**
- Tap → Opens action sheet (Add Customer / Add Transaction)
- Phase 3: Can be placeholder (console.log for now)
- Phase 4: Will implement actual actions

---

## Testing Strategy

### Backend Tests

**Unit Tests (khatabook.service.ts):**
- Create khatabook (first → is_default=true)
- Create second khatabook (is_default=false)
- Update khatabook name
- Change default khatabook (toggle logic)
- Delete khatabook with validation
- Stats calculation accuracy

**Integration Tests:**
- Full CRUD flow with authentication
- Ownership validation (403 for other user's khatabook)
- Cascade soft delete verification
- Default khatabook constraints

### Mobile Tests

**Manual Testing:**
- Complete onboarding flow → Lands on Dashboard
- Dashboard shows correct stats (initially all ₹0)
- Summary cards display properly with correct colors
- FAB appears in correct position
- Bottom navigation shows Home as active

**Automated Tests:**
- Redux state updates correctly
- API calls include auth token
- Error handling for API failures
- Loading states display properly

---

## Success Criteria

**Backend:**
- [ ] All 7 khatabook endpoints working
- [ ] Stats calculations accurate
- [ ] Ownership validation prevents unauthorized access
- [ ] Soft delete cascades to related entities
- [ ] Default khatabook logic enforced

**Mobile:**
- [ ] Create First Khatabook screen functional
- [ ] Dashboard displays with summary cards
- [ ] Stats fetched from API and displayed
- [ ] Redux manages active khatabook state
- [ ] Navigation flow works end-to-end
- [ ] Empty state shows for customers (Phase 4 will populate)

**Integration:**
- [ ] End-to-end: Profile Setup → Create Khatabook → Dashboard
- [ ] Dashboard shows real data from backend
- [ ] Multiple devices can access same khatabook
- [ ] All Phase 3 tests pass

---

## Out of Scope (Future Phases)

- Customer CRUD (Phase 4)
- Transactions (Phase 5)
- Actual khatabook switching UI (can add in Phase 3 if time permits)
- Invoice settings management (P1)
- Data export (later phase)

---

## Implementation Notes

**Backend:**
- Follow existing auth module patterns
- Use Zod for validation
- Use Prisma for database queries
- Add proper error handling with HTTP status codes
- Include request logging

**Mobile:**
- Follow existing auth screen patterns
- Use RTK Query for API calls
- Use existing theme constants (colors, typography, spacing)
- Implement loading and error states
- Use React Navigation for screen transitions

**Logo Usage:**
- Use Khatabook.svg from src/assets/images/
- Icon size varies by context (100-200px)
- No white backgrounds

**Design Verification:**
- User requested using mobile-mcp to verify screens match Pencil designs
- After implementation, use mobile plugin to navigate and screenshot
- Compare with docs/Pencil/khatabook.pen designs

---

## Risk Mitigation

**Risk:** Stats calculation performance with many customers
- **Mitigation:** Use efficient aggregation queries, add indexes, implement caching (Redis, 5min TTL)

**Risk:** Default khatabook toggle race conditions
- **Mitigation:** Use database transactions, add unique constraint on (user_id, is_default=true)

**Risk:** Soft delete cascading missing entities
- **Mitigation:** Thorough testing, verify all relationships, check with Prisma Studio

**Risk:** Mobile state management complexity with multiple khatabooks
- **Mitigation:** Clear Redux structure, single source of truth (activeKhatabookId)

---

## Timeline Estimate

**Backend:** 5 hours (1 work session)
- Khatabooks CRUD: 3 hours
- Invoice settings: 1 hour
- Tests: 1 hour

**Mobile:** 4 hours (1 work session)
- Create Khatabook screen: 1.5 hours
- Dashboard structure: 1.5 hours
- Summary Card component: 0.5 hour
- Redux integration: 0.5 hour

**Total:** ~9 hours (can be split across 2 sessions: backend first, then mobile)
