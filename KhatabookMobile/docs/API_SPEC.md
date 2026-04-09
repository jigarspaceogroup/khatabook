# Khatabook Clone - API Specification Document

**Document Version:** 1.0
**Date:** April 3, 2026
**Author:** Backend Engineering Team
**Status:** Design Approved - Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [API Overview & Standards](#2-api-overview--standards)
3. [Authentication & User Management](#3-authentication--user-management)
4. [Khatabooks Management](#4-khatabooks-management)
5. [Customers Management](#5-customers-management)
6. [Transactions Management](#6-transactions-management)
7. [Invoices Management](#7-invoices-management)
8. [Inventory Management (P2)](#8-inventory-management-p2)
9. [Reports & Dashboard](#9-reports--dashboard)
10. [Reminders & Notifications](#10-reminders--notifications)
11. [Payments (P1)](#11-payments-p1)
12. [Offline Sync](#12-offline-sync)
13. [Utility & System Endpoints](#13-utility--system-endpoints)
14. [Common Patterns & Standards](#14-common-patterns--standards)
15. [Implementation Checklist](#15-implementation-checklist)

---

## 1. Executive Summary

### Purpose

This document provides the complete API specification for the Khatabook Clone backend - a mobile-first ledger management system for Indian small businesses. It defines all endpoints, request/response formats, error handling, and integration patterns needed for implementation.

### Key Decisions Summary

| Decision               | Choice                                | Rationale                                    |
| ---------------------- | ------------------------------------- | -------------------------------------------- |
| **API Style**          | REST (Hybrid routes)                  | Mobile-optimized, simple, widely supported   |
| **Pagination**         | Cursor-based                          | Better performance, no page drift            |
| **Authentication**     | JWT Access + Refresh                  | Industry standard, works offline             |
| **Error Handling**     | Environment-aware                     | Secure in prod, helpful in dev               |
| **Filtering**          | Query parameters                      | Simple, REST-standard, mobile-friendly       |
| **Formats**            | ISO 8601, E.164, numeric              | International standards                      |
| **Route Organization** | Flat resources + nested where natural | Optimized for offline sync + clear ownership |

### Architecture Pattern

**Hybrid Context-Aware Routes:**

- **Flat routes** for frequently-accessed resources (customers, transactions) - reduces URL length and bandwidth
- **Nested routes** for natural hierarchies (customer transactions, khatabook reports)
- **Specialized sync endpoints** for efficient offline synchronization

### API Modules

1. **Auth** - Phone OTP, JWT tokens, user profile
2. **Khatabooks** - Multi-ledger CRUD operations
3. **Customers** - Party management with balance tracking
4. **Transactions** - Credit/debit recording with offline sync
5. **Invoices** - GST-compliant invoice generation
6. **Inventory** - Stock management (P2 feature)
7. **Reports** - Analytics and business insights
8. **Reminders** - WhatsApp/SMS payment reminders
9. **Payments** - Payment gateway integration (P1)
10. **Sync** - Push/pull synchronization with conflict resolution

---

## 2. API Overview & Standards

### Base Configuration

```
Base URL: https://api.khatabook-clone.com/api/v1
Protocol: HTTPS only (TLS 1.3)
Content-Type: application/json
Character Encoding: UTF-8
```

### Authentication Headers

```http
Authorization: Bearer <access_token>
X-Device-ID: <unique_device_identifier>
X-App-Version: 1.0.0
```

### Standard Response Envelope

**Success Response (2xx):**

```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "meta": {
    "timestamp": "2026-04-03T10:30:00.000Z",
    "request_id": "req_abc123"
  }
}
```

**Error Response (4xx, 5xx):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0",
        "code": "MIN_VALUE"
      }
    ],
    "timestamp": "2026-04-03T10:30:00.000Z",
    "path": "/api/v1/transactions",
    "request_id": "req_abc123"
  }
}
```

**Environment-Specific Error Details:**

- **Development:** Includes stack traces, SQL queries, detailed error context
- **Production:** Generic messages, error codes only, sanitized details
- **Validation errors:** Always detailed (safe to expose)

### Format Standards

| Type              | Format             | Example                                  |
| ----------------- | ------------------ | ---------------------------------------- |
| **Timestamps**    | ISO 8601 with UTC  | `"2026-04-03T10:30:00.000Z"`             |
| **Dates**         | ISO 8601 date only | `"2026-04-03"`                           |
| **Currency**      | Decimal number     | `1250.50` (not `"₹1,250.50"`)            |
| **Currency Code** | ISO 4217           | `"INR"`                                  |
| **Phone Numbers** | E.164 format       | `"+919876543210"`                        |
| **UUIDs**         | RFC 4122           | `"550e8400-e29b-41d4-a716-446655440000"` |
| **Boolean**       | Lowercase          | `true`, `false`                          |

### Common Query Parameters

| Parameter | Type    | Description                            | Example                    |
| --------- | ------- | -------------------------------------- | -------------------------- |
| `limit`   | integer | Page size (default: 50, max: 100)      | `?limit=20`                |
| `cursor`  | string  | Pagination cursor (opaque)             | `?cursor=eyJpZCI6Inh5eiJ9` |
| `sort`    | string  | Sort field with direction (`-` = desc) | `?sort=-created_at`        |
| `q`       | string  | Search query                           | `?q=Kumar`                 |

### HTTP Status Codes

| Code  | Meaning               | Usage                                       |
| ----- | --------------------- | ------------------------------------------- |
| `200` | OK                    | Successful GET, PUT, DELETE                 |
| `201` | Created               | Successful POST creating resource           |
| `204` | No Content            | Successful DELETE with no body              |
| `400` | Bad Request           | Validation error, malformed request         |
| `401` | Unauthorized          | Missing or invalid token                    |
| `403` | Forbidden             | Valid token but no permission               |
| `404` | Not Found             | Resource doesn't exist                      |
| `409` | Conflict              | Duplicate resource, business rule violation |
| `422` | Unprocessable Entity  | Valid syntax but business logic error       |
| `429` | Too Many Requests     | Rate limit exceeded                         |
| `500` | Internal Server Error | Server error (logged to Sentry)             |
| `503` | Service Unavailable   | Maintenance mode                            |

---

## 3. Authentication & User Management

### Module Overview

Handles phone-based OTP authentication, token management, and user profile operations.

---

### POST /auth/send-otp

**Description:** Send OTP to phone number for login/signup

**Auth Required:** No

**Request Body:**

```typescript
interface SendOTPRequest {
  phone_number: string; // E.164 format: "+919876543210"
  language_code?: string; // Default: "en", Options: "en", "hi", "ta", etc.
}
```

**Response (200 OK):**

```typescript
interface SendOTPResponse {
  success: true;
  data: {
    phone_number: string;
    otp_sent: boolean;
    expires_at: string; // ISO 8601 timestamp
    retry_after: number; // Seconds until can request new OTP
  };
}
```

**Error Responses:**

- `400` - Invalid phone number format
- `429` - Too many OTP requests (max 5 per hour)

**Example Request:**

```http
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "phone_number": "+919876543210",
  "language_code": "hi"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "phone_number": "+919876543210",
    "otp_sent": true,
    "expires_at": "2026-04-03T10:40:00.000Z",
    "retry_after": 60
  },
  "meta": {
    "timestamp": "2026-04-03T10:30:00.000Z",
    "request_id": "req_abc123"
  }
}
```

---

### POST /auth/verify-otp

**Description:** Verify OTP and get authentication tokens

**Auth Required:** No

**Request Body:**

```typescript
interface VerifyOTPRequest {
  phone_number: string; // E.164 format
  otp: string; // 6-digit code
  device_id: string; // Unique device identifier
  device_type: 'ios' | 'android';
  device_name?: string; // e.g., "iPhone 14 Pro"
}
```

**Response (200 OK):**

```typescript
interface VerifyOTPResponse {
  success: true;
  data: {
    access_token: string; // JWT, expires in 24 hours
    refresh_token: string; // JWT, expires in 30 days
    token_type: 'Bearer';
    expires_in: number; // Access token TTL in seconds (86400)
    user: {
      id: string; // UUID
      phone_number: string;
      name: string | null;
      email: string | null;
      language_code: string;
      profile_image_url: string | null;
      created_at: string; // ISO 8601
    };
    is_new_user: boolean; // true if first login
  };
}
```

**Error Responses:**

- `400` - Invalid OTP format
- `401` - OTP incorrect or expired
- `429` - Too many verification attempts (max 10 per hour)

**Example Request:**

```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone_number": "+919876543210",
  "otp": "123456",
  "device_id": "device_abc123",
  "device_type": "android",
  "device_name": "Samsung Galaxy S23"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone_number": "+919876543210",
      "name": null,
      "email": null,
      "language_code": "hi",
      "profile_image_url": null,
      "created_at": "2026-04-03T10:30:00.000Z"
    },
    "is_new_user": true
  }
}
```

---

### POST /auth/refresh-token

**Description:** Get new access token using refresh token

**Auth Required:** No (uses refresh token)

**Request Body:**

```typescript
interface RefreshTokenRequest {
  refresh_token: string;
  device_id: string;
}
```

**Response (200 OK):**

```typescript
interface RefreshTokenResponse {
  success: true;
  data: {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
  };
}
```

**Error Responses:**

- `401` - Invalid or expired refresh token
- `403` - Refresh token revoked (user logged out)

**Example Request:**

```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "device_id": "device_abc123"
}
```

---

### POST /auth/logout

**Description:** Revoke current session and invalidate tokens

**Auth Required:** Yes

**Request Body:**

```typescript
interface LogoutRequest {
  device_id: string;
  revoke_all_devices?: boolean; // Default: false
}
```

**Response (200 OK):**

```typescript
interface LogoutResponse {
  success: true;
  data: {
    logged_out: boolean;
    devices_revoked: number;
  };
}
```

**Example Request:**

```http
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "device_id": "device_abc123",
  "revoke_all_devices": false
}
```

---

### GET /auth/me

**Description:** Get current authenticated user profile

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetCurrentUserResponse {
  success: true;
  data: {
    id: string;
    phone_number: string;
    phone_verified: boolean;
    name: string | null;
    email: string | null;
    language_code: string;
    profile_image_url: string | null;
    biometric_enabled: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  };
}
```

---

### PUT /auth/me

**Description:** Update current user profile

**Auth Required:** Yes

**Request Body:**

```typescript
interface UpdateProfileRequest {
  name?: string;
  email?: string;
  language_code?: string;
  profile_image_url?: string;
  biometric_enabled?: boolean;
}
```

**Response (200 OK):**

```typescript
// Same as GetCurrentUserResponse
```

**Error Responses:**

- `400` - Invalid email format
- `409` - Email already in use

---

### GET /auth/sessions

**Description:** List all active sessions for current user

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface ListSessionsResponse {
  success: true;
  data: {
    sessions: Array<{
      id: string;
      device_id: string;
      device_type: 'ios' | 'android';
      device_name: string | null;
      ip_address: string | null;
      last_activity_at: string;
      created_at: string;
      is_current: boolean; // True for current session
    }>;
  };
}
```

---

### DELETE /auth/sessions/:id

**Description:** Revoke specific session

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface RevokeSessionResponse {
  success: true;
  data: {
    session_id: string;
    revoked: boolean;
    revoked_at: string;
  };
}
```

**Error Responses:**

- `403` - Cannot revoke another user's session
- `404` - Session not found

---

### DELETE /auth/me

**Description:** Delete user account and all associated data (GDPR compliance)

**Auth Required:** Yes

**Request Body:**

```typescript
interface DeleteAccountRequest {
  confirmation: 'DELETE_MY_ACCOUNT'; // Required safety confirmation
  reason?: string; // Optional deletion reason
}
```

**Response (200 OK):**

```typescript
interface DeleteAccountResponse {
  success: true;
  data: {
    user_id: string;
    deleted: boolean;
    deleted_at: string;
    data_retention_days: 30; // Grace period before permanent deletion
  };
}
```

**Note:** Account enters 30-day grace period. During this time, user can restore account by logging in again.

---

## 4. Khatabooks Management

### Module Overview

Manage multiple ledgers/khatabooks for different business units or personal use.

---

### GET /khatabooks

**Description:** Get all khatabooks for authenticated user

**Auth Required:** Yes

**Query Parameters:**

- `limit` (optional): Page size, default 50
- `cursor` (optional): Pagination cursor

**Response (200 OK):**

```typescript
interface ListKhatabooksResponse {
  success: true;
  data: {
    khatabooks: Array<{
      id: string;
      name: string;
      business_name: string | null;
      business_type: string | null;
      is_default: boolean;
      currency_code: string;
      stats: {
        total_customers: number;
        total_receivable: number; // Sum of positive balances
        total_payable: number; // Sum of negative balances
        net_balance: number; // total_receivable - total_payable
      };
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
    };
  };
}
```

**Example Request:**

```http
GET /api/v1/khatabooks?limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Device-ID: device_abc123
```

---

### POST /khatabooks

**Description:** Create new khatabook

**Auth Required:** Yes

**Request Body:**

```typescript
interface CreateKhatabookRequest {
  name: string; // Required, max 255 chars
  business_name?: string; // Optional
  business_type?: 'retail' | 'wholesale' | 'services' | 'other'; // Validated enum values
  is_default?: boolean; // Default: false
  currency_code?: string; // Default: "INR"
}
```

**Note on business_type:**

- API validates to 4 standard values: `retail`, `wholesale`, `services`, `other`
- Database stores as VARCHAR(100) for future extensibility
- Custom values may be accepted in future API versions

**Response (201 Created):**

```typescript
interface CreateKhatabookResponse {
  success: true;
  data: {
    id: string;
    name: string;
    business_name: string | null;
    business_type: string | null;
    is_default: boolean;
    currency_code: string;
    stats: {
      total_customers: 0;
      total_receivable: 0;
      total_payable: 0;
      net_balance: 0;
    };
    created_at: string;
    updated_at: string;
  };
}
```

**Error Responses:**

- `400` - Validation error (name required, name too long)
- `409` - Khatabook with same name already exists

---

### GET /khatabooks/:id

**Description:** Get khatabook details with full statistics

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetKhatabookResponse {
  success: true;
  data: {
    id: string;
    name: string;
    business_name: string | null;
    business_type: string | null;
    is_default: boolean;
    currency_code: string;
    stats: {
      total_customers: number;
      total_receivable: number;
      total_payable: number;
      net_balance: number;
      total_transactions: number;
      total_invoices: number;
      transactions_this_month: number;
      top_defaulters: Array<{
        customer_id: string;
        customer_name: string;
        balance: number;
      }>;
    };
    created_at: string;
    updated_at: string;
  };
}
```

**Error Responses:**

- `404` - Khatabook not found
- `403` - User doesn't own this khatabook

---

### PUT /khatabooks/:id

**Description:** Update khatabook details

**Auth Required:** Yes

**Request Body:**

```typescript
interface UpdateKhatabookRequest {
  name?: string;
  business_name?: string;
  business_type?: 'retail' | 'wholesale' | 'services' | 'other';
  is_default?: boolean;
}
```

**Response (200 OK):**

```typescript
// Same as GetKhatabookResponse
```

**Error Responses:**

- `400` - Validation error
- `403` - User doesn't own this khatabook
- `404` - Khatabook not found
- `409` - Name already in use

---

### DELETE /khatabooks/:id

**Description:** Soft delete khatabook and all its data (customers, transactions, invoices)

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface DeleteKhatabookResponse {
  success: true;
  data: {
    id: string;
    deleted: boolean;
    deleted_at: string;
    cascade_deleted: {
      customers: number;
      transactions: number;
      invoices: number;
    };
  };
}
```

**Error Responses:**

- `403` - Cannot delete default khatabook (must set another as default first)
- `404` - Khatabook not found

---

### GET /khatabooks/:id/invoice-settings

**Description:** Get invoice settings for khatabook

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetInvoiceSettingsResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    business_name: string | null;
    business_address: string | null;
    business_phone: string | null;
    business_email: string | null;
    gstin: string | null; // GST identification number
    logo_url: string | null;
    invoice_prefix: string; // "INV", "BILL", etc.
    next_invoice_number: number;
    terms_and_conditions: string | null;
    bank_details: {
      // JSONB
      account_name?: string;
      account_number?: string;
      ifsc?: string;
      bank_name?: string;
      branch?: string;
    } | null;
    created_at: string;
    updated_at: string;
  };
}
```

**Error Responses:**

- `404` - Khatabook not found
- `403` - User doesn't own this khatabook

---

### PUT /khatabooks/:id/invoice-settings

**Description:** Update invoice settings for khatabook

**Auth Required:** Yes

**Request Body:**

```typescript
interface UpdateInvoiceSettingsRequest {
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  gstin?: string;
  logo_url?: string;
  invoice_prefix?: string;
  next_invoice_number?: number;
  terms_and_conditions?: string;
  bank_details?: {
    account_name?: string;
    account_number?: string;
    ifsc?: string;
    bank_name?: string;
    branch?: string;
  };
}
```

**Response (200 OK):**

```typescript
// Same as GetInvoiceSettingsResponse
```

**Error Responses:**

- `400` - Validation error (invalid GSTIN format, etc.)
- `403` - User doesn't own this khatabook
- `404` - Khatabook not found

---

## 5. Customers Management

### Module Overview

Manage customers and suppliers (parties) within a khatabook.

---

### GET /customers

**Description:** List all customers in a khatabook with filtering and sorting

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (required): UUID of khatabook
- `limit` (optional): Page size, default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Sort field with direction
  - Options: `name`, `-name`, `balance`, `-balance`, `created_at`, `-created_at`
  - Default: `-balance` (highest balance first)
- `q` (optional): Search by name or phone number
- `balance_gt` (optional): Filter balance greater than
- `balance_lt` (optional): Filter balance less than

**Response (200 OK):**

```typescript
interface ListCustomersResponse {
  success: true;
  data: {
    customers: Array<{
      id: string;
      khatabook_id: string;
      name: string;
      phone_number: string | null;
      email: string | null;
      current_balance: number;
      last_transaction_at: string | null;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
      total_count?: number; // Only on first page
    };
  };
}
```

**Example Request:**

```http
GET /api/v1/customers?khatabook_id=550e8400-e29b-41d4-a716-446655440000&sort=-balance&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### POST /customers

**Description:** Create new customer

**Auth Required:** Yes

**Request Body:**

```typescript
interface CreateCustomerRequest {
  khatabook_id: string; // Required
  name: string; // Required, max 255 chars
  phone_number?: string; // E.164 format
  email?: string;
  address?: string;
  gstin?: string; // 15-char GST number
  opening_balance?: number; // Default: 0.00
  notes?: string;
}
```

**Response (201 Created):**

```typescript
interface CreateCustomerResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    name: string;
    phone_number: string | null;
    email: string | null;
    address: string | null;
    gstin: string | null;
    opening_balance: number;
    current_balance: number; // Same as opening_balance initially
    notes: string | null;
    last_transaction_at: null;
    created_at: string;
    updated_at: string;
  };
}
```

**Error Responses:**

- `400` - Validation error (name required, invalid phone/email format)
- `403` - User doesn't own this khatabook
- `409` - Customer with same phone number already exists in khatabook

---

### GET /customers/:id

**Description:** Get customer details with transaction summary

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetCustomerResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    name: string;
    phone_number: string | null;
    email: string | null;
    address: string | null;
    gstin: string | null;
    opening_balance: number;
    current_balance: number;
    notes: string | null;
    last_transaction_at: string | null;
    created_at: string;
    updated_at: string;
    summary: {
      total_gave: number; // Total credit (you gave)
      total_got: number; // Total debit (you got)
      transaction_count: number;
      last_reminder_sent_at: string | null;
      reminder_count: number;
    };
  };
}
```

**Error Responses:**

- `404` - Customer not found
- `403` - User doesn't own this customer's khatabook

---

### PUT /customers/:id

**Description:** Update customer details

**Auth Required:** Yes

**Request Body:**

```typescript
interface UpdateCustomerRequest {
  name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  gstin?: string;
  notes?: string;
  // Note: opening_balance and current_balance cannot be changed directly
}
```

**Response (200 OK):**

```typescript
// Same as GetCustomerResponse
```

**Error Responses:**

- `400` - Validation error
- `403` - User doesn't own this customer
- `404` - Customer not found
- `409` - Phone number already in use by another customer

---

### DELETE /customers/:id

**Description:** Soft delete customer (only if no transactions exist)

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface DeleteCustomerResponse {
  success: true;
  data: {
    id: string;
    deleted: boolean;
    deleted_at: string;
  };
}
```

