# Authentication Module

Complete authentication implementation using Supabase Auth for OTP and JWT for session management.

## Overview

This module provides phone-based OTP authentication with JWT access/refresh tokens for the Khatabook Clone application.

## Features

- **Phone OTP Authentication** - SMS-based OTP via Supabase Auth
- **JWT Tokens** - Access tokens (24h) and refresh tokens (30d)
- **Session Management** - Device tracking and multi-device support
- **User Profile Management** - Create and update user profiles
- **Secure Logout** - Session revocation per device or all devices

## API Endpoints

### 1. Send OTP
```http
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "phone_number": "+919876543210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully to your phone number",
    "expires_in": 60
  }
}
```

### 2. Verify OTP
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

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone_number": "+919876543210",
      "name": null,
      "email": null,
      "language_code": "en",
      "profile_image_url": null,
      "phone_verified": true,
      "created_at": "2026-04-07T10:30:00.000Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400,
    "is_new_user": true
  }
}
```

### 3. Refresh Token
```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "device_id": "device_abc123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

### 4. Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone_number": "+919876543210",
    "phone_verified": true,
    "name": "John Doe",
    "email": "john@example.com",
    "language_code": "en",
    "profile_image_url": null,
    "biometric_enabled": false,
    "last_login_at": "2026-04-07T10:30:00.000Z",
    "created_at": "2026-04-07T10:30:00.000Z",
    "updated_at": "2026-04-07T10:30:00.000Z"
  }
}
```

### 5. Update Profile
```http
PUT /api/v1/auth/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "language_code": "hi",
  "biometric_enabled": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone_number": "+919876543210",
    "name": "John Doe",
    "email": "john@example.com",
    "language_code": "hi",
    "profile_image_url": null,
    "phone_verified": true,
    "biometric_enabled": true,
    "updated_at": "2026-04-07T10:35:00.000Z"
  }
}
```

### 6. Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "device_id": "device_abc123",
  "logout_all_devices": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully",
    "devices_logged_out": 1
  }
}
```

## Architecture

### Module Structure
```
modules/auth/
├── auth.types.ts       # TypeScript interfaces
├── auth.validators.ts  # Zod validation schemas
├── auth.service.ts     # Business logic
├── auth.controller.ts  # HTTP handlers
├── auth.routes.ts      # Express routes
└── README.md          # This file
```

### Authentication Flow

1. **OTP Request**
   - Client sends phone number
   - Supabase Auth sends SMS OTP
   - OTP valid for 60 seconds

2. **OTP Verification**
   - Client submits phone + OTP
   - Supabase verifies OTP
   - Create/update user in database
   - Generate JWT access + refresh tokens
   - Create session record
   - Return tokens to client

3. **API Requests**
   - Client includes access token in Authorization header
   - Auth middleware verifies token
   - Sets req.user with decoded info
   - Controller accesses req.user.id

4. **Token Refresh**
   - Client sends refresh token when access token expires
   - Verify refresh token and session
   - Generate new access + refresh tokens
   - Update session with new tokens

5. **Logout**
   - Client sends logout request
   - Revoke session(s) in database
   - Tokens become invalid

## Security Features

- **Phone Verification** - SMS OTP via Supabase Auth
- **JWT Tokens** - Industry-standard token-based auth
- **Refresh Token Rotation** - New tokens on each refresh
- **Token Hashing** - Refresh tokens hashed in database (bcrypt)
- **Session Tracking** - Device ID, type, name, IP, user agent
- **Session Revocation** - Per-device or all-device logout
- **Rate Limiting** - OTP request limiting (Supabase built-in)

## Environment Variables

Required in `.env`:
```bash
# Supabase Auth
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# JWT Secrets
JWT_SECRET=your-64-char-secret-for-access-tokens
JWT_REFRESH_SECRET=your-64-char-secret-for-refresh-tokens
JWT_ACCESS_TOKEN_EXPIRY=24h
JWT_REFRESH_TOKEN_EXPIRY=30d
```

## Database Tables Used

### users
- Stores user profile information
- Primary authentication entity
- Soft delete support

### sessions
- Tracks active sessions per device
- Stores hashed refresh tokens
- Supports session revocation

## Error Codes

| Code                     | Status | Description                    |
| ------------------------ | ------ | ------------------------------ |
| OTP_SEND_FAILED          | 400    | Failed to send OTP             |
| INVALID_OTP              | 401    | Invalid or expired OTP         |
| OTP_VERIFICATION_FAILED  | 400    | OTP verification failed        |
| INVALID_REFRESH_TOKEN    | 401    | Invalid or expired refresh token |
| TOKEN_REFRESH_FAILED     | 400    | Failed to refresh token        |
| UNAUTHORIZED             | 401    | Missing or invalid auth token  |
| TOKEN_EXPIRED            | 401    | Access token expired           |
| INVALID_TOKEN            | 401    | Invalid access token           |
| LOGOUT_FAILED            | 400    | Failed to logout               |
| USER_NOT_FOUND           | 404    | User not found                 |
| UPDATE_PROFILE_FAILED    | 400    | Failed to update profile       |
| VALIDATION_ERROR         | 400    | Request validation failed      |

## Testing

### Manual Testing
Use the provided test script:
```bash
bash test-auth-endpoints.sh
```

### Test Users
Two test users are seeded in the database:
- Phone: +918095216357
- Phone: +917548902804

**Note:** In development, Supabase may use test OTPs. Check Supabase dashboard for OTP or use a real phone number.

## Usage Examples

### JavaScript/TypeScript Client
```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

// 1. Send OTP
const sendOtp = async (phoneNumber: string) => {
  const response = await axios.post(`${API_URL}/auth/send-otp`, {
    phone_number: phoneNumber,
  });
  return response.data;
};

// 2. Verify OTP
const verifyOtp = async (phoneNumber: string, otp: string, deviceId: string) => {
  const response = await axios.post(`${API_URL}/auth/verify-otp`, {
    phone_number: phoneNumber,
    otp: otp,
    device_id: deviceId,
    device_type: 'android',
    device_name: 'My Phone',
  });

  // Store tokens
  localStorage.setItem('access_token', response.data.data.access_token);
  localStorage.setItem('refresh_token', response.data.data.refresh_token);

  return response.data;
};

// 3. Get current user
const getCurrentUser = async () => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// 4. Refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const deviceId = localStorage.getItem('device_id');

  const response = await axios.post(`${API_URL}/auth/refresh-token`, {
    refresh_token: refreshToken,
    device_id: deviceId,
  });

  // Update tokens
  localStorage.setItem('access_token', response.data.data.access_token);
  localStorage.setItem('refresh_token', response.data.data.refresh_token);

  return response.data;
};

// 5. Logout
const logout = async () => {
  const accessToken = localStorage.getItem('access_token');
  const deviceId = localStorage.getItem('device_id');

  await axios.post(`${API_URL}/auth/logout`, {
    device_id: deviceId,
    logout_all_devices: false,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Clear tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
```

## Next Steps

1. **Rate Limiting** - Add rate limiting middleware for OTP endpoints
2. **Session Management UI** - Build endpoints to list/revoke sessions
3. **Account Deletion** - Implement GDPR-compliant account deletion
4. **Biometric Auth** - Add biometric authentication support
5. **PIN Auth** - Add 4-digit PIN for quick login
6. **Email OTP** - Add email-based OTP as fallback

## Maintenance

- Monitor OTP delivery rates
- Review session expiration policies
- Audit token refresh patterns
- Clean up expired sessions periodically
- Monitor failed authentication attempts

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review Supabase Auth logs
- Check Sentry for errors
- Contact backend team
