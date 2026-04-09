# Environment Configuration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure environment variables for backend connection and third-party services using react-native-dotenv.

**Architecture:** Install react-native-dotenv as a Babel plugin to transform @env imports at build time. Create .env for actual values and .env.example for documentation. Update API constants to use environment variables.

**Tech Stack:** react-native-dotenv, Babel, TypeScript

---

### Task 1: Install react-native-dotenv Package

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install react-native-dotenv**

Run:
```bash
npm install --save-dev react-native-dotenv
```

Expected: Package installed and added to devDependencies

- [ ] **Step 2: Verify installation**

Run:
```bash
npm list react-native-dotenv
```

Expected: Shows installed version

---

### Task 2: Configure Babel Plugin

**Files:**
- Modify: `babel.config.js`

- [ ] **Step 1: Update babel.config.js**

Replace the entire contents with:

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

- [ ] **Step 2: Verify Babel config syntax**

Run:
```bash
node -e "require('./babel.config.js')"
```

Expected: No syntax errors

- [ ] **Step 3: Commit Babel configuration**

```bash
git add babel.config.js
git commit -m "chore: configure react-native-dotenv babel plugin"
```

---

### Task 3: Create Environment Files

**Files:**
- Create: `.env`
- Create: `.env.example`

- [ ] **Step 1: Create .env file with actual values**

Create `.env` in project root:

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

- [ ] **Step 2: Create .env.example file with placeholders**

Create `.env.example` in project root:

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

- [ ] **Step 3: Verify files created**

Run:
```bash
ls -la .env .env.example
```

Expected: Both files exist in root directory

- [ ] **Step 4: Commit .env.example**

```bash
git add .env.example
git commit -m "docs: add environment variables example file"
```

Note: Do NOT commit .env (it will be gitignored in next task)

---

### Task 4: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .env to .gitignore**

Add after line 42 (`yarn-error.log`):

```gitignore

# Environment variables
.env
```

- [ ] **Step 2: Verify .env is ignored**

Run:
```bash
git status
```

Expected: `.env` should NOT appear in untracked files, `.env.example` should appear if not yet committed

- [ ] **Step 3: Commit .gitignore update**

```bash
git add .gitignore
git commit -m "chore: add .env to gitignore"
```

---

### Task 5: Update API Constants

**Files:**
- Modify: `src/constants/api.ts:1-18`

- [ ] **Step 1: Update api.ts to use environment variable**

Replace the entire contents of `src/constants/api.ts` with:

```typescript
/**
 * API Constants
 * Centralized API configuration
 */

import { API_URL } from '@env';

// Use environment variable for API base URL
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

- [ ] **Step 2: Verify no TypeScript errors**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors (TypeScript should recognize @env module from env.d.ts)

- [ ] **Step 3: Commit API constants update**

```bash
git add src/constants/api.ts
git commit -m "feat: use environment variable for API base URL"
```

---

### Task 6: Test Configuration

**Files:**
- None (testing only)

- [ ] **Step 1: Clear Metro bundler cache**

Run:
```bash
npm start -- --reset-cache
```

Expected: Metro starts and clears cache to pick up new Babel configuration

- [ ] **Step 2: Stop Metro (Ctrl+C)**

Action: Press Ctrl+C in terminal where Metro is running

Expected: Metro stops

- [ ] **Step 3: Start Metro normally**

Run:
```bash
npm start
```

Expected: Metro starts successfully, no errors about @env module

- [ ] **Step 4: In a new terminal, run Android app**

Run:
```bash
npm run android
```

Expected: App builds and runs, connects to backend at http://172.16.17.36:3000/api/v1

Alternative for iOS:
```bash
npm run ios
```

- [ ] **Step 5: Verify API_BASE_URL value**

Add temporary console log in `src/constants/api.ts` after imports:

```typescript
console.log('API_BASE_URL:', API_BASE_URL);
```

Check Metro logs for output showing: `API_BASE_URL: http://172.16.17.36:3000/api/v1`

- [ ] **Step 6: Remove temporary console log**

Remove the console.log line added in Step 5

- [ ] **Step 7: Final commit if console.log was committed**

If console.log was committed:
```bash
git add src/constants/api.ts
git commit -m "chore: remove debug console.log"
```

---

## Testing Checklist

After completing all tasks:

- [ ] `.env` file exists in root with actual values
- [ ] `.env.example` file exists in root with placeholders
- [ ] `.env` is in `.gitignore`
- [ ] `babel.config.js` includes react-native-dotenv plugin
- [ ] `src/constants/api.ts` imports API_URL from @env
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Metro bundler starts without errors
- [ ] App builds and runs on Android/iOS
- [ ] API calls use correct backend URL from .env

## Rollback Plan

If environment variables don't work:

1. Revert `src/constants/api.ts` to hardcoded URL:
```typescript
export const API_BASE_URL = 'http://172.16.17.36:3000/api/v1';
```

2. Clear Metro cache: `npm start -- --reset-cache`

3. Rebuild app: `npm run android` or `npm run ios`