**Error Responses:**

- `403` - User doesn't own this customer
- `404` - Customer not found
- `422` - Cannot delete customer with transactions (business rule)

---

### POST /customers/:id/settle

**Description:** Mark customer balance as settled (clear to zero)

**Auth Required:** Yes

**Request Body:**

```typescript
interface SettleCustomerRequest {
  settlement_note?: string; // Optional note about settlement
  settlement_date?: string; // ISO date, default: today
}
```

**Response (200 OK):**

```typescript
interface SettleCustomerResponse {
  success: true;
  data: {
    customer_id: string;
    previous_balance: number;
    settled_amount: number;
    new_balance: 0;
    settlement_transaction_id: string; // Auto-created transaction
    settled_at: string;
  };
}
```

---

## 6. Transactions Management

### Module Overview

Record credit (You Gave) and debit (You Got) transactions with customers.

---

### GET /transactions

**Description:** List transactions with filtering and sorting

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (required): UUID of khatabook
- `customer_id` (optional): Filter by specific customer
- `type` (optional): Filter by type - `GAVE` or `GOT`
- `date_from` (optional): ISO date (inclusive)
- `date_to` (optional): ISO date (inclusive)
- `payment_mode` (optional): `cash`, `upi`, `card`, `cheque`
- `limit` (optional): Page size, default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Sort field with direction
  - Options: `transaction_date`, `-transaction_date`, `amount`, `-amount`
  - Default: `-transaction_date` (newest first)

