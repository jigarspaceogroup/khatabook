# Khatabook Clone - Product Requirements Document (PRD)

**Document Version:** 1.0
**Date:** April 3, 2026
**Author:** Product Team
**Status:** Final Design - Ready for Implementation

---

## Table of Contents

1. [Product Overview & Vision](#1-product-overview--vision)
2. [Reference Product Analysis](#2-reference-product-analysis)
3. [Target Users & Personas](#3-target-users--personas)
4. [Problems We're Solving](#4-problems-were-solving)
5. [Complete Feature List (P0/P1/P2)](#5-complete-feature-list-prioritized)
6. [User Stories](#6-user-stories-by-feature-module)
7. [Detailed User Flows](#7-detailed-user-flows-step-by-step)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Models](#9-data-models-postgresql-schema)
10. [API Design](#10-api-design-high-level)
11. [Security & Compliance](#11-security--compliance)
12. [Third-Party Integrations](#12-third-party-integrations)
13. [Multi-Language Support](#13-multi-language-support-strategy)
14. [Offline-First Architecture](#14-offline-first-architecture)
15. [Testing Strategy](#15-testing-strategy)
16. [Success Metrics & KPIs](#16-success-metrics--kpis)
17. [Launch Phases & Timeline](#17-launch-phases--timeline)

---

## 1. Product Overview & Vision

### Product Name

Khatabook Clone (to be branded with your own name)

### One-line Description

A free mobile app that helps Indian small business owners digitally manage customer credit/debit, send payment reminders, generate invoices, track inventory, and get business insights—replacing traditional paper ledgers.

### What We're Building

A React Native mobile application (iOS + Android) with Node.js backend that replicates 100% of Khatabook's features. The app targets kirana store owners, retailers, wholesalers, and freelancers in Tier 2-3 Indian cities who currently manage transactions in paper notebooks (bahi-khata) or Excel sheets.

### Why We're Building It

- Small businesses lose money due to forgotten debts, poor record-keeping, and delayed payments
- Traditional paper ledgers are error-prone, can be lost, and don't provide business insights
- Existing solutions are either too complex (Tally) or too expensive for micro-businesses
- WhatsApp-based reminders dramatically improve payment collection rates
- Digital ledgers enable access to business credit and loans

### Core Value Propositions

1. **Zero learning curve** - As simple as writing in a notebook, but digital
2. **Get paid faster** - One-tap WhatsApp/SMS reminders with payment links
3. **Never lose data** - Automatic cloud backup, access from multiple devices
4. **Professional invoices** - GST-compliant bills in seconds
5. **Business insights** - See who owes you, track inventory, analyze cash flow
6. **Multilingual** - Works in 11+ Indian languages for low-literacy users
7. **Works offline** - Record transactions without internet, syncs when online

### Monetization Strategy (like Khatabook)

- Free core features (ledger, basic invoicing, reminders)
- Premium features (advanced reports, inventory alerts, expense tracking)
- Commission on business loans facilitated through the app
- Payment processing fees (small % on UPI/card transactions)

### Target Market

**Geography:** India-only focus (UPI, GST, Indian languages, Rupee)

### Technology Stack

- **Mobile:** React Native (cross-platform: iOS + Android)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (primary), Redis (cache), SQLite (offline storage)
- **Architecture:** Modular Monolith (can extract to microservices later)

### Design Requirement

**Pixel-perfect clone** - All screens, layouts, colors, fonts, icons, navigation patterns must replicate the original Khatabook app exactly.

---

## 2. Reference Product Analysis

Based on research from [Khatabook website](https://khatabook.com/), [Play Store](https://play.google.com/store/apps/details?id=com.vaibhavkalpe.android.khatabook&hl=en_IN), [App Store](https://apps.apple.com/in/app/khatabook-vyapar-app/id1488204139), and feature blogs.

### Core Ledger Management

- Add/edit/delete customers and suppliers
- Record "You Gave" (credit/udhar) transactions
- Record "You Got" (debit/jama) transactions
- Attach photos to transactions (bills, receipts, delivery notes)
- Auto-calculate balance per customer
- Overall business balance dashboard
- Transaction history with date/time stamps
- Search customers by name or phone number
- Customer-wise transaction filtering
- Settlement/clear balance option

### Payment & Reminders

- One-tap WhatsApp reminder with payment link
- SMS reminder with payment link
- Bulk reminder sending (remind all customers at once)
- Automatic transaction confirmation SMS to customers
- Direct call to customer from app
- Payment link generation (UPI/card/wallet)
- Payment collection via UPI, cards, wallets
- Track payment status (pending/received)

### Invoicing & Billing

- Generate GST-compliant invoices
- Non-GST invoice generation
- Customizable invoice templates (add logo, business details)
- Automatic tax calculation (CGST/SGST/IGST)
- Item-wise invoice with quantity, rate, tax
- PDF invoice generation
- Share invoice via WhatsApp
- Print invoice functionality
- E-Way bill generation support

### Inventory Management

- Add products/items with name, price, stock quantity
- Track stock levels in real-time
- Low stock alerts/notifications
- Item-wise sales reports
- Automatic stock deduction on sales
- Stock valuation reports
- Export item-wise reports (Excel/PDF)

### Reports & Analytics

- Dashboard with summary cards (total receivable, total payable, today's transactions)
- Date range filter for reports
- Customer-wise account statement
- Transaction report (all entries with date filter)
- Cash flow report (in vs out)
- Party-wise balance report
- Download reports as PDF
- Share reports via WhatsApp
- GST reports for filing
- Profit & loss overview
- Business insights and trends

### Data & Backup

- Automatic cloud backup
- Multi-device access (same account on multiple phones)
- Restore data on new device
- Export complete data (Excel/CSV)
- Data encryption (bank-grade security)
- RBI-compliant secure storage

### Multiple Ledgers

- Create multiple khatabooks under one account
- Personal khatabook for friends/family lending
- Business khatabook for customer transactions
- Switch between ledgers easily
- Separate reporting per ledger

### Staff & Expense Management (Pagarkhata)

- Add employees/staff members
- Record salary payments
- Track advances given to staff
- Staff attendance tracking
- Salary due reminders
- Expense tracking by category
- Business vs personal expense separation

### Business Loans

- Apply for business loans within app
- Loan eligibility check based on transaction history
- Real-time loan application status
- Loan repayment tracking
- Direct deposit to bank account
- Partnership with NBFCs/banks

### Multi-Language Support

- 11+ Indian languages (Hindi, English, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Bengali, Punjabi, Odia)
- Language selection at onboarding
- Switch language anytime in settings
- Regional number formats (lakhs/crores)

### Offline Mode

- Record transactions without internet
- Auto-sync when connection restored
- View past transactions offline
- Local data storage (SQLite)
- Sync status indicator

### Authentication & Security

- Phone number + OTP login
- No password required
- Biometric authentication (fingerprint/Face ID)
- Auto-logout on inactivity
- PIN/pattern lock option
- Data encryption at rest and in transit

### User Experience

- Simple, minimal UI (designed for low-tech literacy)
- Large touch targets for easy tapping
- Voice input support (dictate amounts)
- Calculator built into amount entry
- Recent transactions quick view
- Swipe actions (delete, edit)
- Undo last transaction

### Features from User Reviews

- Need for multi-currency support (requested but not available)
- Chronological sorting options (asc/desc)
- Better contact import/discovery
- Reserve fund tracking
- Recurring transactions

---

## 3. Target Users & Personas

### Persona 1: Rajesh - Kirana Store Owner

**Demographics:**

- Age: 42, Male
- Location: Indore (Tier 2 city)
- Education: 10th pass
- Tech literacy: Low (basic smartphone usage)
- Business: Small grocery store, 15-20 customers daily
- Annual turnover: ₹20-25 lakhs

**Behavior & Pain Points:**

- Currently uses paper khata (ledger notebook)
- Forgets to collect payments, loses ₹15K-20K annually
- Customers delay payments claiming "I already paid"
- Cannot track inventory, often runs out of stock
- Takes 30 mins to calculate month-end balances manually
- Lost entire khata once during monsoon (water damage)
- Doesn't know basic accounting or GST filing

**Goals:**

- Never forget who owes money
- Collect payments faster without awkward confrontations
- Track inventory to avoid stock-outs
- Look professional with printed bills
- Backup data so it's never lost

**App Usage:**

- Uses app in Hindi
- Records 15-20 transactions daily
- Sends WhatsApp reminders every Saturday
- Checks dashboard once a week

---

### Persona 2: Priya - Freelance Graphic Designer

**Demographics:**

- Age: 28, Female
- Location: Pune (Metro city)
- Education: Graduate (Design degree)
- Tech literacy: Moderate-High
- Business: Freelance design services, 8-10 active clients
- Annual income: ₹6-8 lakhs

**Behavior & Pain Points:**

- Uses WhatsApp + Excel to track client payments
- Clients often delay payments for 30-60 days
- Spends 2-3 hours monthly reconciling Excel sheets
- Cannot generate professional invoices easily
- Misses payment follow-ups when busy with projects
- No clear view of cash flow or pending receivables
- Struggles with GST invoice requirements for corporate clients

**Goals:**

- Professional GST invoices for corporate clients
- Automated payment reminders without manual follow-up
- Clear visibility of who owes money and when
- Track expenses vs income
- Spend less time on accounting, more on design

**App Usage:**

- Uses app in English
- Records 20-25 transactions monthly
- Generates 8-10 invoices per month
- Uses reports for tax filing
- Checks dashboard 2-3 times weekly

---

### Persona 3: Karim - Wholesale Cloth Distributor

**Demographics:**

- Age: 51, Male
- Location: Surat (Tier 2 city)
- Education: 12th pass
- Tech literacy: Moderate
- Business: Wholesale textile distribution, 100+ retailer customers
- Annual turnover: ₹2-3 crores

**Behavior & Pain Points:**

- Manages 100+ customer accounts
- Uses Tally but finds it too complex for daily use
- Has 2 employees who also need to record transactions
- ₹15-20 lakhs outstanding at any time
- Difficult to track which customers are delaying payments
- Bulk reminder sending is manual and time-consuming
- Needs GST-compliant invoices for all transactions
- Wants to give credit based on payment history but has no data

**Goals:**

- Manage high volume of customers efficiently
- Send bulk reminders to all defaulters at once
- Quick GST invoice generation (50+ invoices daily)
- Staff access to record transactions
- Business insights - best customers, worst payers
- Credit decision support based on payment patterns
- Inventory tracking for high-value items

**App Usage:**

- Uses app in Gujarati
- Records 50-80 transactions daily
- Generates 50+ invoices daily
- Uses bulk reminder feature weekly
- Heavy user of reports and analytics
- Needs multi-user access

---

## 4. Problems We're Solving

| **Problem**                        | **Current Situation**                                                                                           | **Our Solution**                                                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Forgotten debts & revenue loss** | Business owners forget who owes money; customers claim they already paid; ₹15K-50K lost annually per business   | Digital ledger with automatic balance calculation, transaction history with timestamps, photo attachments as proof |
| **Delayed payments**               | No systematic way to follow up; asking for money is awkward; payments delayed 30-90 days                        | One-tap WhatsApp/SMS reminders with payment links; automated reminders; professional tone removes awkwardness      |
| **Data loss**                      | Paper khatas get lost, damaged (water, fire); Excel sheets corrupted or deleted; years of records gone          | Automatic cloud backup; multi-device access; restore anytime; bank-grade encryption                                |
| **Time wasted on calculations**    | Manual addition/subtraction errors; 30-60 mins daily calculating balances; month-end reconciliation takes hours | Automatic balance calculation; instant reports; dashboard shows overview in seconds                                |
| **Poor inventory management**      | Don't know what's in stock; stock-outs lose sales; overstocking ties up capital; manual counting is tedious     | Real-time stock tracking; low-stock alerts; automatic deduction on sales; item-wise reports                        |
| **Unprofessional invoicing**       | Handwritten bills look unprofessional; GST compliance is confusing; manual tax calculation errors               | Professional PDF invoices; automatic GST calculation; customizable templates; e-way bill support                   |
| **No business insights**           | Can't identify best customers or worst payers; no cash flow visibility; can't make data-driven decisions        | Dashboard with analytics; customer payment patterns; profit/loss reports; trend analysis                           |
| **Language barriers**              | English-only apps exclude 70% of small business owners; low literacy makes complex UIs unusable                 | 11+ Indian languages; simple UI designed for low-tech literacy; voice input support                                |
| **Requires internet always**       | Tier 2-3 cities have spotty internet; can't record transactions when offline; lose sales data                   | Offline-first architecture; record transactions without internet; auto-sync when connected                         |
| **Multi-ledger needs**             | Need separate books for business vs personal; can't track multiple business units separately                    | Create unlimited khatabooks; switch between ledgers; separate reporting per ledger                                 |
| **Staff access issues**            | Owner has to record all transactions personally; employees can't help; business bottleneck                      | Multi-user access; staff can record under owner's supervision; role-based permissions                              |
| **Payment collection friction**    | Customers have to visit physically; bank transfers need account details; cash handling is risky                 | Payment links (UPI/cards/wallets); customer pays digitally; instant confirmation; no cash handling                 |
| **No access to business credit**   | Banks won't lend without financial records; informal sector excluded from formal credit                         | Transaction history proves business viability; in-app loan applications; credit scoring based on payment patterns  |
| **Expense tracking chaos**         | Business and personal expenses mixed; can't calculate actual profit; tax filing is guesswork                    | Expense tracking by category; business vs personal separation; accurate P&L for tax filing                         |
| **Staff salary management**        | Salary advances not tracked; can't remember who got paid when; year-end is messy                                | Pagarkhata feature; track salary, advances, attendance; automated due reminders                                    |

---

## 5. Complete Feature List (Prioritized)

### P0 - Must-Have for Launch (MVP)

#### Authentication & Onboarding

- [ ] Phone number + OTP authentication (Firebase Auth or custom with Twilio/MSG91)
- [ ] Language selection at first launch (English + Hindi minimum)
- [ ] User profile setup (name, business name, business type)
- [ ] Create first khatabook during onboarding
- [ ] Terms of service and privacy policy acceptance

#### Customer/Supplier Management

- [ ] Add customer (name, phone number, opening balance)
- [ ] Add supplier (same fields as customer)
- [ ] Edit customer/supplier details
- [ ] Delete customer/supplier (with confirmation)
- [ ] Search customers by name or phone
- [ ] View customer list (sorted by name or balance)
- [ ] Import contacts from phone book
- [ ] Customer balance display (red for "you'll get", green for "you'll give")

#### Transaction Recording

- [ ] Record "You Gave" (credit/udhar) transaction
- [ ] Record "You Got" (debit/jama) transaction
- [ ] Add transaction amount with built-in numpad
- [ ] Add transaction note/description (optional)
- [ ] Attach photo to transaction (bill/receipt - camera or gallery)
- [ ] Set transaction date & time (default to now, allow past dates)
- [ ] Auto-calculate customer balance after each transaction
- [ ] View transaction in customer detail page immediately
- [ ] Edit transaction (amount, note, date, photo)
- [ ] Delete transaction (with confirmation, recalculate balance)

#### Ledger & Balance View

- [ ] Customer detail page showing all transactions
- [ ] Running balance per customer
- [ ] Overall business balance (total you'll get - total you'll give)
- [ ] Transaction history per customer (chronological, newest first)
- [ ] Filter transactions by date range
- [ ] Visual indicators (red/green for credit/debit)

#### Payment Reminders

- [ ] Send WhatsApp reminder to single customer (pre-filled message template)
- [ ] WhatsApp message includes balance amount and payment request
- [ ] Send SMS reminder to single customer (fallback if WhatsApp not installed)
- [ ] Log reminder sent (track when last reminded)
- [ ] Direct call customer from app (tap phone number to call)

#### Data Backup & Sync

- [ ] Automatic cloud backup after every transaction
- [ ] Real-time sync across multiple devices
- [ ] Data encryption in transit (HTTPS/TLS)
- [ ] Data encryption at rest (encrypted database)
- [ ] Restore data on new device login

#### Basic Dashboard

- [ ] Summary cards: Total You'll Get, Total You'll Give, Net Balance
- [ ] Today's transactions count
- [ ] Recent transactions list (last 10-20)
- [ ] Quick access to add transaction button (FAB - Floating Action Button)

#### Basic Reports

- [ ] Customer-wise balance report (who owes what)
- [ ] All transactions report with date filter
- [ ] Download report as PDF
- [ ] Basic transaction summary (total in, total out, net)

---

### P1 - Important (Build After P0)

#### Multiple Ledgers

- [ ] Create multiple khatabooks (Personal, Business 1, Business 2, etc.)
- [ ] Switch between khatabooks from sidebar
- [ ] Each khatabook has separate customers, transactions, balances
- [ ] Dashboard shows current active khatabook
- [ ] Rename/delete khatabook

#### Invoice Generation

- [ ] Generate GST invoice with GSTIN
- [ ] Generate non-GST invoice
- [ ] Invoice customization: business logo, address, contact details
- [ ] Item-wise invoice (add multiple items with qty, rate, tax %)
- [ ] Automatic CGST/SGST/IGST calculation based on state
- [ ] Invoice numbering (auto-increment, customizable prefix)
- [ ] Invoice PDF generation
- [ ] Share invoice via WhatsApp
- [ ] Email invoice option
- [ ] Print invoice (via Bluetooth printer or save PDF)
- [ ] View invoice history
- [ ] Edit/delete invoice (if not paid)
- [ ] Link invoice to customer transaction

#### Advanced Dashboard

- [ ] Charts: Weekly/Monthly transaction trends (line/bar chart)
- [ ] Top 5 customers by transaction volume
- [ ] Top 5 defaulters (highest outstanding balance)
- [ ] Month-over-month growth metrics
- [ ] Cash flow visualization

#### Payment Collection

- [ ] Generate payment link (UPI/Razorpay/Paytm)
- [ ] Accept payments via UPI
- [ ] Accept payments via cards (Razorpay/Stripe integration)
- [ ] Accept payments via wallets (Paytm, PhonePe, Google Pay)
- [ ] Payment status tracking (pending/received)
- [ ] Automatic balance update on payment received
- [ ] Payment confirmation notification to customer
- [ ] Transaction fee handling (deduct from amount or add on top)

#### Enhanced Reports

- [ ] Customer-wise detailed statement (PDF with all transactions)
- [ ] Date range filter (custom from-to dates, presets: today, this week, this month, this year)
- [ ] Party-wise balance summary
- [ ] Cash flow report (money in vs money out)
- [ ] Share reports via WhatsApp/Email
- [ ] Export data as Excel/CSV
- [ ] GST report summary (total taxable amount, total tax collected)

#### Settlement & Balancing

- [ ] "Settle Up" / "Clear Balance" button per customer
- [ ] Partial payment recording
- [ ] Settlement confirmation dialog
- [ ] Settled transaction history (archive)
- [ ] Undo settlement option

#### Security Enhancements

- [ ] Biometric authentication (fingerprint/Face ID)
- [ ] PIN/pattern lock for app
- [ ] Auto-logout after inactivity (configurable timeout)
- [ ] Two-factor authentication option

#### User Experience

- [ ] Undo last transaction (within 5 seconds)
- [ ] Swipe to delete/edit transaction
- [ ] Transaction search (by amount, note, date)
- [ ] Bulk select and delete transactions
- [ ] Dark mode support

---

### P2 - Nice to Have (Future Versions)

#### Inventory Management

- [ ] Add products/items (name, SKU, price, opening stock)
- [ ] Edit/delete products
- [ ] Track stock quantity in real-time
- [ ] Automatic stock deduction on sales invoice
- [ ] Manual stock adjustment (add/remove with reason)
- [ ] Low stock alerts (customizable threshold per item)
- [ ] Stock valuation report
- [ ] Item-wise sales report
- [ ] Barcode scanning for product entry
- [ ] Expiry date tracking (for perishables)
- [ ] Export inventory as Excel/CSV

#### Multi-Language Support

- [ ] 11+ Indian languages: Hindi, English, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Bengali, Punjabi, Odia
- [ ] Language selection at onboarding
- [ ] Change language anytime in settings
- [ ] RTL support where applicable
- [ ] Regional number formats (lakhs/crores vs thousands/millions)
- [ ] Date formats per locale

#### Offline Mode

- [ ] Local SQLite database on device
- [ ] Record transactions offline
- [ ] View past transactions offline
- [ ] Queue transactions for sync when online
- [ ] Sync status indicator (online/offline/syncing)
- [ ] Conflict resolution (if edited on multiple devices offline)
- [ ] Offline-first architecture (app works fully offline, syncs in background)

#### Expense Tracking

- [ ] Add expense entry (amount, category, note, date)
- [ ] Expense categories (rent, utilities, transport, materials, salary, etc.)
- [ ] Attach receipt photo to expense
- [ ] Business vs personal expense tagging
- [ ] Expense reports by category
- [ ] Expense vs income comparison
- [ ] Profit & loss calculation (income - expenses)
- [ ] Tax-deductible expense tagging

#### Staff/Employee Management (Pagarkhata)

- [ ] Add employee (name, phone, salary, joining date)
- [ ] Record salary payment
- [ ] Record advance given to employee
- [ ] Track outstanding advances
- [ ] Attendance tracking (mark present/absent)
- [ ] Salary due date reminders
- [ ] Employee-wise payment history
- [ ] Generate salary slip PDF

#### Bulk Operations

- [ ] Bulk reminder sending (select multiple customers, send reminder to all)
- [ ] Bulk WhatsApp messages
- [ ] Bulk SMS sending
- [ ] Filter customers by balance threshold (e.g., all customers owing >₹5000)
- [ ] Bulk transaction import (CSV upload)

#### Business Loans

- [ ] Check loan eligibility based on transaction history
- [ ] Apply for business loan within app
- [ ] Integration with NBFCs/banks (partner APIs)
- [ ] Loan application form (amount, purpose, KYC documents)
- [ ] Real-time application status tracking
- [ ] Loan approval notification
- [ ] Loan disbursement to bank account
- [ ] Loan repayment tracking
- [ ] EMI schedule view
- [ ] Credit score display

#### Advanced UX Features

- [ ] Voice input for amount entry
- [ ] Voice notes for transactions
- [ ] Built-in calculator in amount field
- [ ] Recurring transactions (auto-record monthly rent, etc.)
- [ ] Transaction templates (frequently used transaction types)
- [ ] Customizable transaction categories
- [ ] Color-coded customers (VIP, defaulter, etc.)
- [ ] Customer notes (private notes visible only to you)

#### Advanced Invoicing

- [ ] E-Way bill generation (for goods >₹50K)
- [ ] Invoice templates (multiple designs)
- [ ] Proforma invoice (quotation)
- [ ] Credit note/debit note generation
- [ ] Invoice aging report (30/60/90 days overdue)
- [ ] Payment terms customization (Net 30, Net 60, etc.)
- [ ] Multi-currency invoices (for export businesses)

#### Analytics & Insights

- [ ] Best customers by revenue
- [ ] Worst payers by days overdue
- [ ] Seasonal trend analysis
- [ ] Product-wise profitability (if inventory enabled)
- [ ] Customer lifetime value
- [ ] Churn prediction (customers who stopped transacting)
- [ ] Business health score
- [ ] Benchmark against similar businesses (anonymized)

#### Integrations

- [ ] WhatsApp Business API (official integration, not just share)
- [ ] Accounting software export (Tally, QuickBooks format)
- [ ] Google Sheets sync
- [ ] Bank account linking (auto-reconcile payments)
- [ ] Payment gateway SDKs (Razorpay, Paytm, PhonePe)

---

## 6. User Stories (By Feature Module)

### Authentication & Onboarding

- As a **new user**, I want to **sign up using only my phone number and OTP**, so that **I don't have to remember passwords and the process is quick**
- As a **new user**, I want to **select my preferred language during onboarding**, so that **I can use the app in a language I'm comfortable with**
- As a **business owner**, I want to **set up my business name and type during first launch**, so that **my invoices and reports look professional**
- As a **new user**, I want to **create my first khatabook during onboarding**, so that **I can start recording transactions immediately**
- As a **user**, I want to **review terms of service before using the app**, so that **I understand how my data will be used**

### Customer/Supplier Management

- As a **kirana store owner**, I want to **add a new customer with just their name and phone number**, so that **I can quickly create an account when they make their first credit purchase**
- As a **wholesaler**, I want to **set an opening balance when adding a customer**, so that **I can migrate existing debt from my paper khata**
- As a **business owner**, I want to **edit customer details if they change their phone number**, so that **my records stay up to date**
- As a **user**, I want to **delete a customer with confirmation**, so that **I don't accidentally lose transaction history**
- As a **wholesaler with 100+ customers**, I want to **search customers by name or phone**, so that **I can quickly find them without scrolling**
- As a **user**, I want to **import contacts from my phone book**, so that **I don't have to manually type customer details**
- As a **business owner**, I want to **see customer balance color-coded (red/green)**, so that **I can instantly tell who owes me vs who I owe**
- As a **supplier**, I want to **manage suppliers separately from customers**, so that **I can track both receivables and payables**

### Transaction Recording

- As a **kirana owner (Rajesh)**, I want to **record "You Gave" transactions when I give goods on credit**, so that **I remember who owes me money**
- As a **kirana owner (Rajesh)**, I want to **record "You Got" transactions when customer pays me back**, so that **balances are accurate**
- As a **user**, I want to **use a built-in numpad to enter amounts**, so that **entry is faster than using the phone keyboard**
- As a **business owner**, I want to **add a note to transactions (like "10kg rice")**, so that **I remember what the transaction was for**
- As a **user**, I want to **attach a photo of the bill/receipt to transactions**, so that **I have proof if there's a dispute later**
- As a **user**, I want to **set transaction date to past dates**, so that **I can record transactions I forgot to enter earlier**
- As a **user**, I want to **see the customer balance update immediately after recording**, so that **I have confidence the entry was saved correctly**
- As a **user**, I want to **edit a transaction if I made a mistake**, so that **my records are accurate without deleting and re-entering**
- As a **user**, I want to **delete a wrong transaction with confirmation**, so that **I can fix errors but don't accidentally delete important entries**
- As a **business owner**, I want to **see auto-calculated balance after every transaction**, so that **I don't have to do mental math**

### Ledger & Balance View

- As a **user**, I want to **see all transactions for a specific customer in one place**, so that **I can review our complete transaction history**
- As a **wholesaler (Karim)**, I want to **see running balance per customer**, so that **I know exactly how much each customer owes**
- As a **business owner**, I want to **see overall business balance (total receivable - total payable)**, so that **I understand my net cash position**
- As a **user**, I want to **transactions sorted chronologically (newest first)**, so that **I see recent activity first**
- As a **user**, I want to **filter transactions by date range**, so that **I can review specific time periods (like last month)**
- As a **user**, I want to **visual indicators for credit (red) and debit (green)**, so that **I can scan transactions quickly**

### Payment Reminders

- As a **kirana owner (Rajesh)**, I want to **send WhatsApp reminder with one tap**, so that **I can politely ask for payment without calling**
- As a **freelancer (Priya)**, I want to **WhatsApp reminder to include the exact balance amount**, so that **customer knows how much they owe**
- As a **user**, I want to **send SMS reminder if customer doesn't have WhatsApp**, so that **I can still remind them to pay**
- As a **business owner**, I want to **log when I sent a reminder**, so that **I don't spam customers with too many reminders**
- As a **user**, I want to **call customer directly from the app**, so that **I can discuss urgent payments**

### Data Backup & Sync

- As a **kirana owner (Rajesh)**, I want to **automatic cloud backup after every transaction**, so that **I never lose data even if my phone breaks**
- As a **business owner**, I want to **access my khatabook on multiple devices**, so that **I can check balances from my tablet or second phone**
- As a **user**, I want to **restore all my data when I login on a new device**, so that **switching phones doesn't mean losing my business records**
- As a **user concerned about privacy**, I want to **data encrypted during transmission**, so that **my business information is secure**
- As a **user**, I want to **data encrypted on servers**, so that **even if there's a breach, my data is protected**

### Dashboard (P0)

- As a **business owner**, I want to **see total receivable, payable, and net balance at a glance**, so that **I understand my business cash position in seconds**
- As a **user**, I want to **see today's transaction count**, so that **I know how active business was today**
- As a **user**, I want to **quick view of recent transactions on dashboard**, so that **I can verify my last few entries**
- As a **user**, I want to **floating action button (FAB) to add transactions**, so that **I can record entries from anywhere with one tap**

### Basic Reports (P0)

- As a **business owner**, I want to **customer-wise balance report**, so that **I can see who owes what at month-end**
- As a **user**, I want to **all transactions report with date filter**, so that **I can review specific time periods for accounting**
- As a **freelancer (Priya)**, I want to **download reports as PDF**, so that **I can share with my accountant or save for records**
- As a **user**, I want to **transaction summary (total in, total out, net)**, so that **I can quickly see cash flow**

### Multiple Ledgers (P1)

- As a **user**, I want to **create separate khatabooks for business vs personal lending**, so that **I keep business and personal finances separate**
- As a **business owner with multiple ventures**, I want to **create khatabooks for each business unit**, so that **I can track them separately**
- As a **user**, I want to **switch between khatabooks easily from sidebar**, so that **I can manage all ledgers in one app**
- As a **user**, I want to **each khatabook have separate customers and balances**, so that **accounts don't mix up**
- As a **user**, I want to **rename or delete khatabooks**, so that **I can reorganize as my business evolves**

### Invoice Generation (P1)

- As a **retailer needing GST compliance**, I want to **generate GST invoices with my GSTIN**, so that **I can provide tax invoices to customers**
- As a **small vendor**, I want to **generate non-GST invoices for small sales**, so that **I can still provide professional bills**
- As a **business owner**, I want to **add my business logo to invoices**, so that **invoices look professional and branded**
- As a **user**, I want to **item-wise invoices with quantity, rate, and tax**, so that **detailed breakdown is clear to customers**
- As a **business owner**, I want to **automatic CGST/SGST/IGST calculation**, so that **I don't make tax calculation errors**
- As a **user**, I want to **invoices numbered automatically**, so that **I maintain sequential invoice records**
- As a **freelancer (Priya)**, I want to **share invoice via WhatsApp as PDF**, so that **clients receive it instantly**
- As a **user**, I want to **view invoice history**, so that **I can resend or reference old invoices**
- As a **user**, I want to **invoices linked to customer transactions**, so that **balances auto-update when invoice is created**

### Advanced Dashboard (P1)

- As a **wholesaler (Karim)**, I want to **charts showing weekly/monthly trends**, so that **I can see if business is growing**
- As a **business owner**, I want to **see top 5 customers by volume**, so that **I can focus on my best customers**
- As a **user**, I want to **see top 5 defaulters**, so that **I know who to follow up with for payments**
- As a **business owner**, I want to **month-over-month growth metrics**, so that **I can track business performance**
- As a **user**, I want to **cash flow visualization**, so that **I understand money in vs money out trends**

### Payment Collection (P1)

- As a **business owner**, I want to **generate payment links (UPI/cards/wallets)**, so that **customers can pay me digitally**
- As a **retailer**, I want to **accept UPI payments**, so that **I don't have to handle cash**
- As a **freelancer (Priya)**, I want to **accept card payments from corporate clients**, so that **I can get paid professionally**
- As a **user**, I want to **payment status tracking**, so that **I know which links have been paid**
- As a **user**, I want to **automatic balance update when payment received**, so that **I don't have to manually record it**
- As a **customer**, I want to **payment confirmation notification**, so that **I have proof of payment**

### Enhanced Reports (P1)

- As a **business owner**, I want to **detailed customer statement with all transactions as PDF**, so that **I can send month-end statements**
- As a **user**, I want to **custom date range filters**, so that **I can get reports for any time period**
- As a **user**, I want to **share reports via WhatsApp**, so that **I can send to partners or accountants quickly**
- As a **user**, I want to **export data as Excel/CSV**, so that **I can do further analysis or backup**
- As a **GST-registered business**, I want to **GST report summary**, so that **filing returns is easier**

### Settlement (P1)

- As a **user**, I want to **"Settle Up" button to clear customer balance**, so that **I can close accounts when fully paid**
- As a **user**, I want to **record partial payments**, so that **I can track installment payments**
- As a **user**, I want to **settlement confirmation dialog**, so that **I don't accidentally clear balances**
- As a **user**, I want to **view settled transaction history**, so that **I have archive of completed accounts**
- As a **user**, I want to **undo settlement if I made a mistake**, so that **I can fix errors**

### Security Enhancements (P1)

- As a **privacy-conscious user**, I want to **fingerprint/Face ID login**, so that **only I can access my business data**
- As a **user**, I want to **PIN lock option**, so that **my data is protected if someone borrows my phone**
- As a **business owner**, I want to **auto-logout after inactivity**, so that **app locks if I forget to close it**
- As a **security-conscious user**, I want to **two-factor authentication**, so that **my account is extra secure**

### User Experience Enhancements (P1)

- As a **user prone to mistakes**, I want to **undo last transaction within 5 seconds**, so that **I can quickly fix errors**
- As a **user**, I want to **swipe to delete/edit transactions**, so that **managing entries is faster**
- As a **user**, I want to **search transactions by amount, note, or date**, so that **I can find specific entries quickly**
- As a **user**, I want to **bulk select and delete transactions**, so that **I can clean up multiple test entries at once**
- As a **user who works at night**, I want to **dark mode**, so that **the app is easier on my eyes**

### Inventory Management (P2)

- As a **retailer**, I want to **add products with name, price, and stock quantity**, so that **I can track what I have in stock**
- As a **business owner**, I want to **real-time stock tracking**, so that **I always know current inventory levels**
- As a **kirana owner (Rajesh)**, I want to **low stock alerts**, so that **I can reorder before running out**
- As a **retailer**, I want to **automatic stock deduction when I make a sale invoice**, so that **inventory updates without manual entry**
- As a **user**, I want to **stock valuation report**, so that **I know the total value of my inventory**
- As a **retailer**, I want to **item-wise sales report**, so that **I know which products sell best**

### Multi-Language Support (P2)

- As a **kirana owner (Rajesh) who speaks only Hindi**, I want to **use the app entirely in Hindi**, so that **I don't struggle with English**
- As a **Tamil-speaking retailer**, I want to **use the app in Tamil**, so that **it feels natural to use**
- As a **user**, I want to **change language anytime in settings**, so that **I can switch if I prefer a different language**
- As a **user in Gujarat**, I want to **see numbers in lakhs/crores format**, so that **amounts are easier to read**

### Offline Mode (P2)

- As a **business owner in Tier 3 city with spotty internet**, I want to **record transactions offline**, so that **poor connectivity doesn't stop my work**
- As a **user**, I want to **view past transactions offline**, so that **I can check balances even without internet**
- As a **user**, I want to **automatic sync when internet returns**, so that **I don't have to manually trigger sync**
- As a **user**, I want to **sync status indicator**, so that **I know if my data is backed up or pending sync**

### Expense Tracking (P2)

- As a **business owner**, I want to **record business expenses with category**, so that **I know where my money is going**
- As a **user**, I want to **attach receipt photos to expenses**, so that **I have proof for tax purposes**
- As a **user**, I want to **separate business and personal expenses**, so that **I can calculate true business profit**
- As a **business owner**, I want to **profit & loss calculation (income - expenses)**, so that **I know if my business is profitable**
- As a **user**, I want to **expense reports by category**, so that **I can identify areas to cut costs**

### Staff Management - Pagarkhata (P2)

- As an **employer**, I want to **add employees with salary details**, so that **I can track staff payments**
- As a **business owner**, I want to **record salary payments**, so that **I know who has been paid**
- As a **employer**, I want to **track salary advances**, so that **I can deduct from next month's salary**
- As a **business owner**, I want to **attendance tracking**, so that **salary is calculated based on days worked**
- As a **employer**, I want to **salary due reminders**, so that **I don't forget to pay staff on time**
- As a **employee**, I want to **salary slip PDF**, so that **I have proof of income**

### Bulk Operations (P2)

- As a **wholesaler (Karim) with many customers**, I want to **send bulk reminders to all defaulters**, so that **I can follow up efficiently**
- As a **business owner**, I want to **filter customers by balance threshold**, so that **I can target customers owing more than ₹5000**
- As a **user migrating from Excel**, I want to **bulk import transactions from CSV**, so that **I don't have to enter hundreds of entries manually**

### Business Loans (P2)

- As a **business owner needing capital**, I want to **check loan eligibility based on my transaction history**, so that **I know if I qualify**
- As a **small business owner**, I want to **apply for business loan within app**, so that **I don't have to visit banks**
- As a **loan applicant**, I want to **track application status in real-time**, so that **I know when to expect approval**
- As a **business owner**, I want to **loan disbursed directly to my bank account**, so that **I get funds quickly**
- As a **borrower**, I want to **track loan repayment and EMI schedule**, so that **I know my outstanding and next due date**

### Advanced UX Features (P2)

- As a **user with low typing skills**, I want to **voice input for amounts**, so that **I can speak instead of typing**
- As a **user**, I want to **built-in calculator in amount field**, so that **I can do quick math before entering**
- As a **landlord**, I want to **recurring transactions for monthly rent**, so that **I don't have to enter it manually each month**
- As a **business owner**, I want to **transaction templates for frequent transaction types**, so that **entry is faster**
- As a **user**, I want to **color-code customers (VIP, defaulter)**, so that **I can visually categorize them**

### Advanced Invoicing (P2)

- As a **goods transporter**, I want to **generate e-way bills for shipments >₹50K**, so that **I'm GST compliant**
- As a **business owner**, I want to **multiple invoice templates**, so that **I can choose designs that fit my brand**
- As a **seller**, I want to **generate proforma invoices (quotations)**, so that **I can send estimates to customers**
- As a **business owner**, I want to **credit/debit notes for returns**, so that **I can handle return transactions properly**
- As a **business owner**, I want to **invoice aging report**, so that **I can see which invoices are overdue by how many days**

### Analytics & Insights (P2)

- As a **wholesaler (Karim)**, I want to **see best customers by revenue**, so that **I can give them priority service**
- As a **business owner**, I want to **worst payers by days overdue**, so that **I know who to stop giving credit to**
- As a **retailer**, I want to **seasonal trend analysis**, so that **I can stock up before peak seasons**
- As a **business owner**, I want to **customer lifetime value**, so that **I understand long-term customer worth**
- As a **business owner**, I want to **business health score**, so that **I can see overall business performance in one metric**

---

## 7. Detailed User Flows (Step-by-Step)

### Flow 1: New User Onboarding

**Goal:** Get user from app install to recording first transaction in <2 minutes

```
1. User installs app from Play Store/App Store
   └─> App opens to splash screen (logo, loading)

2. Language Selection Screen
   ├─> Display: Grid of language options with native scripts
   │   (English, हिंदी, தமிழ், తెలుగు, मराठी, ગુજરાતી, etc.)
   ├─> User taps preferred language
   └─> Continue button becomes active

3. Phone Number Entry Screen
   ├─> Display: "Enter your mobile number" heading
   ├─> Auto-detects country code (+91 for India)
   ├─> User enters 10-digit phone number
   ├─> Validation: Must be 10 digits
   └─> "Get OTP" button enabled when valid

4. OTP Verification Screen
   ├─> SMS sent to phone with 6-digit OTP
   ├─> Display: "Enter OTP sent to +91-XXXXX-XXXXX"
   ├─> Auto-read OTP (SMS permissions) or manual entry
   ├─> Validation: 6-digit numeric
   ├─> "Resend OTP" option after 30 seconds
   └─> Auto-verify when 6 digits entered

5. Profile Setup Screen
   ├─> Display: "Tell us about yourself"
   ├─> Input: Your Name (required)
   ├─> Input: Business Name (optional, can skip)
   ├─> Dropdown: Business Type (Retail, Wholesale, Services, Other)
   └─> "Continue" button

6. Create First Khatabook Screen
   ├─> Display: "Create your first Khata Book"
   ├─> Input: Khatabook Name (pre-filled: "[Business Name] Khata" or "My Khata")
   ├─> User can edit or keep default
   └─> "Create" button

7. Permissions Request Screens
   ├─> Contacts permission: "Import customers from contacts?"
   │   (Allow / Skip)
   ├─> Notifications permission: "Get payment reminders?"
   │   (Allow / Skip)
   └─> Storage permission: "Save invoices and receipts?"
       (Allow / Skip)

8. Welcome Screen / Tutorial (Optional)
   ├─> 3-slide tutorial with illustrations:
   │   ├─> Slide 1: "Record credit and debit easily"
   │   ├─> Slide 2: "Send WhatsApp reminders"
   │   └─> Slide 3: "Your data is always backed up"
   ├─> "Skip" button on each slide
   └─> "Get Started" on last slide

9. Dashboard (Home Screen)
   ├─> Empty state: "Add your first customer to get started"
   ├─> Floating Action Button (FAB) highlighted with tooltip
   └─> User is ready to add customers and record transactions
```

**Success Criteria:** User completes onboarding in 60-90 seconds

---

### Flow 2: Adding a New Customer

**Goal:** Add customer in <20 seconds

```
1. User Initiates Add Customer
   ├─> Option A: Tap FAB → "Add Customer"
   ├─> Option B: Dashboard → "Add Customer" button (empty state)
   └─> Option C: Customers tab → "+" icon

2. Add Customer Screen Opens
   ├─> Display: Form with fields
   │   ├─> Name (required, text input)
   │   ├─> Phone Number (optional, 10-digit numeric input)
   │   ├─> Opening Balance (optional, numeric with ₹ prefix)
   │   │   └─> Toggle: "You will give" / "You will get" (default: "You will get")
   │   └─> Address (optional, text input, collapsed by default)
   └─> "Import from Contacts" button at bottom

3A. Manual Entry Path
   ├─> User types customer name (e.g., "Ramesh Kumar")
   ├─> (Optional) User adds phone number
   ├─> (Optional) User sets opening balance if migrating from paper
   └─> Tap "Save" button

3B. Import from Contacts Path
   ├─> User taps "Import from Contacts"
   ├─> Contact picker opens (filtered, searchable)
   ├─> User selects contact
   ├─> Name and phone auto-filled
   ├─> User adds opening balance if needed
   └─> Tap "Save" button

4. Validation
   ├─> If name empty → "Please enter customer name" error
   ├─> If phone invalid (not 10 digits) → "Enter valid 10-digit number" warning
   └─> If valid → Proceed to save

5. Customer Created
   ├─> Success toast: "Ramesh Kumar added"
   ├─> Customer appears in customer list
   ├─> User redirected to customer detail page (empty transaction list)
   └─> FAB visible to add first transaction
```

**Edge Cases:**

- Duplicate name → Allow (show warning: "Similar name exists")
- Duplicate phone → Warn: "This number already exists for [Name]"
- No phone number → Allow (customer can be created with name only)

---

### Flow 3: Recording "You Gave" Transaction (Credit)

**Goal:** Record credit transaction in <15 seconds

**Scenario:** Kirana owner gives ₹500 worth of groceries to Ramesh on credit

```
1. Navigate to Customer
   ├─> Option A: Dashboard → Customer list → Tap "Ramesh Kumar"
   ├─> Option B: Search → Type "Ramesh" → Tap result
   └─> Customer detail page opens

2. Initiate Transaction
   ├─> Tap "YOU GAVE" button (red button, prominent)
   └─> Transaction entry screen opens

3. Transaction Entry Screen (You Gave)
   ├─> Display: Large heading "You Gave"
   ├─> Amount field (focused, keyboard auto-opens)
   │   ├─> Numpad appears
   │   ├─> User types: 5 0 0
   │   └─> Display: "₹ 500"
   ├─> Note field (optional, collapsed)
   │   └─> User can tap to add note (e.g., "Groceries - 10kg rice, 2L oil")
   ├─> Date/Time selector (defaults to "Now")
   │   └─> User can tap to change to past date/time
   └─> Attach Photo button (camera icon)
       └─> User can tap to add bill photo

4. Optional: Add Details
   ├─> User taps note field → Keyboard opens → Types "10kg rice, 2L oil"
   ├─> User taps date → Calendar opens → Selects yesterday if needed
   └─> User taps camera icon → Camera opens → Takes photo of receipt → Photo attached

5. Save Transaction
   ├─> User taps "SAVE" button (green, bottom of screen)
   └─> Loading indicator (brief)

6. Transaction Saved
   ├─> Success animation (checkmark)
   ├─> Optional: "Send transaction SMS to customer?" prompt
   │   ├─> "Send" → SMS sent: "You took ₹500 from [Business Name] on [Date]. Balance: ₹500 you'll pay."
   │   └─> "Skip" → No SMS sent
   ├─> User returns to customer detail page
   ├─> Transaction appears at top of list:
   │   ┌─────────────────────────────────┐
   │   │ ₹500 ↑ YOU GAVE         [Date]  │
   │   │ 10kg rice, 2L oil       [Time]  │
   │   │ [Thumbnail if photo attached]   │
   │   └─────────────────────────────────┘
   └─> Customer balance updates: "₹500 You'll Get" (red text)
```

**Edge Cases:**

- Zero amount → Error: "Please enter an amount"
- Very large amount (>₹1 lakh) → Confirmation: "Are you sure? ₹1,50,000 is a large amount"
- Photo fails to upload → Saved locally, syncs later

---

### Flow 4: Recording "You Got" Transaction (Debit/Payment)

**Goal:** Record payment received in <10 seconds

**Scenario:** Ramesh pays back ₹300 in cash

```
1. Navigate to Customer
   └─> Dashboard → Customer list → Tap "Ramesh Kumar" (showing ₹500 balance)

2. Initiate Transaction
   ├─> Tap "YOU GOT" button (green button, prominent)
   └─> Transaction entry screen opens

3. Transaction Entry Screen (You Got)
   ├─> Display: Large heading "You Got"
   ├─> Amount field (focused, keyboard auto-opens)
   │   ├─> User types: 3 0 0
   │   └─> Display: "₹ 300"
   ├─> Quick suggestion chip: "₹500" (full balance)
   │   └─> User can tap to auto-fill full balance
   ├─> Payment mode selector (new in P1):
   │   └─> Cash / UPI / Card / Cheque (default: Cash)
   └─> Note field (optional): User can add "Partial payment"

4. Save Transaction
   └─> User taps "SAVE" button

5. Transaction Saved
   ├─> Success animation
   ├─> Optional: "Send payment confirmation SMS?" prompt
   │   └─> "Send" → SMS: "You paid ₹300 to [Business Name] on [Date]. Remaining: ₹200 you'll pay."
   ├─> User returns to customer detail page
   ├─> Transaction appears at top:
   │   ┌─────────────────────────────────┐
   │   │ ₹300 ↓ YOU GOT         [Date]   │
   │   │ Partial payment        [Time]   │
   │   └─────────────────────────────────┘
   └─> Customer balance updates: "₹200 You'll Get" (red, reduced)
```

**Special Case: Full Settlement**

```
If payment amount equals balance:
├─> After saving, show dialog: "Balance cleared! Mark as settled?"
├─> "Yes" → Customer moved to "Settled" section, balance = ₹0
└─> "No" → Balance shows ₹0 but customer stays active
```

---

### Flow 5: Sending Payment Reminder via WhatsApp

**Goal:** Send reminder in <5 seconds

**Scenario:** Send reminder to Ramesh who owes ₹200

```
1. Navigate to Customer
   └─> Dashboard → Customer list → Tap "Ramesh Kumar" (₹200 balance)

2. Initiate Reminder
   ├─> Option A: Tap WhatsApp icon (green) next to balance
   ├─> Option B: Tap "Remind" button at top of customer detail page
   └─> Option C: Long-press customer in list → "Send Reminder"

3. Reminder Confirmation Screen (Optional - P1 feature)
   ├─> Preview of WhatsApp message:
   │   ┌─────────────────────────────────────────┐
   │   │ Hi Ramesh Kumar,                        │
   │   │                                         │
   │   │ This is a friendly reminder from        │
   │   │ [Business Name].                        │
   │   │                                         │
   │   │ Your pending balance: ₹200              │
   │   │                                         │
   │   │ Please pay at your earliest convenience.│
   │   │                                         │
   │   │ Thank you!                              │
   │   │ [Payment Link Button - P1 feature]     │
   │   └─────────────────────────────────────────┘
   ├─> User can edit message
   ├─> "Send via WhatsApp" button
   └─> "Send via SMS" fallback option

4. Send Reminder
   ├─> User taps "Send via WhatsApp"
   └─> App checks if WhatsApp installed

5A. WhatsApp Installed Path
   ├─> WhatsApp opens with pre-filled message
   ├─> Contact: Ramesh Kumar (+91-XXXXX-XXXXX)
   ├─> Message pre-populated (user can edit before sending)
   ├─> User taps WhatsApp send button
   └─> Returns to app

5B. WhatsApp Not Installed Path
   ├─> Fallback dialog: "WhatsApp not installed. Send SMS instead?"
   ├─> "Yes" → SMS app opens with pre-filled message
   └─> "No" → Return to customer detail page

6. Reminder Logged
   ├─> Timestamp saved: "Last reminded: [Date & Time]"
   ├─> Shows in customer detail: "Reminded via WhatsApp on [Date]"
   └─> Reminder count increments (visible in customer list)
```

**Bulk Reminder Flow (P2):**

```
1. Dashboard → "Remind All" button (visible when multiple customers have balance)
2. Filter screen: "Remind customers owing more than ₹[Amount]"
3. Customer selection (multi-select, default: all with balance >₹0)
4. Tap "Send Bulk Reminder"
5. Confirmation: "Send reminder to 15 customers via WhatsApp?"
6. WhatsApp Business API sends messages (or opens WhatsApp for each - P0 version)
7. Success toast: "Reminders sent to 15 customers"
```

---

### Flow 6: Generating GST Invoice

**Goal:** Create and share invoice in <60 seconds

**Scenario:** Wholesaler creates invoice for ₹10,000 sale with GST

```
1. Navigate to Invoicing
   ├─> Bottom nav → "Invoice" tab
   └─> Or: Customer detail → "Create Invoice" button

2. New Invoice Screen
   ├─> Select Customer: "Ramesh Kumar" (dropdown/search)
   ├─> Invoice Number: Auto-filled "INV-0001" (editable)
   ├─> Date: Today (editable)
   └─> Tap "Add Items"

3. Add Invoice Items
   ├─> Item 1:
   │   ├─> Name: "Cotton Fabric" (search from inventory or type new)
   │   ├─> Quantity: 100 (meters)
   │   ├─> Rate: ₹80/meter
   │   ├─> Tax: 12% GST (dropdown: 0%, 5%, 12%, 18%, 28%)
   │   └─> Subtotal auto-calculates: ₹8,000
   ├─> Tap "+ Add Item" to add more
   ├─> Item 2: "Silk Fabric" - 20m @ ₹100/m - 12% GST = ₹2,000
   └─> Total shown at bottom:
       ├─> Subtotal: ₹10,000
       ├─> CGST (6%): ₹600
       ├─> SGST (6%): ₹600
       └─> Total: ₹11,200

4. Invoice Details (Optional)
   ├─> Tap "Invoice Settings" (gear icon)
   ├─> Add/Edit Business Details:
   │   ├─> Business Name
   │   ├─> GSTIN: XXGSTXXXXXXXX (validated format)
   │   ├─> Address
   │   └─> Logo (upload)
   ├─> Payment Terms: "Net 30" (dropdown)
   ├─> Notes: "Thank you for your business"
   └─> Save settings (persists for future invoices)

5. Preview Invoice
   ├─> Tap "Preview" button
   ├─> PDF preview loads showing:
   │   ├─> Header: Business name, logo, GSTIN, address
   │   ├─> Invoice #, Date, Customer details
   │   ├─> Table: Items, Qty, Rate, Tax, Amount
   │   ├─> Tax breakdown: CGST/SGST/IGST
   │   └─> Total in words: "Rupees Eleven Thousand Two Hundred Only"
   └─> User reviews

6. Save & Share
   ├─> Tap "Save Invoice" → Invoice saved to database
   ├─> Transaction auto-created: "₹11,200 You'll Get" linked to Ramesh
   ├─> Share options appear:
   │   ├─> WhatsApp (most common)
   │   ├─> Email
   │   ├─> Print (Bluetooth printer)
   │   └─> Save PDF to device
   └─> User selects WhatsApp

7. WhatsApp Share
   ├─> PDF generated and saved temporarily
   ├─> WhatsApp opens with:
   │   ├─> Contact: Ramesh Kumar
   │   ├─> Attached: INV-0001.pdf
   │   └─> Message: "Hi Ramesh, here's your invoice for ₹11,200. Thank you!"
   └─> User sends via WhatsApp

8. Post-Invoice
   ├─> Invoice appears in "Invoices" tab
   ├─> Customer balance updated (+₹11,200)
   └─> Transaction history shows invoice link
```

**Non-GST Invoice:** Same flow but skip GSTIN field, no tax breakdown

---

### Flow 7: Viewing Reports & Downloading PDF

**Goal:** Generate and share monthly report

```
1. Navigate to Reports
   └─> Bottom nav → "Reports" tab

2. Reports Dashboard
   ├─> Report types displayed as cards:
   │   ├─> Customer Balance Report
   │   ├─> Transaction Report
   │   ├─> Cash Flow Report
   │   ├─> GST Report
   │   └─> Profit & Loss (P2)
   └─> User selects "Transaction Report"

3. Configure Report
   ├─> Date Range Selector:
   │   ├─> Presets: Today, This Week, This Month, This Year
   │   ├─> Custom: From [Date] To [Date]
   │   └─> User selects "This Month"
   ├─> Filter Options (expandable):
   │   ├─> Customer: All / Specific customer
   │   ├─> Transaction Type: All / You Gave / You Got
   │   └─> Amount Range: Min ₹___ to Max ₹___
   └─> Tap "Generate Report"

4. Report Generated
   ├─> Loading indicator (2-3 seconds for large datasets)
   ├─> Report displayed on screen:
   │   ┌─────────────────────────────────────┐
   │   │ Transaction Report                  │
   │   │ Period: 1 Mar 2026 - 31 Mar 2026   │
   │   ├─────────────────────────────────────┤
   │   │ Summary:                            │
   │   │ Total You Gave: ₹1,25,000           │
   │   │ Total You Got: ₹95,000              │
   │   │ Net: ₹30,000 (You'll Get)           │
   │   ├─────────────────────────────────────┤
   │   │ Transactions: (150 entries)         │
   │   │ [List view with scroll]             │
   │   └─────────────────────────────────────┘
   └─> Options: Download PDF / Share / Export Excel

5. Download PDF
   ├─> User taps "Download PDF"
   ├─> PDF generation (3-5 seconds)
   ├─> Success: "Report saved to Downloads/Khatabook/"
   └─> Options: Open PDF / Share

6. Share Report
   ├─> User taps "Share"
   ├─> Share sheet opens: WhatsApp, Email, Drive, etc.
   ├─> User selects WhatsApp → Accountant contact
   └─> PDF attached and sent
```

---

### Flow 8: Multi-Device Sync

**Goal:** Access same data on second device

```
1. User Logs In on New Device
   ├─> Install app on Device 2 (tablet)
   ├─> Open app → Language selection
   ├─> Enter same phone number (+91-98765-43210)
   └─> Enter OTP

2. Sync Detection
   ├─> Backend detects existing account
   ├─> Dialog: "Welcome back! Your data is ready to sync."
   ├─> Display: Last synced device info (Device 1, last active: 2 hours ago)
   └─> "Restore Data" button

3. Data Sync
   ├─> User taps "Restore Data"
   ├─> Progress indicator:
   │   ├─> Downloading customers... (50/50)
   │   ├─> Downloading transactions... (1,234/1,234)
   │   ├─> Downloading invoices... (25/25)
   │   └─> Syncing complete ✓
   └─> Estimated time: 10-30 seconds (depends on data volume)

4. Sync Complete
   ├─> Dashboard loads with all data
   ├─> User sees identical data as Device 1
   ├─> Real-time sync indicator in top bar: "Synced 2 seconds ago"
   └─> Any changes on Device 2 sync to Device 1 immediately

5. Ongoing Sync
   ├─> User adds transaction on Device 2
   ├─> Auto-sync triggered (background)
   ├─> Device 1 receives update via push notification or on next open
   └─> Sync status: "All changes synced"
```

**Conflict Resolution (Edge Case):**

```
If both devices edit same transaction offline:
├─> Conflict detected on sync
├─> Dialog: "This transaction was edited on another device. Which version to keep?"
├─> Show both versions side-by-side
├─> User selects correct version
└─> Conflict resolved, other device updated
```

---

### Flow 9: Offline Transaction Recording & Sync

**Goal:** Work without internet, sync when connected

```
1. User Loses Internet Connection
   ├─> App detects offline mode
   └─> Top bar indicator: "Offline - Data will sync when online" (yellow banner)

2. Record Transaction Offline
   ├─> User navigates to customer "Ramesh"
   ├─> Taps "YOU GAVE" → Enters ₹500
   ├─> Taps "SAVE"
   └─> Transaction saved to local SQLite database

3. Offline Confirmation
   ├─> Success: "Transaction saved (will sync when online)"
   ├─> Sync queue indicator: "1 pending sync" (icon in top bar)
   ├─> Transaction visible immediately in local view
   └─> Balance updated locally

4. Multiple Offline Actions
   ├─> User continues working: adds 5 more transactions, 2 customers
   ├─> Sync queue: "7 pending sync"
   └─> All data stored locally, app functions normally

5. Internet Reconnects
   ├─> App detects connection
   ├─> Auto-sync starts (background)
   ├─> Progress notification: "Syncing 7 changes..."
   └─> Completion: "All changes synced" (green checkmark)

6. Sync Success
   ├─> Top bar returns to normal (yellow banner disappears)
   ├─> Sync queue cleared: "0 pending"
   ├─> Cloud backup updated
   └─> Other devices receive updates

7. Manual Sync Trigger (Optional)
   ├─> User can swipe down on dashboard to refresh/sync
   └─> Useful if auto-sync fails or user wants to force immediate sync
```

**Edge Case: Large Attachment Offline**

```
User attaches 5MB photo to transaction while offline:
├─> Transaction saved with photo reference
├─> Photo saved to local storage
├─> When online, sync queue shows: "Uploading 1 photo..."
├─> Upload progress: "50% - 2.5MB/5MB"
└─> Success: "Photo uploaded, transaction synced"
```

---

## 8. Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APPS                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │   iOS App            │  │   Android App         │        │
│  │   (React Native)     │  │   (React Native)      │        │
│  └──────────┬───────────┘  └──────────┬────────────┘        │
│             │                          │                      │
│             └──────────┬───────────────┘                      │
│                        │                                      │
│             ┌──────────▼───────────┐                         │
│             │  Offline Storage     │                         │
│             │  (SQLite + AsyncStorage)                       │
│             └──────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                         │
                    HTTPS/TLS
                         │
┌─────────────────────────▼───────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER               │
│                    (NGINX / AWS ALB)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              NODE.JS BACKEND (MODULAR MONOLITH)              │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Module  │  │Ledger Module │  │Invoice Module│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Inventory Mod │  │Notification  │  │ Reports Mod  │      │
│  └──────────────┘  │   Module     │  └──────────────┘      │
│                    └──────────────┘                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Payment Mod  │  │  Loans Mod   │  │  Sync Engine │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
┌───────▼────────┐ ┌──────▼──────┐ ┌───────▼────────┐ ┌──────▼──────┐
│  PostgreSQL    │ │    Redis    │ │  S3 / Cloud    │ │    Bull     │
│  (Primary DB)  │ │  (Cache +   │ │    Storage     │ │ (Job Queue) │
│                │ │   Sessions) │ │  (Files/PDFs)  │ │             │
└────────────────┘ └─────────────┘ └────────────────┘ └─────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
┌───────▼────────┐ ┌──────▼──────┐ ┌───────▼────────┐ ┌──────▼──────┐
│  SMS Gateway   │ │  WhatsApp   │ │    Payment     │ │    Loan     │
│ (Twilio/MSG91) │ │Business API │ │   Gateways     │ │   Partners  │
│                │ │             │ │(Razorpay/Paytm)│ │  (NBFCs)    │
└────────────────┘ └─────────────┘ └────────────────┘ └─────────────┘
```

### Module Structure (Backend)

Modular Monolith approach - organized by domain modules:

- `modules/auth` - Authentication & user management
- `modules/ledger` - Customers, transactions, balance tracking
- `modules/invoicing` - Invoice generation, GST calculations
- `modules/inventory` - Product/stock management
- `modules/notifications` - SMS, WhatsApp, push notifications
- `modules/reports` - Report generation, analytics
- `modules/payments` - Payment gateway integration
- `modules/loans` - Business loan application & tracking
- `modules/sync` - Offline sync engine

### Module Structure (Mobile - React Native)

```
src/
├── screens/          # Screen components
├── components/       # Reusable UI components
├── navigation/       # Navigation structure
├── store/           # State management (Redux/Zustand)
├── services/        # API clients, database, sync
├── utils/           # Helper functions
├── hooks/           # Custom React hooks
├── localization/    # i18n translations
└── theme/           # Design system (colors, typography)
```

### Technology Stack Details

#### Mobile (React Native)

- **Framework:** React Native 0.73+
- **Language:** TypeScript
- **State Management:** Redux Toolkit + RTK Query
- **Navigation:** React Navigation 6.x
- **Offline Storage:** SQLite + AsyncStorage
- **UI Library:** React Native Paper / Native Base
- **Internationalization:** i18next
- **Biometric Auth:** react-native-biometrics
- **Push Notifications:** Firebase Cloud Messaging

#### Backend (Node.js)

- **Runtime:** Node.js 20+ LTS
- **Framework:** Express.js 4.x
- **Language:** TypeScript
- **ORM:** Prisma / TypeORM / Sequelize
- **Validation:** Joi / Zod
- **Authentication:** JWT + Firebase Auth SDK
- **Testing:** Jest + Supertest
- **Logging:** Winston + Morgan

#### Database & Storage

- **Primary Database:** PostgreSQL 15+
- **Caching:** Redis 7+
- **File Storage:** AWS S3 / DigitalOcean Spaces
- **CDN:** CloudFront / Cloudflare
- **Job Queue:** Bull (Redis-based)

#### Infrastructure

- **Hosting:** AWS / DigitalOcean
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, New Relic/Datadog
- **SSL:** Let's Encrypt / AWS Certificate Manager

### Design System (UI/UX - Pixel-Perfect Khatabook Clone)

**Color Palette:**

- Primary Red: #FF4444 (You Gave / Credit)
- Primary Green: #00C853 (You Got / Debit)
- Primary Blue: #2196F3 (Actions)
- Background: #F5F5F5
- Card Background: #FFFFFF
- Text: #212121 (primary), #757575 (secondary)
- WhatsApp Green: #25D366

**Typography:**

- Font Family: Inter / Roboto
- Heading 1: 24px Bold
- Body: 14px Regular
- Amount Display: 28px Bold

**Component Library:**

- Bottom Tab Navigation
- Floating Action Button (FAB)
- Cards with shadow elevation
- Large touch targets (min 44x44 dp)
- Swipe actions
- Pull-to-refresh

---

## 9. Data Models (PostgreSQL Schema)

_(See full database schema in implementation plan - includes 17 tables: users, khatabooks, customers, transactions, invoices, invoice_items, products, stock_movements, payments, reminders, expenses, employees, salary_payments, loans, loan_repayments, sync_metadata, audit_logs)_

**Key Tables:**

- **users** - User accounts, authentication
- **khatabooks** - Separate ledgers per user
- **customers** - Customer/supplier records
- **transactions** - Credit/debit entries
- **invoices** - GST/non-GST invoices
- **products** - Inventory items
- **payments** - Payment gateway transactions
- **sync_metadata** - Offline sync tracking

---

## 10. API Design (High-Level)

**Base URL:** `https://api.khatabook-clone.com/v1`

**Authentication:** JWT Bearer tokens

**Key Endpoint Categories:**

### Authentication

- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP, get JWT token
- `POST /auth/refresh-token` - Refresh access token

### Khatabooks

- `GET /khatabooks` - List all khatabooks
- `POST /khatabooks` - Create new khatabook
- `GET /khatabooks/:id` - Get khatabook details
- `PUT /khatabooks/:id` - Update khatabook
- `DELETE /khatabooks/:id` - Delete khatabook

### Customers

- `GET /khatabooks/:id/customers` - List customers
- `POST /khatabooks/:id/customers` - Add customer
- `GET /khatabooks/:id/customers/:id` - Get customer details
- `GET /khatabooks/:id/customers/search?q=` - Search customers

### Transactions

- `GET /khatabooks/:id/transactions` - List transactions
- `POST /khatabooks/:id/transactions` - Create transaction
- `PUT /khatabooks/:id/transactions/:id` - Update transaction
- `DELETE /khatabooks/:id/transactions/:id` - Delete transaction

### Invoices

- `GET /khatabooks/:id/invoices` - List invoices
- `POST /khatabooks/:id/invoices` - Create invoice
- `GET /khatabooks/:id/invoices/:id/pdf` - Download invoice PDF

### Reports

- `GET /khatabooks/:id/reports/balance` - Customer balance report
- `GET /khatabooks/:id/reports/transactions` - Transaction report
- `POST /khatabooks/:id/reports/export` - Export report as PDF/Excel

### Sync

- `POST /sync/push` - Push local changes to server
- `POST /sync/pull` - Pull server changes to device

**Response Format:**

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Optional message"
}
```

**Error Format:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": []
  }
}
```

---

## 11. Security & Compliance

### Data Security

**Encryption:**

- TLS 1.3 for all API communication
- AES-256 encryption for sensitive data at rest
- Encrypted database backups
- SQLite encryption on mobile (SQLCipher)

**Authentication:**

- Phone + OTP (mandatory)
- JWT access tokens (24hr) + refresh tokens (30 days)
- Biometric authentication (optional)
- PIN/Pattern lock (optional)

**Access Control:**

- Users can only access their own khatabooks
- API-level permission checks
- Role-based access (Owner, Staff - future)

**Audit Logging:**

- All data modifications logged
- Login/logout events tracked
- Retention: 2 years

### Compliance

**Indian Regulations:**

- **GST Compliance:** Invoice format per CBIC guidelines, HSN codes, tax calculations
- **RBI Guidelines:** Payment gateway compliance, data localization
- **IT Act 2000:** Electronic records validity

**Data Protection:**

- Privacy policy & terms acceptance
- Data portability (export all data)
- Right to deletion (30-day grace period)
- Data retention: Active unlimited, deleted 30 days

**Security Practices:**

- Input validation (XSS, SQL injection prevention)
- Rate limiting (login, OTP, API calls)
- DDoS protection (Cloudflare)
- Regular security audits
- Vulnerability scanning

---

## 12. Third-Party Integrations

### Essential Integrations (P0)

| Service                | Purpose        | Provider      | Priority |
| ---------------------- | -------------- | ------------- | -------- |
| **Authentication**     | Phone OTP      | Firebase Auth | P0       |
| **SMS Gateway**        | OTP, reminders | MSG91         | P0       |
| **Cloud Storage**      | Files, PDFs    | AWS S3        | P0       |
| **Push Notifications** | Alerts         | Firebase FCM  | P0       |

### Important Integrations (P1)

| Service                   | Purpose             | Provider           | Priority |
| ------------------------- | ------------------- | ------------------ | -------- |
| **Payment Gateway**       | UPI, cards, wallets | Razorpay           | P1       |
| **WhatsApp Business API** | Auto-messages       | Gupshup            | P1       |
| **Email Service**         | Invoice delivery    | AWS SES            | P1       |
| **PDF Generation**        | Invoices, reports   | Puppeteer          | P1       |
| **Error Monitoring**      | Crash tracking      | Sentry             | P1       |
| **Analytics**             | Usage tracking      | Firebase Analytics | P1       |

### Advanced Integrations (P2)

| Service              | Purpose          | Provider              | Priority |
| -------------------- | ---------------- | --------------------- | -------- |
| **Business Loans**   | Lending          | NBFCs (Capital Float) | P2       |
| **GST Verification** | GSTIN validation | ClearTax API          | P2       |
| **OCR**              | Receipt scanning | Google Vision API     | P2       |
| **Translation**      | Multi-language   | Google Translate API  | P2       |

---

## 13. Multi-Language Support Strategy

### Supported Languages

**Phase 1 (P0):** English, Hindi
**Phase 2 (P1):** Tamil, Telugu, Marathi, Gujarati, Kannada
**Phase 3 (P2):** Malayalam, Bengali, Punjabi, Odia

**Total: 11+ languages (matching Khatabook)**

### Implementation

**Framework:** `react-i18next` (React Native)

**Translation Structure:**

```
src/localization/
├── en.json    # English (source)
├── hi.json    # Hindi
├── ta.json    # Tamil
└── ... (other languages)
```

**Number & Currency Formatting:**

- Indian format: `1,25,000` (lakhs/crores)
- Currency: `₹1,250.50`
- Regional number formats per locale

**Date & Time Formatting:**

- India: DD/MM/YYYY
- 12-hour format with AM/PM
- Localized month names

**Font Support:**

- System fonts for all Indian scripts
- Noto Sans family for consistency

**Translation Workflow:**

1. Developers write strings in English
2. Professional translation service (Gengo/Lokalise)
3. Native speaker review
4. Continuous updates for new features

---

## 14. Offline-First Architecture

### Overview

**Goal:** App must function fully offline for core features, with seamless sync when connectivity returns.

**Principle:** "Local-first, sync later"

### Architecture

**Local Database:** SQLite (encrypted via SQLCipher)
**Sync Engine:** Push/Pull with conflict resolution
**Queue System:** Pending operations tracked in sync queue

### Key Components

**1. Network Status Monitor**

- Detects online/offline state
- Triggers sync when connectivity returns

**2. Sync Queue Manager**

- Queues all operations (create, update, delete)
- Prioritizes operations
- Retries failed syncs

**3. Sync Engine**

- Push: Sends local changes to server
- Pull: Fetches server changes to local
- Conflict Resolution: Last-write-wins (default)

### User Experience

**Offline Indicator:**

- Yellow banner: "Offline - Data will sync when online"
- Sync queue count: "5 pending sync"

**Sync Status:**

- Green checkmark: "All changes synced"
- Orange clock: "Syncing..."
- Red exclamation: "Sync failed"

**Transaction Flow (Offline):**

1. User records transaction → Saved to SQLite immediately
2. User sees success → Balance updates locally
3. Transaction added to sync queue
4. When online → Auto-sync to server
5. Conflict resolution (if needed)

---

## 15. Testing Strategy

### Testing Pyramid

**60% Unit Tests**

- Business logic (services)
- Utility functions
- Validators

**30% Integration Tests**

- Database + service integration
- API endpoint tests
- Sync logic tests

**10% E2E Tests**

- Critical user flows (Detox)
- Onboarding
- Transaction recording
- Invoice generation
- Offline mode

### Test Coverage Target

**80%+ code coverage minimum**

### Key Testing Areas

**Functional Testing:**

- All P0 features end-to-end
- All P1 features end-to-end
- Edge cases (large amounts, long names, etc.)

**Performance Testing:**

- App launch time: <2s
- API response time: P95 <200ms
- Sync duration: <3s for 1000 transactions

**Security Testing:**

- SQL injection prevention
- XSS prevention
- Authentication bypass attempts
- Rate limiting validation

**Accessibility Testing:**

- Screen reader compatibility
- Touch target sizes (min 44x44 dp)
- Color contrast

**Localization Testing:**

- All languages have complete translations
- Number/date formatting per locale
- No text overflow

**Beta Testing:**

- Closed beta: 50-100 users, 4 weeks
- Public beta: 2,000-5,000 users, 4 weeks
- Collect feedback, fix bugs, iterate

---

## 16. Success Metrics & KPIs

### User Acquisition & Growth

| Metric               | Month 1 | Month 6 | Year 1  |
| -------------------- | ------- | ------- | ------- |
| Total Signups        | 1,000   | 25,000  | 100,000 |
| Daily Active Users   | 300     | 10,000  | 40,000  |
| Monthly Active Users | 800     | 20,000  | 80,000  |
| DAU/MAU Ratio        | 35%+    | 40%+    | 45%+    |

### Engagement & Retention

| Metric                    | Target           |
| ------------------------- | ---------------- |
| Session Length            | 3-5 mins average |
| Transactions per User/Day | 5-15             |
| Day 1 Retention           | 60%+             |
| Day 7 Retention           | 40%+             |
| Day 30 Retention          | 25%+             |

### Feature Adoption

| Feature               | Target Adoption |
| --------------------- | --------------- |
| Customer Creation     | 90% of users    |
| Transaction Recording | 85% of users    |
| WhatsApp Reminder     | 50% of users    |
| Invoice Generation    | 30% of users    |
| Payment Collection    | 20% of users    |

### Technical Performance

| Metric            | Target | P95 Target |
| ----------------- | ------ | ---------- |
| App Launch Time   | <2s    | <3s        |
| API Response Time | <100ms | <200ms     |
| Crash-Free Users  | 99.5%+ | -          |
| Server Uptime     | 99.9%+ | -          |

### Quality Metrics

| Metric            | Target |
| ----------------- | ------ |
| App Store Rating  | 4.5+   |
| NPS Score         | 50+    |
| Crash Rate        | <0.5%  |
| Sync Success Rate | 99%+   |

### Analytics Implementation

**Event Tracking:**

- User lifecycle (signup, login, churn)
- Feature usage (transaction created, invoice generated, reminder sent)
- Errors (sync failed, payment failed)

**User Properties:**

- Business type, language, premium status
- Customer count, transaction count
- Days active, retention cohort

---

## 17. Launch Phases & Timeline

### Phase 0: Foundation & Setup

**Duration:** 2 weeks

- Project setup, CI/CD, infrastructure
- Database schema, API scaffolding
- Design system, authentication flow

### Phase 1: MVP Development (P0 Features)

**Duration:** 8 weeks (Sprints 1-4)

- Sprint 1-2: Authentication, customer management
- Sprint 3-4: Transaction recording, sync engine

### Phase 2: P0 Completion

**Duration:** 4 weeks (Sprints 5-6)

- Sprint 5: Reminders, basic reports
- Sprint 6: Data backup, polish

### Phase 3: Internal Testing

**Duration:** 2 weeks

- Team testing, QA regression
- Bug fixes, performance optimization

### Phase 4: Closed Beta

**Duration:** 4 weeks

- 50-100 real business owners
- Collect feedback, iterate
- Fix critical bugs

### Phase 5: P1 Feature Development

**Duration:** 6 weeks (Sprints 7-9)

- Sprint 7-8: Invoicing, multiple ledgers
- Sprint 9: Payment integration, advanced dashboard

### Phase 6: Public Beta (Soft Launch)

**Duration:** 4 weeks

- Limited geographical rollout (2-3 cities)
- Target: 2,000-5,000 users
- Monitor, optimize, fix bugs

### Phase 7: Multi-Language & P2 Features

**Duration:** 6 weeks (Sprints 10-12)

- Sprint 10-11: 11 languages, translations
- Sprint 12: Inventory, offline refinement

### Phase 8: Full Public Launch

**Duration:** 2 weeks preparation + Launch

- App Store submissions (production)
- Marketing materials, press release
- Support team ready
- Launch Day: Go live to all India

### Phase 9: Post-Launch Optimization

**Duration:** 3-6 months

- Performance optimization
- Bug fixes, feature education
- Marketing campaigns
- Advanced features (expenses, staff, loans)

### Timeline Summary

**Total to Full Launch:** ~27 weeks (6.5 months)
**Total to Stable Product:** ~50 weeks (12 months)

### Go/No-Go Criteria for Launch

**Must Have:**

- ✅ All P0 features working
- ✅ <0.5% crash rate
- ✅ 99.5% API uptime
- ✅ Zero critical bugs
- ✅ Positive beta feedback (NPS >40)
- ✅ Security audit passed

---

## Appendix

### Sources & References

- [Khatabook website](https://khatabook.com/)
- [Khatabook Android App - Google Play](https://play.google.com/store/apps/details?id=com.vaibhavkalpe.android.khatabook&hl=en_IN)
- [Khatabook iOS App - App Store](https://apps.apple.com/in/app/khatabook-vyapar-app/id1488204139)
- [Khatabook Features Blog](https://khatabook.com/blog/khatabook-app-features/)
- [GST Billing Software Guide](https://khatabook.com/blog/gst-billing-software/)
- [Khatabook vs Vyapar Comparison](https://www.mooninvoice.com/blog/khatabook-vs-vyapar/)

### Document Control

| Version | Date       | Author       | Changes                                                |
| ------- | ---------- | ------------ | ------------------------------------------------------ |
| 1.0     | 2026-04-03 | Product Team | Initial PRD - Complete design ready for implementation |

---

**END OF DOCUMENT**

_This PRD is a living document and will be updated as the product evolves. All sections have been reviewed and approved for implementation._
