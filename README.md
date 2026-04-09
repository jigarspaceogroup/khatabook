# Khatabook Vyapar App

A digital khatabook (ledger) application for managing business transactions, customer credit/debit, and financial tracking.

## Project Structure

```
khatabook/
├── KhatabookMobile/     # React Native mobile app (Android/iOS)
└── KhatabookBackend/    # Node.js Express backend API
```

## Quick Start

### Backend (Node.js + Express + PostgreSQL)

```bash
cd KhatabookBackend
pnpm install
pnpm run dev
```

Backend runs on: `http://localhost:3000`

### Mobile (React Native)

```bash
cd KhatabookMobile
npm install
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS
```

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** JWT + Supabase Auth
- **Validation:** Zod
- **Queue:** BullMQ + Redis (Upstash)

### Mobile
- **Framework:** React Native 0.75.4
- **State:** Redux Toolkit + RTK Query
- **Navigation:** React Navigation
- **Language:** TypeScript
- **Icons:** React Native Vector Icons

## Development Status

- ✅ **Phase 1:** Project Setup - Complete
- ✅ **Phase 2:** Authentication - Complete
- 🚧 **Phase 3:** Khatabooks Management - In Progress
- 📋 **Phase 4-13:** See [IMPLEMENTATION_PLAN.md](KhatabookMobile/docs/IMPLEMENTATION_PLAN.md)

## Documentation

All documentation is in `KhatabookMobile/docs/`:
- [Implementation Plan](KhatabookMobile/docs/IMPLEMENTATION_PLAN.md)
- [API Specification](KhatabookMobile/docs/API_SPEC.md)
- [UI Screens](KhatabookMobile/docs/UI_SCREENS.md)
- [Database Schema](KhatabookMobile/docs/DATABASE_SCHEMA.md)
- [Tech Stack](KhatabookMobile/docs/TECH_STACK.md)

## License

Private Project - All Rights Reserved