**Response (200 OK):**

```typescript
interface ListTransactionsResponse {
  success: true;
  data: {
    transactions: Array<{
      id: string;
      khatabook_id: string;
      customer_id: string;
      customer_name: string; // Joined for convenience
      type: 'GAVE' | 'GOT';
      amount: number;
      note: string | null;
      transaction_date: string; // ISO 8601
      payment_mode: string | null;
      invoice_id: string | null;
      has_attachments: boolean;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
      total_count?: number; // Only on first page
    };
    summary?: {
      // Only when filtered by customer or date range
      total_gave: number;
      total_got: number;
      net_amount: number;
      transaction_count: number;
    };
  };
}
```

**Example Request:**

```http
GET /api/v1/transactions?khatabook_id=550e8400-e29b-41d4-a716-446655440000&date_from=2026-03-01&date_to=2026-03-31&sort=-transaction_date&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### POST /transactions

**Description:** Create new transaction (credit or debit)

**Auth Required:** Yes

**Request Body:**

```typescript
interface CreateTransactionRequest {
  khatabook_id: string; // Required
  customer_id: string; // Required
  type: 'GAVE' | 'GOT'; // Required
  amount: number; // Required, must be > 0
  note?: string; // Optional description
  transaction_date?: string; // ISO 8601, default: now
  payment_mode?: 'cash' | 'upi' | 'card' | 'cheque';
  invoice_id?: string; // Link to invoice if applicable
  attachments?: Array<string>; // Array of file URLs (uploaded separately)
}
```

**Response (201 Created):**

```typescript
interface CreateTransactionResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    customer_id: string;
    type: 'GAVE' | 'GOT';
    amount: number;
    note: string | null;
    transaction_date: string;
    payment_mode: string | null;
    invoice_id: string | null;
    attachments: Array<{
      id: string;
      file_url: string;
      file_type: string;
      thumbnail_url: string | null;
      created_at: string;
    }>;
    created_at: string;
    updated_at: string;
    customer_balance_after: number; // Updated customer balance
    confirmation_sms_sent: boolean; // Whether SMS notification was sent to customer
  };
}
```

**Automatic Transaction Confirmation SMS:**

When a transaction is created, an optional SMS is automatically sent to the customer if they have a valid phone number:

- **SMS Format (GAVE):** "You took ₹{amount} from {business_name} on {date}. Balance: ₹{balance} you'll pay."
- **SMS Format (GOT):** "You paid ₹{amount} to {business_name} on {date}. Remaining: ₹{balance} you'll pay." (or "Balance cleared!" if zero)
- **Behavior:** Asynchronous (doesn't block transaction creation)
- **Failure handling:** If SMS fails, transaction is still created successfully
- **Response field:** `confirmation_sms_sent` indicates whether SMS was queued

**Error Responses:**

- `400` - Validation error (amount must be positive, invalid date, etc.)
- `403` - User doesn't own this khatabook
- `404` - Customer or khatabook not found
- `422` - Business logic error (e.g., customer and khatabook don't match)

---

### GET /transactions/:id

**Description:** Get transaction details with attachments

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetTransactionResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    customer_id: string;
    customer_name: string;
    type: 'GAVE' | 'GOT';
    amount: number;
    note: string | null;
    transaction_date: string;
    payment_mode: string | null;
    invoice_id: string | null;
    attachments: Array<{
      id: string;
      file_url: string;
      file_type: string;
      file_size: number | null;
      thumbnail_url: string | null;
      created_at: string;
    }>;
    created_at: string;
    updated_at: string;
  };
}
```

