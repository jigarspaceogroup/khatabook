# Environment Configuration Design

**Date:** 2026-04-08
**Status:** Approved
**Approach:** Basic Setup (Approach 1)

## Overview

Configure environment variables for the Khatabook Mobile app to connect to the backend API and integrate third-party services (Sentry, Supabase, Razorpay). Use `react-native-dotenv` to manage environment variables with secure gitignore practices.

## Requirements

- Backend URL: `http://172.16.17.36:3000/api/v1` (same for all environments)
- Environment variables needed:
  - `APP_ENV` - Application environment (development/production)
  - `API_URL` - Backend API base URL
  - `SENTRY_DSN` - Error tracking service
  - `SUPABASE_URL` - Database and auth service
  - `SUPABASE_ANON_KEY` - Supabase public key
  - `RAZORPAY_KEY_ID` - Payment gateway key (placeholder for now)
  - `ENABLE_OFFLINE_MODE` - Feature flag
  - `ENABLE_BIOMETRIC_AUTH` - Feature flag
- Keep secrets out of version control
- Provide example file for team members

## Architecture

### Package Selection
Use `react-native-dotenv` - a Babel plugin that transforms environment variable imports at build time. Chosen because:
- Simple setup with existing Babel configuration
- TypeScript support via module declarations
- No native code (works immediately without native builds)
- Matches existing `@env` type definitions in `src/types/env.d.ts`

### File Structure
```
KhatabookMobile/
├── .env                 # Actual values (gitignored)
├── .env.example         # Placeholder values (committed)
├── .gitignore           # Updated to ignore .env
├── babel.config.js      # Updated with dotenv plugin
└── src/
    ├── constants/
    │   └── api.ts       # Updated to import from @env
    └── types/
        └── env.d.ts     # Already configured (no changes)
```

### Build-Time Transformation
`react-native-dotenv` works as a Babel plugin:
1. Reads `.env` file during build/bundle
2. Replaces `import { API_URL } from '@env'` with actual string values
3. No runtime overhead - values are compiled into the bundle

## Implementation Details

### 1. Package Installation
```bash
npm install --save-dev react-native-dotenv
```

### 2. Babel Configuration
Update `babel.config.js`:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
```

**Configuration options:**
- `moduleName: '@env'` - Import from `@env` module (matches TypeScript types)
- `path: '.env'` - Read from `.env` file in root
- `safe: false` - Don't require `.env.example` validation
- `allowUndefined: true` - Allow missing variables (won't crash build)

### 3. Environment Files

**`.env` (actual values, gitignored):**
```env
# Application Environment
APP_ENV=development

# API Configuration
API_URL=http://172.16.17.36:3000/api/v1

# Sentry (Error Tracking)
SENTRY_DSN=https://05ac43b1a758128b55de90e175945f38@o4511172399857664.ingest.de.sentry.io/4511172419059792

# Supabase (Database + Auth + Storage)
SUPABASE_URL=https://nasegfifavpmalpfdlzh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc2VnZmlmYXZwbWFscGZkbHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjMyNTIsImV4cCI6MjA5MTAzOTI1Mn0.AZKgXFLr6EzBWrUN_Sp5oCn1rkEXbUqH9w6CSZ7QVTU

# Razorpay (Placeholder - will be configured in Phase 1)
RAZORPAY_KEY_ID=rzp_test_xxxxxx

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_BIOMETRIC_AUTH=false
```

**`.env.example` (placeholders, committed to git):**
```env
# Application Environment
APP_ENV=development

# API Configuration
API_URL=http://localhost:3000/api/v1

# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn-here

# Supabase (Database + Auth + Storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Razorpay (Placeholder - will be configured in Phase 1)
RAZORPAY_KEY_ID=rzp_test_xxxxxx

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_BIOMETRIC_AUTH=false
```

### 4. Code Updates

**Update `src/constants/api.ts`:**
```typescript
import { API_URL } from '@env';

export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    SESSIONS: `${API_BASE_URL}/auth/sessions`,
  },
};
```

**Update `.gitignore`:**
Add after the `node_modules/` section:
```gitignore
# Environment variables
.env
```

### 5. TypeScript Types
No changes needed - `src/types/env.d.ts` already declares the `@env` module with all required variables.

## Testing Strategy

### Manual Testing
1. Create `.env` file with actual values
2. Start Metro bundler: `npm start -- --reset-cache` (reset cache to pick up new Babel config)
3. Run app: `npm run android` or `npm run ios`
4. Verify API calls use correct backend URL from environment variable

### Verification Points
- App connects to backend at `http://172.16.17.36:3000/api/v1`
- No TypeScript errors when importing from `@env`
- Metro bundler processes `.env` file successfully

## Security Considerations

1. **Git Exclusion:** `.env` is gitignored to prevent committing secrets
2. **Example File:** `.env.example` provides template without exposing real credentials
3. **Team Onboarding:** New developers copy `.env.example` to `.env` and fill in real values
4. **Supabase Anon Key:** This is a public key, safe to use in mobile apps (RLS policies protect data)
5. **Sentry DSN:** Public identifier for error reporting, safe to expose

## Migration Notes

- Current hardcoded URL in `api.ts` will be replaced with environment variable
- No breaking changes - API_BASE_URL export remains the same
- Existing code using `API_ENDPOINTS` requires no changes

## Future Enhancements (Out of Scope)

- Runtime validation of required environment variables
- Multiple environment files (`.env.development`, `.env.production`)
- Environment-specific configurations (different backends per environment)

## Implementation Checklist

- [ ] Install `react-native-dotenv` package
- [ ] Update `babel.config.js` with plugin configuration
- [ ] Create `.env` file with actual values
- [ ] Create `.env.example` file with placeholders
- [ ] Update `src/constants/api.ts` to import from `@env`
- [ ] Update `.gitignore` to exclude `.env`
- [ ] Reset Metro cache and test app