---

### PUT /transactions/:id

**Description:** Update transaction details

**Auth Required:** Yes

**Request Body:**

```typescript
interface UpdateTransactionRequest {
  amount?: number; // Must be > 0
  note?: string;
  transaction_date?: string;
  payment_mode?: 'cash' | 'upi' | 'card' | 'cheque';
  // Note: type and customer_id cannot be changed after creation
}
```

**Response (200 OK):**

```typescript
interface UpdateTransactionResponse {
  success: true;
  data: {
    // Same as GetTransactionResponse
    customer_balance_after: number; // Recalculated balance
  };
}
```

**Error Responses:**

- `400` - Validation error
- `403` - User doesn't own this transaction
- `404` - Transaction not found
- `422` - Cannot modify transaction linked to paid invoice

---

### DELETE /transactions/:id

**Description:** Soft delete transaction and recalculate customer balance

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface DeleteTransactionResponse {
  success: true;
  data: {
    id: string;
    deleted: boolean;
    deleted_at: string;
    customer_balance_after: number; // Recalculated balance
  };
}
```

**Error Responses:**

- `403` - User doesn't own this transaction
- `404` - Transaction not found
- `422` - Cannot delete transaction linked to paid invoice

---

### POST /transactions/:id/undo

**Description:** Undo recently created transaction (P1 feature - within 5 minutes of creation)

**Auth Required:** Yes

**Request Body:**

```typescript
interface UndoTransactionRequest {
  reason?: string; // Optional reason for undo
}
```

**Response (200 OK):**

```typescript
interface UndoTransactionResponse {
  success: true;
  data: {
    transaction_id: string;
    undone: boolean;
    deleted_at: string;
    customer_balance_after: number; // Recalculated balance
    undo_window_remaining: number; // Seconds remaining in undo window (0 if expired)
  };
}
```

**Error Responses:**

- `403` - User doesn't own this transaction
- `404` - Transaction not found
- `422` - Undo window expired (>5 minutes since creation)
- `422` - Cannot undo transaction linked to invoice

**Business Rules:**

- Can only undo transactions created within last 5 minutes
- Cannot undo if transaction is linked to a paid invoice
- Undo performs soft delete and recalculates customer balance
- Undo action is logged in audit_logs

**Example Request:**

```http
POST /api/v1/transactions/770e8400-e29b-41d4-a716-446655440002/undo
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "reason": "Entered wrong amount"
}
```

---

### GET /customers/:customer_id/transactions

**Description:** Get all transactions for a specific customer (nested route)

**Auth Required:** Yes

**Query Parameters:**

- `type` (optional): Filter by `GAVE` or `GOT`
- `date_from` (optional): ISO date
- `date_to` (optional): ISO date
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-transaction_date`

**Response (200 OK):**

```typescript
// Same as ListTransactionsResponse but pre-filtered by customer
```

---

## 7. Invoices Management

### Module Overview

Generate GST-compliant and non-GST invoices with automatic tax calculations.

---

### GET /invoices

**Description:** List invoices with filtering

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (required): UUID of khatabook
- `customer_id` (optional): Filter by customer
- `status` (optional): `DRAFT`, `SENT`, `PAID`, `CANCELLED`
- `is_gst_invoice` (optional): Boolean - true for GST invoices only
- `date_from` (optional): Invoice date range start
- `date_to` (optional): Invoice date range end
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-invoice_date`

**Response (200 OK):**

```typescript
interface ListInvoicesResponse {
  success: true;
  data: {
    invoices: Array<{
      id: string;
      khatabook_id: string;
      customer_id: string;
      customer_name: string;
      invoice_number: string;
      invoice_date: string; // ISO date
      due_date: string | null;
      status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
      subtotal: number;
      tax_amount: number;
      total_amount: number;
      is_gst_invoice: boolean;
      pdf_url: string | null;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
      total_count?: number;
    };
  };
}
```

---

### POST /invoices

**Description:** Create new invoice with line items

**Auth Required:** Yes

**Request Body:**

```typescript
interface CreateInvoiceRequest {
  khatabook_id: string;
  customer_id: string;
  invoice_date?: string; // ISO date, default: today
  due_date?: string; // ISO date, optional
  is_gst_invoice: boolean; // Required
  notes?: string;
  items: Array<{
    // Min 1 item required
    item_name: string; // Required
    description?: string;
    quantity: number; // Default: 1
    unit?: string; // e.g., "pcs", "kg", "meter"
    rate: number; // Required, price per unit
    tax_rate?: number; // GST % (0, 5, 12, 18, 28), default: 0
    hsn_code?: string; // HSN/SAC code for GST
  }>;
  create_transaction?: boolean; // Auto-create GAVE transaction, default: true
}
```

**Response (201 Created):**

```typescript
interface CreateInvoiceResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    customer_id: string;
    invoice_number: string; // Auto-generated: INV-0001
    invoice_date: string;
    due_date: string | null;
    status: 'DRAFT';
    subtotal: number; // Sum of all item totals before tax
    tax_amount: number; // Total tax (CGST + SGST or IGST)
    total_amount: number; // Subtotal + tax
    notes: string | null;
    is_gst_invoice: boolean;
    pdf_url: string | null; // Generated async, initially null
    items: Array<{
      id: string;
      item_name: string;
      description: string | null;
      quantity: number;
      unit: string | null;
      rate: number;
      tax_rate: number;
      tax_amount: number;
      total: number; // (quantity × rate) + tax
      hsn_code: string | null;
      sort_order: number;
    }>;
    transaction_id: string | null; // Created transaction if create_transaction=true
    created_at: string;
    updated_at: string;
  };
}
```

**Error Responses:**

- `400` - Validation error (items required, invalid tax rate, etc.)
- `403` - User doesn't own khatabook
- `404` - Customer not found
- `422` - Business logic error (customer GST required for GST invoice, etc.)

---

### GET /invoices/:id

**Description:** Get invoice details with all items

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetInvoiceResponse {
  success: true;
  data: {
    // Same fields as CreateInvoiceResponse
    customer: {
      name: string;
      phone_number: string | null;
      email: string | null;
      address: string | null;
      gstin: string | null;
    };
    business: {
      // From invoice_settings
      name: string | null;
      address: string | null;
      phone: string | null;
      email: string | null;
      gstin: string | null;
      logo_url: string | null;
    };
    tax_breakdown?: {
      // Only for GST invoices
      cgst: number;
      sgst: number;
      igst: number;
      taxable_amount: number;
    };
  };
}
```

---

### PUT /invoices/:id

**Description:** Update invoice (only DRAFT status can be edited)

**Auth Required:** Yes

**Request Body:**

```typescript
interface UpdateInvoiceRequest {
  invoice_date?: string;
  due_date?: string;
  notes?: string;
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  items?: Array<{
    // Same as CreateInvoiceRequest items
  }>;
}
```

**Response (200 OK):**

```typescript
// Same as GetInvoiceResponse with updated values
```

**Error Responses:**

- `403` - User doesn't own this invoice
- `404` - Invoice not found
- `422` - Cannot edit invoice with status other than DRAFT

---

### GET /invoices/:id/pdf

**Description:** Generate and download invoice PDF

**Auth Required:** Yes

**Query Parameters:**

- `regenerate` (optional): Boolean - force regenerate PDF, default false

**Response (200 OK):**

```typescript
interface GetInvoicePDFResponse {
  success: true;
  data: {
    invoice_id: string;
    pdf_url: string; // CDN URL (Cloudflare R2)
    generated_at: string;
    expires_at: string | null; // Presigned URL expiry, if applicable
  };
}
```

**Note:** PDF generation happens asynchronously. On first request, if PDF doesn't exist, it will be queued for generation and returned when ready (may take 2-5 seconds).

---

## 8. Inventory Management (P2)

### Module Overview

Track product stock levels, get low stock alerts, and manage inventory for invoicing.

---

### GET /inventory

**Description:** List inventory items with stock levels

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (required): UUID of khatabook
- `low_stock_only` (optional): Boolean - show only items at/below min stock level
- `q` (optional): Search by item name, SKU, or barcode
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `item_name`

**Response (200 OK):**

```typescript
interface ListInventoryResponse {
  success: true;
  data: {
    items: Array<{
      id: string;
      khatabook_id: string;
      item_name: string;
      sku: string | null;
      barcode: string | null;
      unit: string;
      selling_price: number;
      current_stock: number;
      min_stock_level: number | null;
      is_low_stock: boolean; // current_stock <= min_stock_level
      image_url: string | null;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
      total_count?: number;
    };
    summary: {
      total_items: number;
      low_stock_items: number;
      total_stock_value: number; // Sum of (current_stock × selling_price)
    };
  };
}
```

---

### POST /inventory

**Description:** Add new inventory item

**Auth Required:** Yes

**Request Body:**

```typescript
interface CreateInventoryRequest {
  khatabook_id: string;
  item_name: string; // Required
  description?: string;
  sku?: string;
  barcode?: string;
  unit?: string; // Default: "pcs"
  purchase_price?: number;
  selling_price: number; // Required
  current_stock?: number; // Default: 0
  min_stock_level?: number; // Alert threshold
  hsn_code?: string; // For GST invoices
  tax_rate?: number; // Default GST %
  image_url?: string;
}
```

**Response (201 Created):**

```typescript
interface CreateInventoryResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    item_name: string;
    description: string | null;
    sku: string | null;
    barcode: string | null;
    unit: string;
    purchase_price: number | null;
    selling_price: number;
    current_stock: number;
    min_stock_level: number | null;
    is_low_stock: boolean;
    hsn_code: string | null;
    tax_rate: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
}
```

---

### POST /inventory/:id/adjust-stock

**Description:** Manually adjust stock quantity (IN/OUT/ADJUSTMENT)

**Auth Required:** Yes

**Request Body:**

```typescript
interface AdjustStockRequest {
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number; // Positive for IN, negative for OUT/ADJUSTMENT
  reason?: string; // e.g., "Purchase", "Damaged", "Stock take"
  notes?: string;
}
```

**Response (200 OK):**

```typescript
interface AdjustStockResponse {
  success: true;
  data: {
    inventory_item_id: string;
    stock_log_id: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    balance_before: number;
    balance_after: number;
    reason: string | null;
    notes: string | null;
    created_at: string;
  };
}
```

---

### GET /inventory/:id/stock-logs

**Description:** Get complete stock movement history for an inventory item

**Auth Required:** Yes

**Query Parameters:**

- `type` (optional): Filter by type - `IN`, `OUT`, `ADJUSTMENT`
- `date_from` (optional): ISO date
- `date_to` (optional): ISO date
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-created_at`

**Response (200 OK):**

```typescript
interface GetStockLogsResponse {
  success: true;
  data: {
    logs: Array<{
      id: string;
      inventory_item_id: string;
      type: 'IN' | 'OUT' | 'ADJUSTMENT';
      quantity: number;
      balance_after: number;
      reason: string | null;
      reference_id: string | null; // invoice_id if from sale
      reference_type: string | null; // "invoice", "manual", etc.
      notes: string | null;
      created_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
    };
    summary: {
      total_in: number;
      total_out: number;
      total_adjustments: number;
      current_balance: number;
    };
  };
}
```

**Error Responses:**

- `404` - Inventory item not found
- `403` - User doesn't own this inventory item

---

## 9. Reports & Dashboard

### Module Overview

Business analytics, summary statistics, and report generation.

---

### GET /khatabooks/:id/reports/dashboard

**Description:** Get dashboard summary with key metrics and charts data

**Auth Required:** Yes

**Query Parameters:**

- `period` (optional): `today`, `week`, `month`, `year`, default: `month`

**Response (200 OK):**

```typescript
interface GetDashboardResponse {
  success: true;
  data: {
    summary: {
      total_customers: number;
      total_receivable: number; // Customers who owe you
      total_payable: number; // Customers you owe
      net_balance: number; // receivable - payable
      transactions_today: number;
      transactions_this_month: number;
    };
    top_defaulters: Array<{
      // Top 5 by balance
      customer_id: string;
      customer_name: string;
      balance: number;
      last_transaction_at: string | null;
    }>;
    top_customers: Array<{
      // Top 5 by transaction volume
      customer_id: string;
      customer_name: string;
      total_gave: number;
      total_got: number;
      transaction_count: number;
    }>;
    chart_data: {
      transactions_over_time: Array<{
        date: string; // ISO date
        gave_amount: number;
        got_amount: number;
        transaction_count: number;
      }>;
      balance_trend: Array<{
        date: string;
        receivable: number;
        payable: number;
        net_balance: number;
      }>;
    };
    recent_transactions: Array<{
      // Last 10 transactions
      id: string;
      customer_name: string;
      type: 'GAVE' | 'GOT';
      amount: number;
      transaction_date: string;
    }>;
  };
}
```

---

### GET /khatabooks/:id/reports/customer-balance

**Description:** Generate customer-wise balance report

**Auth Required:** Yes

**Query Parameters:**

- `balance_type` (optional): `receivable` (>0), `payable` (<0), `all`, default: `all`
- `min_balance` (optional): Filter customers with balance >= this amount
- `sort` (optional): Default `-balance`
- `format` (optional): `json`, `pdf`, `csv`, default: `json`

**Response (200 OK for JSON):**

```typescript
interface CustomerBalanceReportResponse {
  success: true;
  data: {
    report_date: string; // ISO timestamp
    khatabook_name: string;
    customers: Array<{
      customer_id: string;
      name: string;
      phone_number: string | null;
      opening_balance: number;
      total_gave: number;
      total_got: number;
      current_balance: number;
      last_transaction_at: string | null;
    }>;
    totals: {
      total_customers: number;
      total_receivable: number;
      total_payable: number;
      net_balance: number;
    };
  };
}
```

**Response (200 OK for PDF/CSV):**

```typescript
interface FileDownloadResponse {
  success: true;
  data: {
    file_url: string; // CDN URL to download
    file_type: 'application/pdf' | 'text/csv';
    generated_at: string;
    expires_at: string | null;
  };
}
```

---

### GET /khatabooks/:id/reports/transactions

**Description:** Generate transaction report with filters

**Auth Required:** Yes

**Query Parameters:**

- `customer_id` (optional): Filter by customer
- `type` (optional): `GAVE`, `GOT`
- `date_from` (required): ISO date
- `date_to` (required): ISO date
- `format` (optional): `json`, `pdf`, `csv`, default: `json`
- `limit` (optional): Only for JSON format
- `cursor` (optional): Only for JSON format

**Response (200 OK for JSON):**

```typescript
interface TransactionReportResponse {
  success: true;
  data: {
    report_date: string;
    khatabook_name: string;
    period: {
      from: string; // ISO date
      to: string; // ISO date
    };
    transactions: Array<{
      id: string;
      transaction_date: string;
      customer_name: string;
      type: 'GAVE' | 'GOT';
      amount: number;
      note: string | null;
      payment_mode: string | null;
    }>;
    summary: {
      total_transactions: number;
      total_gave: number;
      total_got: number;
      net_amount: number;
    };
    pagination?: {
      // Only for JSON format
      next_cursor: string | null;
      has_more: boolean;
    };
  };
}
```

---

## 10. Reminders & Notifications

### Module Overview

Send payment reminders via WhatsApp, SMS, or email to customers.

---

### POST /reminders/send

**Description:** Send payment reminder to a single customer

**Auth Required:** Yes

**Request Body:**

```typescript
interface SendReminderRequest {
  khatabook_id: string;
  customer_id: string;
  type: 'WHATSAPP' | 'SMS' | 'EMAIL';
  message?: string; // Optional custom message, uses template if not provided
  include_payment_link?: boolean; // Default: false (P1 feature)
}
```

**Response (200 OK):**

```typescript
interface SendReminderResponse {
  success: true;
  data: {
    reminder_id: string;
    customer_id: string;
    customer_name: string;
    type: 'WHATSAPP' | 'SMS' | 'EMAIL';
    status: 'SENT' | 'PENDING' | 'FAILED';
    message: string; // Actual message sent
    balance_at_send: number;
    provider_message_id: string | null;
    sent_at: string;
    error_message: string | null;
  };
}
```

**Error Responses:**

- `400` - Validation error (missing phone/email for customer)
- `403` - User doesn't own khatabook
- `404` - Customer not found
- `422` - Customer has zero balance (nothing to remind about)
- `429` - Rate limit exceeded (max 100 reminders per hour per user)

---

### POST /reminders/send-bulk

**Description:** Send reminders to multiple customers at once

**Auth Required:** Yes

**Request Body:**

```typescript
interface SendBulkRemindersRequest {
  khatabook_id: string;
  type: 'WHATSAPP' | 'SMS' | 'EMAIL';
  filters?: {
    min_balance?: number; // Only remind customers owing >= this amount
    customer_ids?: string[]; // Specific customers (if not provided, uses all with balance > 0)
  };
  message?: string; // Custom message template
}
```

**Response (202 Accepted):**

```typescript
interface SendBulkRemindersResponse {
  success: true;
  data: {
    job_id: string; // Background job ID
    status: 'queued';
    total_customers: number; // Number of reminders to send
    estimated_time: number; // Seconds
  };
}
```

**Note:** Poll `GET /jobs/:job_id` for completion status and results.

---

### GET /reminders

**Description:** Get reminder history for khatabook

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (required): UUID of khatabook
- `customer_id` (optional): Filter by customer
- `type` (optional): Filter by type (`WHATSAPP`, `SMS`, `EMAIL`)
- `status` (optional): Filter by status (`SENT`, `DELIVERED`, `FAILED`)
- `date_from` (optional): ISO date
- `date_to` (optional): ISO date
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-sent_at`

**Response (200 OK):**

```typescript
interface ListRemindersResponse {
  success: true;
  data: {
    reminders: Array<{
      id: string;
      customer_id: string;
      customer_name: string;
      type: 'WHATSAPP' | 'SMS' | 'EMAIL';
      status: 'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING';
      message: string;
      balance_at_send: number;
      sent_at: string;
      delivered_at: string | null;
      error_message: string | null;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
      total_count?: number;
    };
    summary: {
      total_sent: number;
      total_delivered: number;
      total_failed: number;
    };
  };
}
```

---

### GET /customers/:customer_id/reminders

**Description:** Get reminder history for a specific customer (convenience endpoint)

**Auth Required:** Yes

**Query Parameters:**

- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-sent_at`

**Response (200 OK):**

```typescript
// Same as ListRemindersResponse but pre-filtered by customer
```

**Note:** This is a convenience endpoint equivalent to `GET /reminders?customer_id=X`

---

## 11. Payments (P1)

### Module Overview

Payment gateway integration (Razorpay) for digital payment collection via UPI, cards, and wallets.

---

### POST /payments/create-link

**Description:** Generate payment link for customer

**Auth Required:** Yes

**Request Body:**

```typescript
interface CreatePaymentLinkRequest {
  khatabook_id: string;
  customer_id: string;
  amount: number; // Required, must be > 0
  invoice_id?: string; // Optional, link to invoice
  description?: string; // Payment description
  expire_at?: string; // ISO timestamp, default: 24 hours from now
}
```

**Response (201 Created):**

```typescript
interface CreatePaymentLinkResponse {
  success: true;
  data: {
    payment_id: string;
    customer_id: string;
    invoice_id: string | null;
    amount: number;
    gateway: 'razorpay';
    payment_link: string; // Short URL to payment page
    gateway_order_id: string;
    status: 'PENDING';
    expire_at: string;
    created_at: string;
  };
}
```

---

### POST /payments/webhook

**Description:** Razorpay webhook handler (internal, called by payment gateway)

**Auth Required:** No (verified via signature)

**Note:** This endpoint validates the webhook signature, updates payment status, creates GOT transaction if successful, and sends confirmation notification to customer.

---

### GET /payments/:id

**Description:** Get payment details and status

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetPaymentResponse {
  success: true;
  data: {
    id: string;
    khatabook_id: string;
    customer_id: string;
    customer_name: string;
    invoice_id: string | null;
    amount: number;
    gateway: 'razorpay';
    payment_method: string | null; // "upi", "card", "netbanking"
    gateway_payment_id: string | null;
    gateway_order_id: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    payment_link: string;
    paid_at: string | null;
    failed_reason: string | null;
    transaction_id: string | null; // Auto-created GOT transaction
    metadata: object | null; // Additional gateway data
    created_at: string;
    updated_at: string;
  };
}
```

---

### GET /payments

**Description:** List payments with filtering

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (required): UUID of khatabook
- `customer_id` (optional): Filter by customer
- `invoice_id` (optional): Filter by invoice
- `status` (optional): `PENDING`, `SUCCESS`, `FAILED`
- `date_from` (optional): ISO date
- `date_to` (optional): ISO date
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-created_at`

**Response (200 OK):**

```typescript
interface ListPaymentsResponse {
  success: true;
  data: {
    payments: Array<{
      id: string;
      customer_id: string;
      customer_name: string;
      invoice_id: string | null;
      invoice_number: string | null;
      amount: number;
      payment_method: string | null;
      status: 'PENDING' | 'SUCCESS' | 'FAILED';
      paid_at: string | null;
      created_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
      total_count?: number;
    };
    summary: {
      total_amount: number;
      successful_amount: number;
      pending_amount: number;
      failed_amount: number;
    };
  };
}
```

---

## 12. Offline Sync

### Module Overview

Push/pull synchronization for offline-first architecture with conflict resolution.

---

### POST /sync/push

**Description:** Push local changes from device to server

**Auth Required:** Yes

**Request Body:**

```typescript
interface SyncPushRequest {
  device_id: string;
  changes: Array<{
    entity_type: 'customer' | 'transaction' | 'invoice' | 'inventory_item';
    entity_id: string; // Local UUID (may not exist on server)
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    data: object; // Entity data (full object for CREATE/UPDATE)
    local_timestamp: string; // ISO timestamp when changed locally
    version: number; // Local version number
  }>;
}
```

**Response (200 OK):**

```typescript
interface SyncPushResponse {
  success: true;
  data: {
    synced: Array<{
      local_id: string;
      server_id: string; // May differ from local_id for CREATE
      entity_type: string;
      operation: string;
      status: 'synced';
      server_timestamp: string;
      server_version: number;
    }>;
    conflicts: Array<{
      local_id: string;
      server_id: string;
      entity_type: string;
      conflict_type: 'version_mismatch' | 'deleted_on_server' | 'concurrent_update';
      local_data: object;
      server_data: object;
      local_version: number;
      server_version: number;
    }>;
    errors: Array<{
      local_id: string;
      entity_type: string;
      operation: string;
      error_code: string;
      error_message: string;
    }>;
  };
}
```

---

### POST /sync/pull

**Description:** Pull server changes to device

**Auth Required:** Yes

**Request Body:**

```typescript
interface SyncPullRequest {
  device_id: string;
  khatabook_id: string;
  last_sync_timestamp?: string; // ISO timestamp, if null pulls all data
  entity_types?: string[]; // Filter by types, default: all
}
```

**Response (200 OK):**

```typescript
interface SyncPullResponse {
  success: true;
  data: {
    changes: Array<{
      entity_type: 'customer' | 'transaction' | 'invoice' | 'inventory_item';
      entity_id: string;
      operation: 'CREATE' | 'UPDATE' | 'DELETE';
      data: object | null; // null for DELETE
      server_timestamp: string;
      version: number;
    }>;
    deleted_ids: Array<{
      // Soft-deleted entities
      entity_type: string;
      entity_id: string;
      deleted_at: string;
    }>;
    sync_metadata: {
      sync_timestamp: string; // Use this for next pull
      total_changes: number;
      has_more: boolean; // If true, call again with same last_sync_timestamp
    };
  };
}
```

---

### POST /sync/resolve-conflict

**Description:** Resolve sync conflict with user's choice

**Auth Required:** Yes

**Request Body:**

```typescript
interface ResolveConflictRequest {
  device_id: string;
  entity_type: string;
  entity_id: string;
  resolution: 'use_local' | 'use_server' | 'merge';
  merged_data?: object; // Required if resolution = "merge"
}
```

**Response (200 OK):**

```typescript
interface ResolveConflictResponse {
  success: true;
  data: {
    entity_id: string;
    entity_type: string;
    resolution_applied: 'use_local' | 'use_server' | 'merge';
    final_data: object;
    server_timestamp: string;
    version: number;
  };
}
```

---

### GET /sync/status

**Description:** Get sync queue status for device

**Auth Required:** Yes

**Query Parameters:**

- `device_id` (required): Device identifier

**Response (200 OK):**

```typescript
interface SyncStatusResponse {
  success: true;
  data: {
    device_id: string;
    last_sync_at: string | null;
    pending_push: number; // Items waiting to be pushed
    pending_pull: number; // Estimated changes on server
    conflicts: number; // Unresolved conflicts
    sync_health: 'healthy' | 'warning' | 'error';
    last_error: string | null;
  };
}
```

---

## 13. Utility & System Endpoints

### Module Overview

Background jobs, file uploads, and system monitoring.

---

### POST /uploads/presigned-url

**Description:** Get presigned URL for direct file upload to cloud storage

**Auth Required:** Yes

**Request Body:**

```typescript
interface GetPresignedURLRequest {
  file_name: string; // e.g., "receipt.jpg"
  file_type: string; // MIME type: "image/jpeg", "application/pdf"
  file_size: number; // Bytes (max 10MB for images, 25MB for PDFs)
  category: 'transaction_attachment' | 'invoice_logo' | 'product_image' | 'profile_image';
}
```

**Response (200 OK):**

```typescript
interface GetPresignedURLResponse {
  success: true;
  data: {
    upload_url: string; // Presigned URL for PUT request
    file_url: string; // Final CDN URL after upload
    expires_at: string; // URL expiry (15 minutes)
    max_file_size: number;
  };
}
```

**Error Responses:**

- `400` - Invalid file type or size exceeds limit
- `413` - File too large

**Upload Process:**

1. Call POST /uploads/presigned-url
2. Upload file to upload_url using PUT request
3. Use file_url in subsequent API calls (transactions, customers, etc.)

**Example Request:**

```http
POST /api/v1/uploads/presigned-url
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "file_name": "receipt_001.jpg",
  "file_type": "image/jpeg",
  "file_size": 2048576,
  "category": "transaction_attachment"
}
```

---

### GET /jobs/:id

**Description:** Get background job status (for async operations like bulk reminders, reports export)

**Auth Required:** Yes

**Response (200 OK):**

```typescript
interface GetJobStatusResponse {
  success: true;
  data: {
    job_id: string;
    type: 'bulk_reminder' | 'export_report' | 'generate_pdf';
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    total_items: number;
    processed_items: number;
    result: object | null; // Result data when completed
    error_message: string | null;
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
  };
}
```

**Error Responses:**

- `404` - Job not found
- `403` - User doesn't own this job

**Example Response (Bulk Reminder Job):**

```json
{
  "success": true,
  "data": {
    "job_id": "job_ff0e8400-e29b-41d4-a716-446655440010",
    "type": "bulk_reminder",
    "status": "completed",
    "progress": 100,
    "total_items": 15,
    "processed_items": 15,
    "result": {
      "sent": 14,
      "failed": 1,
      "reminders": [
        {
          "customer_id": "...",
          "status": "SENT"
        }
      ]
    },
    "error_message": null,
    "created_at": "2026-04-03T10:30:00.000Z",
    "started_at": "2026-04-03T10:30:05.000Z",
    "completed_at": "2026-04-03T10:30:50.000Z"
  }
}
```

---

### GET /audit-logs

**Description:** Query audit trail for compliance and debugging

**Auth Required:** Yes

**Query Parameters:**

- `khatabook_id` (optional): Filter by khatabook
- `entity_type` (optional): `customer`, `transaction`, `invoice`, etc.
- `entity_id` (optional): Filter by specific entity
- `action` (optional): `CREATE`, `UPDATE`, `DELETE`, `RESTORE`
- `date_from` (optional): ISO date
- `date_to` (optional): ISO date
- `limit` (optional): Default 50, max 100
- `cursor` (optional): Pagination cursor
- `sort` (optional): Default `-created_at`

**Response (200 OK):**

```typescript
interface GetAuditLogsResponse {
  success: true;
  data: {
    logs: Array<{
      id: string;
      user_id: string;
      khatabook_id: string | null;
      entity_type: string;
      entity_id: string;
      action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
      changed_fields: string[] | null;
      old_values: object | null;
      new_values: object | null;
      ip_address: string | null;
      device_id: string | null;
      created_at: string;
    }>;
    pagination: {
      next_cursor: string | null;
      has_more: boolean;
    };
  };
}
```

**Error Responses:**

- `403` - Can only view audit logs for own khatabooks

**Example Request:**

```http
GET /api/v1/audit-logs?khatabook_id=550e8400-e29b-41d4-a716-446655440000&entity_type=transaction&action=DELETE&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### GET /health

**Description:** API health check (public endpoint)

**Auth Required:** No

**Response (200 OK):**

```typescript
interface HealthCheckResponse {
  success: true;
  data: {
    status: 'healthy';
    timestamp: string;
    version: string; // API version
    uptime: number; // Seconds
    services: {
      database: 'up' | 'down';
      redis: 'up' | 'down';
      storage: 'up' | 'down';
    };
  };
}
```

---

## 14. Common Patterns & Standards

### Pagination Pattern (Cursor-Based)

All list endpoints use cursor-based pagination for consistent, performant results.

**Request Pattern:**

```http
GET /endpoint?limit=50&cursor=eyJpZCI6Inh5eiIsInRzIjoxNjQ2MzA0MDAwfQ==
```

**Response Pattern:**

```typescript
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "next_cursor": "eyJpZCI6ImFiYyIsInRzIjoxNjQ2MzA0MDB9" | null,
      "has_more": boolean,
      "total_count": number | undefined  // Only on first page
    }
  }
}
```

**Cursor Details:**

- Opaque base64-encoded string
- Contains ID + timestamp for stable sorting
- Example decoded: `{id: "uuid-here", ts: 1646304000}`
- `null` indicates no more results
- Default limit: 50, max: 100

---

### Route Organization Strategy

**Hybrid Approach - When to Use Nested vs Flat:**

**Use Flat Routes (with query params):**

- Main resource lists that need khatabook filtering
- Optimized for offline sync and mobile bandwidth
- Examples:
  - `GET /customers?khatabook_id=X` (not `/khatabooks/:id/customers`)
  - `GET /transactions?khatabook_id=X`
  - `GET /invoices?khatabook_id=X`
  - `GET /inventory?khatabook_id=X`

**Use Nested Routes:**

- Natural hierarchical relationships
- Contextual operations within a specific parent
- Report aggregations scoped to khatabook
- Examples:
  - `GET /customers/:id/transactions` (transactions for specific customer)
  - `GET /khatabooks/:id/reports/dashboard` (reports scoped to khatabook)
  - `GET /khatabooks/:id/invoice-settings` (1-to-1 relationship)
  - `GET /inventory/:id/stock-logs` (logs for specific item)

**Rationale:**

- **Flat routes** reduce URL length (mobile bandwidth optimization)
- **Flat routes** simplify sync logic (fewer URL variations)
- **Nested routes** provide clear context for aggregations and relationships
- **Consistency:** All main list operations are flat, all contextual/scoped operations are nested

---

### Date and DateTime Fields

**Date-only Fields (ISO 8601 date format: `YYYY-MM-DD`):**

- `invoice_date` - Invoice issue date
- `due_date` - Payment due date
- Date filter parameters: `date_from`, `date_to`

**DateTime Fields (ISO 8601 timestamp with timezone: `YYYY-MM-DDTHH:mm:ss.sssZ`):**

- `transaction_date` - When transaction occurred (includes time)
- `created_at` - Record creation timestamp
- `updated_at` - Record modification timestamp
- `deleted_at` - Soft delete timestamp
- `sent_at` - Reminder sent timestamp
- `paid_at` - Payment completion timestamp

**Note:** All timestamps are in UTC (Z suffix). Clients handle timezone conversion for display.

---

### Filtering Pattern

Use query parameters for filters with intuitive naming.

**Comparison Operators:**

```
field_gt   - Greater than
field_gte  - Greater than or equal
field_lt   - Less than
field_lte  - Less than or equal
field_in   - In array (comma-separated)
```

**Examples:**

```http
# Balance greater than 1000
GET /customers?balance_gt=1000

# Date range
GET /transactions?date_from=2026-03-01&date_to=2026-03-31

# Multiple values
GET /invoices?status_in=PAID,SENT

# Search
GET /customers?q=kumar
```

---

### Sorting Pattern

Single `sort` parameter with `-` prefix for descending order.

**Format:** `sort={field}` or `sort=-{field}`

**Examples:**

```http
# Sort by name ascending
GET /customers?sort=name

# Sort by balance descending (default for customers)
GET /customers?sort=-balance

# Sort by date descending (default for transactions)
GET /transactions?sort=-transaction_date

# Multiple sort fields (comma-separated)
GET /customers?sort=-balance,name
```

---

### Error Codes Reference

**Authentication & Authorization:**

- `UNAUTHORIZED` (401) - Missing or invalid token
- `TOKEN_EXPIRED` (401) - Access token expired, use refresh token
- `FORBIDDEN` (403) - Valid token but no permission
- `INVALID_CREDENTIALS` (401) - Wrong OTP or phone number

**Validation Errors:**

- `VALIDATION_ERROR` (400) - Request validation failed
- `MISSING_REQUIRED_FIELD` (400) - Required field missing
- `INVALID_FORMAT` (400) - Wrong format (email, phone, date)
- `OUT_OF_RANGE` (400) - Value outside allowed range

**Resource Errors:**

- `NOT_FOUND` (404) - Resource doesn't exist
- `ALREADY_EXISTS` (409) - Duplicate resource
- `RESOURCE_LOCKED` (409) - Resource locked by another operation

**Business Logic Errors:**

- `INSUFFICIENT_BALANCE` (422) - Payment exceeds balance
- `CUSTOMER_HAS_TRANSACTIONS` (422) - Cannot delete customer with transactions
- `INVALID_OPERATION` (422) - Operation not allowed in current state
- `SYNC_CONFLICT` (409) - Conflicting changes detected

**Rate Limiting:**

- `RATE_LIMIT_EXCEEDED` (429) - Too many requests

**Server Errors:**

- `INTERNAL_ERROR` (500) - Unexpected server error
- `SERVICE_UNAVAILABLE` (503) - Maintenance or overload
- `GATEWAY_ERROR` (502) - Third-party service failure

---

### Rate Limiting

**Global Limits:**

- 100 requests per 15 minutes per user (authenticated)
- 20 requests per 15 minutes per IP (unauthenticated)

**Specific Endpoint Limits:**

- OTP send: 5 per hour per phone number
- OTP verify: 10 per hour per phone number
- Reminders: 100 per hour per user
- Sync push: 1000 items per request, no rate limit
- Sync pull: No rate limit

**Response Headers:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1646308800
```

**Error Response (429):**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": [
      {
        "retry_after": 300,
        "limit": 100,
        "window": "15 minutes"
      }
    ]
  }
}
```

---

### File Upload Pattern

Files are uploaded using a two-step presigned URL pattern for security and performance.

**Step 1: Request Presigned URL**

Call `POST /uploads/presigned-url` (see Section 13 for full specification):

```http
POST /api/v1/uploads/presigned-url
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_name": "receipt.jpg",
  "file_type": "image/jpeg",
  "file_size": 2048576,
  "category": "transaction_attachment"
}
```

**Step 2: Upload File to Presigned URL**

```http
PUT <upload_url>
Content-Type: image/jpeg
Body: <binary file data>
```

**Step 3: Use file_url in API Requests**

```json
{
  "attachments": ["https://cdn.cloudinary.com/khatabook/receipts/uuid.jpg"]
}
```

**Supported File Types:**

- Images: `image/jpeg`, `image/png`, `image/webp` (max 10MB)
- PDFs: `application/pdf` (max 25MB)

**Supported Categories:**

- `transaction_attachment` - Receipt/bill photos
- `invoice_logo` - Business logos
- `product_image` - Inventory item images
- `profile_image` - User profile photos

---

### Idempotency

For critical operations (payments, transactions), support idempotency to prevent duplicates.

**Request Header:**

```http
Idempotency-Key: <unique_client_generated_key>
```

**Server Behavior:**

- First request with key: Processes normally, caches response for 24 hours
- Duplicate request within 24 hours: Returns cached response (200 OK)
- After 24 hours: Key expires, processes as new request

**Supported Endpoints:**

- `POST /transactions`
- `POST /invoices`
- `POST /payments/create-link`
- `POST /sync/push`

---

### API Versioning

**Current Version:** v1

**URL Pattern:** `/api/v1/...`

**Version Strategy:**

- Major version in URL path (`/api/v1`, `/api/v2`)
- Breaking changes require new major version
- Backward-compatible changes added to current version
- Old versions supported for 12 months after new version release

---

## 15. Implementation Checklist

### P0 - Must Have (MVP)

**Authentication & User Management:**

- [ ] POST /auth/send-otp
- [ ] POST /auth/verify-otp
- [ ] POST /auth/refresh-token
- [ ] POST /auth/logout
- [ ] GET /auth/me
- [ ] PUT /auth/me
- [ ] GET /auth/sessions
- [ ] DELETE /auth/sessions/:id
- [ ] DELETE /auth/me

**Khatabooks:**

- [ ] GET /khatabooks
- [ ] POST /khatabooks
- [ ] GET /khatabooks/:id
- [ ] PUT /khatabooks/:id
- [ ] DELETE /khatabooks/:id
- [ ] GET /khatabooks/:id/invoice-settings
- [ ] PUT /khatabooks/:id/invoice-settings

**Customers:**

- [ ] GET /customers
- [ ] POST /customers
- [ ] GET /customers/:id
- [ ] PUT /customers/:id
- [ ] DELETE /customers/:id
- [ ] POST /customers/:id/settle

**Transactions:**

- [ ] GET /transactions
- [ ] POST /transactions (with automatic confirmation SMS)
- [ ] GET /transactions/:id
- [ ] PUT /transactions/:id
- [ ] DELETE /transactions/:id
- [ ] POST /transactions/:id/undo (P1 - within 5 minutes)
- [ ] GET /customers/:customer_id/transactions

**Basic Reports:**

- [ ] GET /khatabooks/:id/reports/dashboard
- [ ] GET /khatabooks/:id/reports/customer-balance
- [ ] GET /khatabooks/:id/reports/transactions

**Reminders:**

- [ ] POST /reminders/send
- [ ] GET /reminders

**Sync:**

- [ ] POST /sync/push
- [ ] POST /sync/pull
- [ ] GET /sync/status

**Utility & System:**

- [ ] POST /uploads/presigned-url
- [ ] GET /jobs/:id
- [ ] GET /health

---

### P1 - Important

**Invoices:**

- [ ] GET /invoices
- [ ] POST /invoices
- [ ] GET /invoices/:id
- [ ] PUT /invoices/:id
- [ ] GET /invoices/:id/pdf

**Payments:**

- [ ] POST /payments/create-link
- [ ] POST /payments/webhook
- [ ] GET /payments/:id
- [ ] GET /payments

**Advanced Reminders:**

- [ ] POST /reminders/send-bulk
- [ ] GET /customers/:customer_id/reminders

**Sync Conflicts:**

- [ ] POST /sync/resolve-conflict

---

### P2 - Nice to Have

**Inventory:**

- [ ] GET /inventory
- [ ] POST /inventory
- [ ] GET /inventory/:id
- [ ] PUT /inventory/:id
- [ ] DELETE /inventory/:id
- [ ] POST /inventory/:id/adjust-stock
- [ ] GET /inventory/:id/stock-logs

**Advanced Reports:**

- [ ] GET /khatabooks/:id/reports/cash-flow
- [ ] POST /khatabooks/:id/reports/export

**System & Monitoring:**

- [ ] GET /audit-logs

---

## Appendix A: Related Documents

- [Product Requirements Document (PRD)](./PRD.md)
- [Technical Architecture Document](./TECH_STACK.md)
- [Database Schema Document](./DATABASE_SCHEMA.md)

---

## Appendix B: Document Control

| Version | Date       | Author                   | Changes                                           |
| ------- | ---------- | ------------------------ | ------------------------------------------------- |
| 1.0     | 2026-04-03 | Backend Engineering Team | Initial API specification - complete and approved |

---

**END OF DOCUMENT**

_This API Specification Document has been reviewed and approved for implementation. All endpoints, formats, and patterns align with the PRD requirements and technical architecture._
