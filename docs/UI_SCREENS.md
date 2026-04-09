# Khatabook Clone - Screen Specification Document

**Document Version:** 1.0
**Date:** April 3, 2026
**Author:** UI/UX Design Team
**Status:** Design Approved - Ready for Implementation
**Design Approach:** Component-First Specifications

---

## Implementation Notice

This document provides complete React Native (Expo) UI specifications for the Khatabook Android app. All screens use React Native components (View, Text, FlatList, TouchableOpacity, etc.) with exact styling to match the production Android app design.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design System Foundation](#2-design-system-foundation)
3. [Reusable Components Library](#3-reusable-components-library)
4. [Screen Specifications](#4-screen-specifications)
5. [Navigation Map & Flow](#5-navigation-map--flow)
6. [State Patterns](#6-state-patterns)
7. [Implementation Checklist](#7-implementation-checklist)

---

## 1. Executive Summary

### Purpose

This document provides complete UI/UX specifications for all screens in the Khatabook Clone mobile application. It defines layouts, components, interactions, and navigation flows for a pixel-perfect clone of the original Khatabook app.

### Design Approach

**Component-First Specification** - Define reusable UI components once, then compose screens from these building blocks. This approach:

- Matches React Native development patterns
- Ensures visual consistency across screens
- Simplifies maintenance (update component = update all screens)
- Reduces specification length while maintaining completeness

### Key Design Decisions

| Decision              | Choice                                      | Rationale                                 |
| --------------------- | ------------------------------------------- | ----------------------------------------- |
| **Visual Style**      | Pixel-perfect Khatabook clone               | PRD requirement (line 75)                 |
| **Dashboard Layout**  | Cards-first with customer list              | Matches original Khatabook exactly        |
| **Transaction Entry** | Two-button pattern (You Gave/You Got)       | Simplest for low-tech literacy users      |
| **Navigation**        | Bottom tabs + FAB                           | Standard mobile pattern, confirmed in PRD |
| **Color System**      | Red (credit), Green (debit), Blue (actions) | PRD design system (lines 1452-1459)       |
| **Component Library** | 12 reusable components                      | Covers all UI patterns needed             |

### Screen Inventory

**Total Screens:** 18 (includes modals)

**By Priority:**

- P0 (MVP): 12 screens (Auth flow including language + core features)
- P1 (Important): 4 screens (Invoice, Analytics, Payment Link, Switcher modal)
- P2 (Nice to Have): 2 screens (Inventory management)

**By Category:**

- Authentication: 4 screens
- Main App: 5 screens
- Transactions: 2 screens
- Invoicing: 2 screens (P1)
- Inventory: 2 screens (P2)
- System: 1 screen (Settings, Error)

---

## 2. Design System Foundation

### Color Palette (Exact Khatabook Android App Colors)

**Primary Colors:**

```javascript
const COLORS = {
  primaryBlue: '#2C60E4', // Header backgrounds, primary buttons, links, active states
  creditGreen: '#1FAF38', // All "You Got" / money received elements
  debitRed: '#E53935', // All "You Gave" / money given elements
  statusBar: '#2350C8', // Android status bar (darker shade of primary)
  whatsappGreen: '#25D366', // WhatsApp-specific actions only
};
```

**Neutral Colors:**

```javascript
const NEUTRALS = {
  backgroundGray: '#F2F2F2', // Screen backgrounds
  cardWhite: '#FFFFFF', // Card surfaces, input backgrounds
  textPrimary: '#212121', // Headings, main content
  textSecondary: '#757575', // Labels, hints, timestamps
  textTertiary: '#BDBDBD', // Placeholder text
  divider: '#E0E0E0', // List separators, card borders
};
```

**Semantic Colors:**

```javascript
const SEMANTIC = {
  success: '#1FAF38', // Same as creditGreen
  error: '#E53935', // Same as debitRed
  warning: '#FF9800', // Low stock, overdue alerts, offline banner
};
```

**Usage Guidelines:**

- Use Primary Red for all "You'll Get" (receivable) amounts
- Use Primary Green for all "You'll Give" (payable) amounts
- Use Primary Blue for all interactive elements (buttons, links, FAB)
- Use WhatsApp Green only for WhatsApp-related actions
- Never use red/green for non-financial meanings (avoid confusion)

---

### Typography Scale

**Font Family:** Inter (fallback: Roboto, System Default)

**Scale:**

```
Display (Amounts):  28px / Line Height 32px, Bold, #212121
Heading 1:          24px / 28px, Bold, #212121
Heading 2:          20px / 24px, SemiBold, #212121
Heading 3:          16px / 20px, SemiBold, #212121
Body Large:         16px / 22px, Regular, #212121
Body:               14px / 20px, Regular, #212121
Body Small:         12px / 16px, Regular, #757575
Caption:            11px / 14px, Regular, #757575
Button:             16px / 20px, SemiBold, #FFFFFF
```

**Currency Formatting:**

- Indian format with lakhs/crores: ₹1,25,000 (not ₹125,000)
- Always include ₹ symbol prefix
- Use commas for thousands separators
- Decimals: Show .00 for whole numbers in invoices, hide in summaries
- Large amounts: ₹1.25L (lakh), ₹1.5Cr (crore) in compact views

---

### Spacing Scale (8px Base Grid)

```
Space 1:  4px   → Tight spacing within components
Space 2:  8px   → Default gap between related items
Space 3:  12px  → Card padding, small margins
Space 4:  16px  → Standard padding, medium margins, screen edges
Space 5:  20px  → Large padding
Space 6:  24px  → Section spacing
Space 8:  32px  → Major section spacing
```

**Application:**

- Screen horizontal padding: 16px
- Card padding: 16px
- List item padding: 12px vertical, 16px horizontal
- Gap between cards: 12px
- Section margin-bottom: 24px

---

### Elevation (Shadow Levels)

```
Level 0:  No shadow                           → Flat elements, dividers
Level 1:  0 1px 3px rgba(0,0,0,0.12)         → Cards on tap, subtle lift
Level 2:  0 2px 6px rgba(0,0,0,0.16)         → Cards, summary cards, list items
Level 3:  0 4px 12px rgba(0,0,0,0.24)        → FAB, important CTAs
Level 4:  0 8px 16px rgba(0,0,0,0.32)        → Modals, bottom sheets, dialogs
```

---

### Border Radius

```
Small:  4px   → Tags, chips, small elements
Medium: 8px   → Cards, buttons, inputs
Large:  12px  → Modals, bottom sheets
Round:  50%   → FAB, avatars, icon buttons
```

---

### Touch Targets & Sizing

```
Minimum Touch Target:  44 x 44 dp  → Accessibility standard
Button Height:         48px        → Standard action buttons
FAB Size:             56 x 56 dp   → Floating action button
List Item Height:      56px        → Minimum (single line)
List Item Height:      72px        → With subtitle or metadata
Icon Size:            24 x 24 dp   → Navigation, actions
Avatar Size:          40 x 40 dp   → Customer/user avatars
```

---

### Icon Library

**Recommended Icon Packs (Use Standard Libraries):**

- **Primary:** Material Icons (Google Material Design)
- **Alternative:** Feather Icons, Ionicons, React Native Vector Icons
- **Custom:** Design simple custom icons for brand-specific needs

**Icon Usage Guidelines:**

```
Navigation Icons (24x24 dp):
  - home, people, chart-bar, settings (Material Icons names)

Action Icons (24x24 dp):
  - search, more-vert (⋮), phone, message (WhatsApp)
  - camera, image, calendar, edit, delete

Transaction Icons (16x16 dp):
  - arrow-up (You Gave), arrow-down (You Got)
  - attachment (photo), invoice, payment

Status Icons (16x16 dp):
  - checkmark (success), warning (error), info, sync

Empty State Icons (64x64 dp):
  - Use emoji or large Material Icons
  - people-outline, receipt-outline, inventory, search
```

**Note:** Do NOT use any Khatabook proprietary icons. All icons should be from standard open-source icon libraries or designed generically.

---

## 3. Reusable Components Library

### Component 1: Summary Card

**Purpose:** Display financial summary metrics (receivable, payable, net balance)

**Variants:**

- Receivable Card (You'll Get)
- Payable Card (You'll Give)
- Net Balance Card

**Structure:**

```
┌─────────────────────────────┐
│ LABEL TEXT (11px, #757575)  │
│ ₹ AMOUNT (28px, Bold)       │
│ [Optional subtitle]          │
└─────────────────────────────┘
```

**Props:**

```typescript
interface SummaryCardProps {
  label: string; // "YOU'LL GET ↑", "YOU'LL GIVE ↓", "NET BALANCE"
  amount: number; // Displayed as ₹{formatted}
  type: 'receivable' | 'payable' | 'net';
  subtitle?: string; // Optional secondary text
}
```

**Styling:**

- Background: #FFFFFF
- Padding: 16px
- Border Radius: 8px
- Shadow: Elevation Level 2
- Margin-bottom: 12px
- Label: 11px Regular, #757575, uppercase
- Amount: 28px Bold
  - #FF4444 for receivable
  - #00C853 for payable
  - #212121 for net
- Subtitle: 12px Regular, #757575 (if provided)

**Behavior:**

- Non-interactive (no tap action)
- Static display

---

### Component 2: Customer List Item

**Purpose:** Display customer with name, phone, balance in scrollable lists

**Structure:**

```
┌─────────────────────────────────────┐
│ [Avatar] Customer Name         ₹5,000│
│          +91-98765-43210            │
│          Last: 2 days ago      [>]  │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface CustomerListItemProps {
  customer: {
    id: string;
    name: string;
    phone_number?: string;
    current_balance: number;
    last_transaction_at?: string;
  };
  onPress: () => void;
  onLongPress?: () => void; // Optional context menu
  showPhone?: boolean; // Default: false
  showLastActivity?: boolean; // Default: true
}
```

**Styling:**

- Height: 72px (with phone/metadata), 56px (name + balance only)
- Padding: 12px 16px
- Background: #FFFFFF
- Border-bottom: 1px solid #F5F5F5
- Tap: Background → #F5F5F5 (ripple effect)
- Avatar: 40x40 dp circle, first letter of name, random pastel background
- Name: 14px Medium, #212121
- Phone: 12px Regular, #757575
- Last Activity: 12px Regular, #757575
- Balance: 16px SemiBold
  - #FF4444 if positive (they owe you)
  - #00C853 if negative (you owe them)
  - #757575 if zero
- Chevron: 16x16 dp, #BDBDBD

**Swipe Actions:**

- Swipe Left → Reveal actions:
  - Send Reminder (Green background, #25D366)
  - Delete (Red background, #F44336)
- Swipe threshold: 60px
- Actions: 80px wide each

**Behavior:**

- Tap → Navigate to Customer Detail
- Long Press → Context menu (Edit, Delete, Send Reminder, Call)
- Swipe left → Quick actions
- Swipe right → No action (or refresh gesture)

---

### Component 3: Transaction List Item

**Purpose:** Display transaction entry in customer transaction history

**Structure:**

```
┌─────────────────────────────────────┐
│ ₹500 ↑ YOU GAVE          03/04/2026 │
│ 10kg rice, 2L oil           3:30 PM │
│ [📷 Thumbnail if photo attached]     │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface TransactionListItemProps {
  transaction: {
    id: string;
    type: 'GAVE' | 'GOT';
    amount: number;
    note?: string;
    transaction_date: string;
    has_attachments: boolean;
    attachment_thumbnail?: string;
  };
  onPress: () => void;
  onSwipeDelete?: () => void;
  showDate?: boolean; // Default: true
}
```

**Styling:**

- Min Height: 56px
- Height: Variable based on content
  - Base: 56px (amount + date only)
  - +20px if note exists (one line)
  - +20px per additional note line
  - +60px if photo thumbnail
- Padding: 12px 16px
- Border-bottom: 1px solid #F5F5F5
- Amount: 16px SemiBold
  - #FF4444 for GAVE (with ↑ icon)
  - #00C853 for GOT (with ↓ icon)
- Type Label: 11px Medium, same color as amount
- Note: 12px Regular, #757575
- Date: 11px Regular, #757575, right-aligned
- Time: 11px Regular, #757575, right-aligned below date
- Photo Thumbnail: 48x48 dp, border-radius 4px, right side

**Swipe Actions:**

- Swipe Left → Delete (Red, #F44336, 80px wide)

**Behavior:**

- Tap → Navigate to Transaction Detail/Edit
- Swipe left → Delete confirmation

---

### Component 4: Action Button Pair (You Gave / You Got)

**Purpose:** Primary transaction type selection buttons

**Structure:**

```
┌─────────────────────────────────────┐
│ ┌─────────────────┐                 │
│ │  ↑ YOU GAVE     │  (Red button)   │
│ └─────────────────┘                 │
│                                     │
│ ┌─────────────────┐                 │
│ │  ↓ YOU GOT      │  (Green button) │
│ └─────────────────┘                 │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface ActionButtonPairProps {
  onGavePress: () => void;
  onGotPress: () => void;
  currentBalance?: number; // Shows context
  disabled?: boolean; // Disable both buttons
  gaveLabel?: string; // Default: "YOU GAVE"
  gotLabel?: string; // Default: "YOU GOT"
}
```

**Styling:**

- Container: Full width, gap 12px between buttons
- Each Button:
  - Width: 100%
  - Height: 56px
  - Border Radius: 8px
  - Font: 18px SemiBold, uppercase
  - Shadow: Elevation Level 1 on press
- YOU GAVE Button:
  - Background: #FF4444
  - Text: #FFFFFF
  - Icon: ↑ (16x16 dp, left of text)
- YOU GOT Button:
  - Background: #00C853
  - Text: #FFFFFF
  - Icon: ↓ (16x16 dp, left of text)
- Disabled State:
  - Background: #EEEEEE
  - Text: #BDBDBD

**Behavior:**

- Tap YOU GAVE → Triggers onGavePress callback
- Tap YOU GOT → Triggers onGotPress callback
- Press state: Slight scale down (0.98)
- Ripple effect on tap

---

### Component 5: Amount Input with Numpad

**Purpose:** Enter transaction/payment amounts with built-in numpad

**Structure:**

```
┌─────────────────────────────────────┐
│          ₹ 5,000                    │  (Display area)
│                                     │
│  ┌───┬───┬───┐                      │  (Numpad grid)
│  │ 1 │ 2 │ 3 │                      │
│  ├───┼───┼───┤                      │
│  │ 4 │ 5 │ 6 │                      │
│  ├───┼───┼───┤                      │
│  │ 7 │ 8 │ 9 │                      │
│  ├───┼───┼───┤                      │
│  │ . │ 0 │ ⌫ │                      │
│  └───┴───┴───┘                      │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface AmountInputProps {
  value: string; // Controlled component
  onChange: (value: string) => void;
  maxAmount?: number; // Optional validation
  currency?: string; // Default: "₹"
  placeholder?: string; // Default: "₹ 0"
  showNumpad?: boolean; // Default: true
}
```

**Styling:**

- Display Area:
  - Height: 80px
  - Background: #F9F9F9
  - Border-radius: 8px
  - Padding: 0 20px
  - Text: 40px Bold, #212121, center-aligned
  - Placeholder: #BDBDBD
- Numpad Grid:
  - Grid: 3 columns × 4 rows
  - Gap: 8px
  - Button Size: 64x64 dp (or flex to fill width)
  - Background: #FFFFFF
  - Border: 1px solid #EEEEEE
  - Border-radius: 8px
  - Text: 24px Medium, #212121
  - Active: Background #F5F5F5

**Behavior:**

- Number tap → Appends digit to value
- Decimal (.) → Allows up to 2 decimal places
- Backspace (⌫) → Removes last character
- Auto-formats with commas: 1000 → 1,000
- Haptic feedback on each tap (light impact)
- Validates max 10 digits before decimal

---

### Component 6: Bottom Tab Navigation

**Purpose:** Main app navigation - always visible

**Structure:**

```
┌─────────────────────────────────────┐
│  🏠     👥      📊      ⚙️         │
│ Home  Customers Reports Settings   │
└─────────────────────────────────────┘
```

**Tabs:**

```typescript
interface BottomTab {
  id: string;
  label: string;
  icon: string; // Icon component name
  route: string;
  badge?: number; // Optional badge count
}

const BOTTOM_TABS: BottomTab[] = [
  { id: 'home', label: 'Home', icon: 'home', route: '/home' },
  { id: 'customers', label: 'Customers', icon: 'people', route: '/customers' },
  { id: 'reports', label: 'Reports', icon: 'chart-bar', route: '/reports' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
];
```

**Styling:**

- Height: 56px
- Background: #FFFFFF
- Border-top: 1px solid #EEEEEE
- Shadow: Elevation Level 2
- Padding: 8px 0
- Safe Area Insets: Account for iOS notch, Android gesture bar
- Icon Size: 24x24 dp
- Label: 11px Regular
- Active State:
  - Icon Color: #2196F3
  - Text Color: #2196F3
  - Font Weight: SemiBold
- Inactive State:
  - Icon Color: #757575
  - Text Color: #757575
- Badge:
  - Size: 16x16 dp (min), circle
  - Background: #F44336
  - Text: 10px Bold, #FFFFFF
  - Position: Top-right of icon

**Behavior:**

- Tap tab → Navigate to route (replace stack)
- Active tab highlighted (blue)
- Smooth transition animation (100ms fade)

---

### Component 7: Floating Action Button (FAB)

**Purpose:** Primary quick action (add transaction, add customer)

**Structure:**

```
     ┌─────┐
     │  +  │  ← 56x56 dp circle
     └─────┘
```

**Props:**

```typescript
interface FABProps {
  onPress: () => void;
  icon?: string; // Default: "add" (+)
  color?: string; // Default: #2196F3
  label?: string; // Optional text label (extended FAB)
  extended?: boolean; // Default: false
}
```

**Styling:**

- Standard FAB:
  - Size: 56x56 dp (circle)
  - Background: #2196F3
  - Icon: #FFFFFF, 24x24 dp, centered
  - Shadow: Elevation Level 3
  - Position: Fixed, bottom-right
  - Bottom: 72px (above bottom nav)
  - Right: 16px
- Extended FAB (with label):
  - Width: Auto (padding: 16px 24px)
  - Height: 56px
  - Border-radius: 28px (pill shape)
  - Label: 16px SemiBold, #FFFFFF
  - Icon + Label with 8px gap

**Behavior:**

- Tap → Triggers onPress (often opens modal or navigates)
- Press state: Scale down to 0.95
- Ripple effect from center
- Haptic feedback (medium impact)
- Hides on scroll down (optional), shows on scroll up

**FAB Actions by Screen:**

- Dashboard: Opens modal ("Add Customer" / "Add Transaction")
- Customer Detail: Opens "Add Transaction" directly
- Inventory: Opens "Add Item" screen

---

### Component 8: Top App Bar / Header

**Purpose:** Screen title, navigation, and actions

**Variants:**

- Simple (title only)
- With Back (back arrow + title)
- With Actions (back + title + action icons)
- With Menu (hamburger + title + actions)

**Structure:**

```
┌─────────────────────────────────────┐
│ [←] Screen Title            [⋮] [🔍]│
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface TopAppBarProps {
  title: string;
  variant?: 'simple' | 'back' | 'menu'; // Default: "simple"
  onBackPress?: () => void;
  onMenuPress?: () => void;
  actions?: Array<{
    icon: string;
    onPress: () => void;
    label: string; // For accessibility
  }>;
  backgroundColor?: string; // Default: #FFFFFF
  elevation?: boolean; // Default: false, true on scroll
}
```

**Styling:**

- Height: 56px
- Background: #FFFFFF
- Padding: 0 16px (or 0 4px if back button)
- Border-bottom: 1px solid #EEEEEE (optional, on scroll)
- Shadow: Elevation Level 1 (on scroll only)
- Title: 20px SemiBold, #212121, centered (if no back) or left (if back button)
- Back Icon: 24x24 dp, #212121, tap area 44x44 dp
- Action Icons: 24x24 dp, #212121, tap area 44x44 dp, gap 8px
- Safe Area: Account for iOS status bar

**Behavior:**

- Back button → Calls onBackPress (usually navigation.goBack())
- Menu button → Opens sidebar drawer
- Action icons → Individual callbacks
- On scroll → Adds shadow (elevation)

---

### Component 9: Empty State

**Purpose:** Friendly message when no data exists

**Structure:**

```
┌─────────────────────────────────────┐
│                                     │
│         [Icon 64x64]                │
│                                     │
│      Empty State Title              │
│   Helpful message about what to do  │
│                                     │
│      [Primary Action Button]        │
│                                     │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface EmptyStateProps {
  icon: string; // Icon name or emoji
  title: string; // "No Customers Yet"
  message: string; // Help text
  actionLabel?: string; // "Add Customer"
  onAction?: () => void;
}
```

**Styling:**

- Container: Centered vertically and horizontally
- Icon: 64x64 dp, #BDBDBD
- Title: 20px SemiBold, #212121, center-aligned
- Message: 14px Regular, #757575, center-aligned, max-width 280px
- Spacing: 16px between elements
- Button: Standard primary button (if action provided)

**Common Empty States:**

- No Customers: Icon 👥, "Add your first customer"
- No Transactions: Icon 📝, "Record your first transaction"
- No Invoices: Icon 📄, "Create your first invoice"
- No Search Results: Icon 🔍, "Try different keywords"

---

### Component 10: Loading State

**Purpose:** Indicate activity during data fetching

**Variants:**

- Full Screen Loading
- Skeleton Loading (list placeholders)
- Inline Loading (button spinner)
- Pull-to-Refresh

**Props:**

```typescript
interface LoadingStateProps {
  type: 'full' | 'skeleton' | 'inline' | 'refresh';
  message?: string; // Optional text
}
```

**Styling:**

- **Full Screen:**
  - Spinner: 32x32 dp, #2196F3
  - Center of screen
  - Optional text below: 14px Regular, #757575
  - Background: #FFFFFF or transparent overlay

- **Skeleton:**
  - Bars match content shape
  - Background: #F5F5F5
  - Animated shimmer: left to right, 1.5s duration
  - Border-radius: Same as actual content

- **Inline (Button):**
  - Spinner: 20x20 dp, #FFFFFF (inside button)
  - Replaces button text
  - Button disabled

- **Pull-to-Refresh:**
  - Standard platform component
  - Color: #2196F3
  - Appears on pull-down gesture

---

### Component 11: Error State

**Purpose:** User-friendly error messages

**Structure:**

```
┌─────────────────────────────────────┐
│         ⚠️ (48x48)                  │
│                                     │
│      Something went wrong           │
│  Unable to load data. Please check  │
│   your connection and try again.    │
│                                     │
│      [Try Again Button]             │
│                                     │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface ErrorStateProps {
  title: string; // "Something went wrong"
  message: string; // Error details (user-friendly)
  actionLabel?: string; // "Try Again"
  onAction?: () => void;
  type?: 'error' | 'warning' | 'info'; // Default: "error"
}
```

**Styling:**

- Container: Centered, padding 24px
- Icon: 48x48 dp
  - Error: ⚠️ #F44336
  - Warning: ⚠️ #FFC107
  - Info: ℹ️ #2196F3
- Title: 18px SemiBold, #212121, center-aligned
- Message: 14px Regular, #757575, center-aligned, max-width 280px
- Background (optional): #FFF3E0 (warning tint) or #FFEBEE (error tint)
- Padding: 16px
- Border-radius: 8px
- Button: Primary or Secondary based on context

**Common Error Messages:**

- Network: "No internet connection"
- Server: "Server error, please try again later"
- Validation: Inline (not full error state)
- Not Found: "Page not found"

---

### Component 12: Offline Banner

**Purpose:** Persistent indicator when device is offline

**Structure:**

```
┌─────────────────────────────────────┐
│ ⚡ Offline - Data will sync online  │
│ 3 changes pending                   │
└─────────────────────────────────────┘
```

**Props:**

```typescript
interface OfflineBannerProps {
  pendingCount?: number; // Items in sync queue
  onTap?: () => void; // Optional: Show sync details
}
```

**Styling:**

- Height: 40px (single line) or 56px (with pending count)
- Background: #FFC107 (warning yellow)
- Text: 13px Medium, #212121
- Icon: ⚡ 16x16 dp, #212121
- Padding: 12px 16px
- Position: Top of screen, below status bar, above content
- Shadow: Elevation Level 2
- Pending Count: 12px SemiBold, #212121

**Behavior:**

- Appears: Slide down animation (200ms) when offline detected
- Disappears: Slide up animation (200ms) when online + synced
- Updates: Pending count updates in real-time
- Tap (optional): Shows sync queue details modal
- Persistent: Stays visible across all screens while offline

**States:**

- Offline Only: "⚡ Offline - Data will sync when online"
- Offline with Pending: "⚡ Offline - 3 changes pending sync"
- Syncing: "🔄 Syncing... 2 of 5 items" (blue background #E3F2FD)

---

## 4. Screen Specifications

### Authentication Screens

---

### Screen 0: Language Selection (Onboarding First Step)

**Route:** `/onboarding/language`
**Priority:** P0
**Purpose:** Select preferred language at app first launch

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [App Logo]                  │ ← 80x80 dp, centered, margin-top 60px
│                                     │
│      Choose Your Language           │ ← H1 (24px Bold), margin-top 24px
│      अपनी भाषा चुनें                │ ← Hindi subtitle
│                                     │
│  ┌─────────────────────────────────┐│ ← Language Grid (2 columns)
│  │ ┌──────────┐  ┌──────────┐     ││
│  │ │ English  │  │  हिंदी   │     ││ ← Language cards (height 56px)
│  │ │ English  │  │  Hindi   │     ││
│  │ └──────────┘  └──────────┘     ││
│  │ ┌──────────┐  ┌──────────┐     ││
│  │ │  தமிழ்   │  │  తెలుగు │     ││
│  │ │  Tamil   │  │  Telugu  │     ││
│  │ └──────────┘  └──────────┘     ││
│  │ ┌──────────┐  ┌──────────┐     ││
│  │ │  मराठी   │  │ ગુજરાતી  │     ││
│  │ │ Marathi  │  │ Gujarati │     ││
│  │ └──────────┘  └──────────┘     ││
│  │ ┌──────────┐  ┌──────────┐     ││
│  │ │  ಕನ್ನಡ   │  │ മലയാളം   │     ││
│  │ │ Kannada  │  │Malayalam │     ││
│  │ └──────────┘  └──────────┘     ││
│  │ ┌──────────┐  ┌──────────┐     ││
│  │ │  বাংলা   │  │  ਪੰਜਾਬੀ  │     ││
│  │ │ Bengali  │  │ Punjabi  │     ││
│  │ └──────────┘  └──────────┘     ││
│  │ ┌──────────┐                    ││
│  │ │   ଓଡ଼ିଆ   │                    ││
│  │ │   Odia   │                    ││
│  │ └──────────┘                    ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Continue                   ││ ← Primary Button (disabled until selected)
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Logo (placeholder)
- Language Card × 11 (grid layout, selectable)
- Primary Button

**Data Displayed:**

- 11 language options in native scripts:
  - English (default device language detection)
  - हिंदी (Hindi)
  - தமிழ் (Tamil)
  - తెలుగు (Telugu)
  - मराठी (Marathi)
  - ગુજરાતી (Gujarati)
  - ಕನ್ನಡ (Kannada)
  - മലയാളം (Malayalam)
  - বাংলা (Bengali)
  - ਪੰਜਾਬੀ (Punjabi)
  - ଓଡ଼ିଆ (Odia)

**Language Card Styling:**

- Width: 48% (2 columns with gap)
- Height: 56px
- Background: #FFFFFF
- Border: 2px solid #EEEEEE
- Border-radius: 8px
- Padding: 12px
- Gap: 12px (between cards)
- Native script: 18px SemiBold
- English name: 12px Regular, #757575
- Selected state:
  - Border: 2px solid #2196F3
  - Background: #E3F2FD (light blue tint)
  - Checkmark: ✓ icon (16x16, #2196F3, top-right)

**User Actions:**

- **Tap Language Card** → Selects language (single selection)
- **Tap "Continue"** → Saves language_code → Navigate to Screen 1: Login
- Auto-detects device language → Pre-selects matching option

**Validation:**

- Must select a language (button disabled until selection)

**Navigation:**

- Continue → Screen 1: Phone Login
- No back button (first screen)

**Loading State:** None (static screen)

---

### Screen 1: Phone Login

**Route:** `/auth/login`
**Priority:** P0
**Purpose:** Initial authentication - collect phone number for OTP

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │ ← Status Bar (system, 20px)
│                                     │
│                                     │
│         [App Logo]                  │ ← 80x80 dp, centered, margin-top 60px
│                                     │
│      Welcome to Khatabook           │ ← H1 (24px Bold), margin-top 24px
│   Manage your business digitally   │ ← Subtitle (14px), #757575, margin-top 8px
│                                     │
│  ┌─────────────────────────────┐   │ ← Phone Input, margin-top 48px
│  │ +91 | [Phone Number]        │   │ (Height 56px, border-radius 8px)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ ← Primary Button, margin-top 16px
│  │      Get OTP                │   │ (Height 48px, full width)
│  └─────────────────────────────┘   │
│                                     │
│  By continuing, you agree to our    │ ← Caption (11px), #757575
│  Terms & Privacy Policy             │ (Margin-top 24px, links underlined)
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Custom logo/branding (image or SVG)
- Text Input (phone number with +91 prefix)
- Primary Button (Get OTP)
- Text Links (Terms, Privacy)

**Data Displayed:**

- None (input only)
- Country code +91 pre-filled and readonly

**User Actions:**

- **Enter phone number** → Real-time validation (10 digits)
- **Tap "Get OTP"** → Validates → Calls `POST /auth/send-otp` → Navigate to OTP screen
- **Tap Terms** → Opens Terms of Service (web view or modal)
- **Tap Privacy** → Opens Privacy Policy (web view or modal)

**Validation:**

- Phone number must be exactly 10 digits
- Only numeric input allowed
- Error: "Please enter a valid 10-digit mobile number" (red text below input)
- Button disabled until valid

**Loading State:**

- Button text changes to spinner
- Button disabled
- Input disabled

**Error Handling:**

- API error (429): "Too many attempts. Please try again in X minutes"
- API error (500): "Unable to send OTP. Please try again"
- Show as toast notification

**Empty State:** N/A
**Offline State:** Shows error: "Internet required for login"

**Navigation:**

- Success → Screen 2: OTP Verification
- No back button (entry point)

---

### Screen 2: OTP Verification

**Route:** `/auth/verify-otp`
**Priority:** P0
**Purpose:** Verify OTP code sent to phone

**Layout:**

```
┌─────────────────────────────────────┐
│ [←]                                 │ ← Top Bar (back button only), height 56px
├─────────────────────────────────────┤
│                                     │
│                                     │
│      Enter Verification Code        │ ← H1 (24px Bold), margin-top 40px
│  Sent to +91-98765-XXXXX            │ ← Subtitle (14px), #757575, masked phone
│                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│ ← OTP Input boxes, margin-top 32px
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 ││ (Each 48x48 dp, gap 8px)
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘│
│                                     │
│      Auto-verifying...              │ ← Status text (12px, #757575), margin-top 16px
│                                     │
│                                     │
│  Didn't receive code?               │ ← Help text (13px), margin-top 32px
│  [Resend OTP] (in 30s)              │ ← Link (13px, #2196F3), countdown timer
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back only, no title)
- OTP Input (6 individual boxes)
- Text (countdown timer)
- Link (resend OTP)

**Data Displayed:**

- Masked phone: "+91-98765-XXXXX" (first 4 digits + last 5 hidden)
- Countdown: "Resend OTP (in 30s)" → counts down to 0, then becomes clickable
- Status: "Auto-verifying..." when 6 digits entered

**User Actions:**

- **Type OTP digit** → Auto-advances to next box, auto-focuses
- **Auto-submit** → When 6th digit entered, automatically calls `POST /auth/verify-otp`
- **Backspace** → Clears current box, moves to previous
- **Tap Resend** → (After 30s) Calls `POST /auth/send-otp` → Resets timer → Toast: "OTP sent"
- **Tap Back** → Returns to Login screen (confirms: "Are you sure? You'll need to request OTP again")

**Validation:**

- Must be 6 digits
- Auto-validates when 6th digit entered

**Loading State:**

- Status text: "Auto-verifying..."
- Boxes disabled (gray background)
- Spinner overlay (optional)

**Error Handling:**

- Wrong OTP (401): Shake animation on boxes, clears input, shows error: "Invalid OTP. Please try again." (red text)
- Expired OTP (401): Shows error: "OTP expired. Please request a new code."
- Too many attempts (429): Shows error: "Too many attempts. Please try again in X minutes."

**Success Behavior:**

- Shows brief success animation (green checkmark)
- Navigates based on is_new_user:
  - is_new_user=true → Screen 3: Profile Setup
  - is_new_user=false → Screen 5: Dashboard/Home

**Navigation:**

- Success (new user) → Screen 3: Profile Setup
- Success (returning user) → Screen 5: Dashboard/Home
- Back → Screen 1: Login

---

### Screen 3: Profile Setup (First-Time Users)

**Route:** `/onboarding/profile-setup`
**Priority:** P0
**Purpose:** Collect user name and business details on first login

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│      Tell us about yourself         │ ← H1 (24px Bold), margin-top 40px
│   This helps personalize your app   │ ← Subtitle (14px, #757575)
│                                     │
│  ┌─────────────────────────────┐   │ ← Text Input, margin-top 32px
│  │ Your Name *                 │   │
│  │ [                         ] │   │ (Height 56px)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ ← Text Input, margin-top 16px
│  │ Business Name (optional)    │   │
│  │ [                         ] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ ← Dropdown, margin-top 16px
│  │ Business Type               │   │
│  │ [ Retail                  ▼]│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ ← Primary Button, margin-top 32px
│  │      Continue               │   │
│  └─────────────────────────────┘   │
│                                     │
│         Skip for now →              │ ← Link (14px, #2196F3), margin-top 16px
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Text Input × 2 (name, business name)
- Dropdown Picker (business type)
- Primary Button (continue)
- Text Link (skip)

**Data Displayed:**

- Form fields (empty)
- Business type options: Retail, Wholesale, Services, Other (default: Retail)

**User Actions:**

- **Type name** → Real-time validation (min 2 characters)
- **Type business name** → Optional
- **Select business type** → Opens picker modal
- **Tap "Continue"** → Validates → Calls `PUT /auth/me` → Navigate to Create Khatabook
- **Tap "Skip for now"** → Skips to Create Khatabook (name remains null, can set later in Settings)

**Validation:**

- Name required (min 2 chars, max 255)
- Business name optional (max 255 if provided)
- Business type optional (defaults to "retail")
- Button disabled until name is valid

**Loading State:** Button spinner during `PUT /auth/me`

**Error State:**

- Inline validation: Red text below field
- API error: Toast notification

**Navigation:**

- Continue → Screen 4: Create First Khatabook
- Skip → Screen 4: Create First Khatabook
- No back button (onboarding flow)

---

### Screen 4: Create First Khatabook (Onboarding)

**Route:** `/onboarding/create-khatabook`
**Priority:** P0
**Purpose:** Create initial ledger book during first-time setup

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [Khatabook Icon]            │ ← 64x64 dp, #2196F3, margin-top 60px
│                                     │
│    Create Your First Khata Book    │ ← H1 (24px Bold), margin-top 24px
│  Start managing your business      │ ← Subtitle (14px, #757575)
│     transactions digitally          │
│                                     │
│  ┌─────────────────────────────┐   │ ← Text Input, margin-top 48px
│  │ Khatabook Name              │   │
│  │ [My Business Khata        ] │   │ ← Pre-filled
│  └─────────────────────────────┘   │
│                                     │
│  💡 You can create more khatabooks  │ ← Info text (12px, #757575)
│     later for different businesses  │
│                                     │
│  ┌─────────────────────────────┐   │ ← Primary Button, margin-top 32px
│  │      Create Khatabook       │   │
│  └─────────────────────────────┘   │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Icon (book/khatabook illustration)
- Text Input (khatabook name)
- Info Text
- Primary Button

**Data Displayed:**

- Pre-filled name: "{Business Name} Khata" or "My Business Khata"
- If user entered business name in Profile Setup, use it
- Otherwise, use generic "My Business Khata"

**User Actions:**

- **Edit name** → Optional, pre-filled is usually good
- **Tap "Create Khatabook"** → Validates → Calls `POST /khatabooks` → Navigate to Dashboard

**Validation:**

- Name required (pre-filled, so always valid)
- Max 255 characters
- Trim whitespace

**Loading State:** Button spinner during API call

**Success Behavior:**

- Brief success animation (optional)
- Navigate to Dashboard
- Created khatabook is set as active/default

**Navigation:**

- Success → Screen 5: Dashboard/Home Screen
- No back button (must complete onboarding)

---

### Main Application Screens

---

### Screen 5: Dashboard / Home Screen

**Route:** `/home` or `/dashboard`
**Priority:** P0
**Purpose:** Main screen showing financial summary and customer list for active khatabook

**Layout:** (Confirmed design from Option A)

```
┌─────────────────────────────────────┐
│ [≡] Kirana Store Khata        [🔍] │ ← Top Bar (height 56px)
├─────────────────────────────────────┤
│ ⚡ Offline - 2 pending (if offline) │ ← Offline Banner (conditional)
├─────────────────────────────────────┤
│                                     │ ← Scroll container starts
│ ┌─────────────────────────────────┐ │
│ │ YOU'LL GET ↑                    │ │ ← Summary Card (Receivable)
│ │ ₹1,25,000                       │ │ (Height 80px, margin-bottom 12px)
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ YOU'LL GIVE ↓                   │ │ ← Summary Card (Payable)
│ │ ₹25,000                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ NET BALANCE                     │ │ ← Summary Card (Net)
│ │ ₹1,00,000                       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Customers (45)            Sort by ▼ │ ← Section Header (height 40px)
│ ┌─────────────────────────────────┐ │
│ │ [R] Ramesh Kumar       ₹5,000 > │ │ ← Customer List Item (72px)
│ │     +91-98765-43210             │ │
│ │     Last: 2 days ago            │ │
│ ├─────────────────────────────────┤ │
│ │ [S] Suresh Patel       ₹3,200 > │ │
│ │     Last: 5 days ago            │ │
│ ├─────────────────────────────────┤ │
│ │ [P] Priya Sharma       ₹2,100 > │ │
│ │     Last: 1 week ago            │ │
│ │ ...                             │ │ ← Scrollable list
│ └─────────────────────────────────┘ │
│                                     │
│                              [+]    │ ← FAB (bottom-right, 56x56 dp)
│                                     │   (Bottom: 72px, Right: 16px)
├─────────────────────────────────────┤
│ 🏠    👥      📊      ⚙️          │ ← Bottom Tab Nav (height 56px)
│ Home  Customers Reports Settings   │ (Home is active - blue)
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (hamburger menu, khatabook name, search icon)
- Offline Banner (conditional)
- Summary Card × 3 (receivable, payable, net)
- Section Header (with sort dropdown)
- Customer List Item (repeated, infinite scroll)
- FAB (add action)
- Bottom Tab Navigation (home active)

**API Calls:**

```
On Mount:
  - GET /khatabooks/:id (get stats)
  - GET /customers?khatabook_id=X&sort=-balance&limit=50 (first page)

On Scroll to Bottom:
  - GET /customers?khatabook_id=X&cursor=Y&limit=50 (next page)

Pull-to-Refresh:
  - Reload both APIs above

Every 2 minutes (background):
  - Silent refresh if app is active
```

**Data Displayed:**

- Top Bar: Active khatabook name
- Summary Cards:
  - Total Receivable: Sum of positive customer balances
  - Total Payable: Sum of negative customer balances
  - Net Balance: Receivable - Payable
  - Formatted as ₹1,25,000 (Indian number format)
- Customer List:
  - Avatar: Circle with first letter, random pastel color
  - Name: customer.name
  - Phone: customer.phone_number (formatted as +91-XXXXX-XXXXX)
  - Balance: customer.current_balance (color-coded)
  - Last Activity: "Last: X days ago" (human-readable)
- Section Header: "Customers (45)" - shows total count
- Sort dropdown: "By Balance" (default), "By Name", "By Last Activity"

**User Actions:**

**Top Bar:**

- **Tap Hamburger (≡)** → Opens sidebar drawer
  - Switch Khatabook (if multiple)
  - Settings
  - Help & Support
  - App Info
- **Tap Khatabook Name** → Opens khatabook switcher (if >1 khatabook)
- **Tap Search (🔍)** → Navigate to Search screen (search all customers)

**Summary Cards:**

- Non-interactive (informational only)

**Customer List:**

- **Tap Customer** → Navigate to Screen 6: Customer Detail
- **Swipe Customer Left** → Reveal quick actions:
  - Send Reminder (green, 80px wide)
  - Delete (red, 80px wide)
- **Long Press Customer** → Context menu modal:
  - View Details
  - Send Reminder
  - Edit Customer
  - Delete Customer
  - Call Customer (if phone exists)
- **Tap "Sort by"** → Opens sort modal:
  - By Balance (High to Low) - default
  - By Balance (Low to High)
  - By Name (A to Z)
  - By Name (Z to A)
  - By Last Activity (Recent first)

**FAB:**

- **Tap FAB (+)** → Opens bottom sheet modal:
  - Add Customer (navigate to Add Customer screen)
  - Add Transaction (navigate to Customer Selector → Transaction entry)
  - Add Invoice (P1)

**Bottom Navigation:**

- **Tap Home** → Already on home (no action)
- **Tap Customers** → Navigate to Customers tab (TBD - might be same as home)
- **Tap Reports** → Navigate to Screen 9: Reports List
- **Tap Settings** → Navigate to Screen 15: Settings

**Gestures:**

- **Pull Down** → Refresh (reloads API data)
- **Scroll to Bottom** → Load next page (pagination)

**Empty State:**

```
┌─────────────────────────────────────┐
│         👥 (64x64, #BDBDBD)         │
│                                     │
│      No Customers Yet               │
│   Tap + to add your first customer  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Add Customer           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Loading State:**

- Initial Load:
  - Skeleton for summary cards (3 gray animated boxes)
  - Skeleton for customer list (5-6 gray rows)
- Pagination Load:
  - Small spinner at bottom of list
  - "Loading more..." text (12px, #757575)
- Refresh:
  - Pull-to-refresh indicator at top
  - Existing content stays visible

**Offline State:**

- Yellow banner at top: "⚡ Offline - Data will sync when online"
- Shows cached customer data
- Summary may be outdated (shows last synced time)
- FAB still works (saves to local DB)
- Pull-to-refresh disabled (shows toast: "Cannot refresh while offline")

**Error State:**

- API failure: Toast "Unable to load data. Showing cached version."
- Shows last cached data if available
- Shows full error state if no cache

**Navigation:**

- Hamburger → Sidebar (Settings, Switch Khatabook, Help)
- Search → `/search`
- Customer tap → `/customers/:id` (Screen 6)
- FAB → Modal → `/customers/new` or `/transactions/new`
- Sort → In-place modal
- Bottom tabs → Respective screens

---

### Screen 6: Customer Detail / Transaction History

**Route:** `/customers/:id`
**Priority:** P0
**Purpose:** View all transactions and balance for a specific customer

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Ramesh Kumar              [⋮]  │ ← Top Bar (back + name + menu)
├─────────────────────────────────────┤
│                                     │ ← Scroll container
│ ┌─────────────────────────────────┐ │ ← Customer Info Card
│ │ +91-98765-43210    [📞] [💬]    │ │ (Phone with call/WhatsApp icons)
│ │                                 │ │
│ │ Current Balance                 │ │
│ │ ₹5,000 You'll Get               │ │ ← 24px Bold, #FF4444
│ │                                 │ │
│ │ Total Gave: ₹25,000             │ │ ← Metadata (12px, #757575)
│ │ Total Got:  ₹20,000             │ │
│ │ Transactions: 45                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Action Button Pair
│ │ [↑ YOU GAVE]     [↓ YOU GOT]    │ │ (Component 4)
│ └─────────────────────────────────┘ │
│                                     │
│ Transactions (45)        Filter ▼   │ ← Section Header
│ ┌─────────────────────────────────┐ │
│ │ ₹500 ↑ YOU GAVE    03/04/2026   │ │ ← Transaction List Item
│ │ 10kg rice, 2L oil    3:30 PM    │ │ (Component 3)
│ │ [📷 Thumbnail]                  │ │
│ ├─────────────────────────────────┤ │
│ │ ₹300 ↓ YOU GOT     02/04/2026   │ │
│ │ Partial payment      2:15 PM    │ │
│ ├─────────────────────────────────┤ │
│ │ ₹1,000 ↑ YOU GAVE  01/04/2026   │ │
│ │ Monthly supplies    10:00 AM    │ │
│ ├─────────────────────────────────┤ │
│ │ ...                             │ │ ← Infinite scroll
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ 🏠    👥      📊      ⚙️          │ ← Bottom Nav
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, customer name, overflow menu)
- Customer Info Card (custom, balance + metadata)
- Icon Buttons (phone, WhatsApp)
- Action Button Pair (You Gave / You Got)
- Section Header (with filter)
- Transaction List Item (repeated, scrollable)
- Bottom Tab Navigation

**API Calls:**

```
On Mount:
  - GET /customers/:id (customer details + summary)
  - GET /customers/:id/transactions?sort=-transaction_date&limit=50

On Scroll:
  - GET /customers/:id/transactions?cursor=X&limit=50 (pagination)

On Refresh:
  - Reload both APIs

After Transaction Added:
  - Refetch customer (updated balance)
  - Prepend new transaction to list (optimistic update)
```

**Data Displayed:**

- Customer: name, phone_number, current_balance
- Summary: total_gave, total_got, transaction_count
- Transaction list: type, amount, note, transaction_date, has_attachments
- Balance formatting:
  - Positive (they owe you): "₹5,000 You'll Get" (red)
  - Negative (you owe them): "₹2,000 You'll Give" (green)
  - Zero: "Balance Cleared" (gray)
- Date formatting: "03/04/2026" (DD/MM/YYYY)
- Time formatting: "3:30 PM" (12-hour)
- Relative dates: "Last: 2 days ago" using date-fns

**User Actions:**

**Top Bar:**

- **Tap Back (←)** → Return to Dashboard
- **Tap Overflow Menu (⋮)** → Context menu:
  - Edit Customer
  - Send Reminder
  - Settle Balance
  - Delete Customer (shows confirmation)

**Customer Info Card:**

- **Tap Phone Icon (📞)** → Opens phone dialer with number pre-filled
- **Tap WhatsApp Icon (💬)** → Navigate to Screen 8: Send Reminder (WhatsApp pre-selected)
- **Tap Balance** → No action (informational)

**Action Buttons:**

- **Tap "YOU GAVE" button** → Navigate to Screen 7: Add Transaction (type=GAVE, customer pre-selected)
- **Tap "YOU GOT" button** → Navigate to Screen 7: Add Transaction (type=GOT, customer pre-selected)

**Transaction List:**

- **Tap Transaction** → Navigate to Transaction Detail screen (view/edit)
- **Swipe Transaction Left** → Delete action (shows confirmation)
- **Tap Photo Thumbnail** → Opens full-screen photo view
- **Tap "Filter"** → Opens filter modal:
  - All Transactions (default)
  - You Gave only
  - You Got only
  - Date Range (custom from-to picker)
- **Pull Down** → Refresh data

**Bottom Navigation:**

- Tap respective tabs to navigate

**Empty State:**

```
┌─────────────────────────────────────┐
│         📝 (64x64, #BDBDBD)         │
│                                     │
│   No Transactions Yet               │
│ Record your first transaction       │
│     with this customer              │
│                                     │
│ [Action buttons still visible]      │ ← YOU GAVE / YOU GOT buttons remain
└─────────────────────────────────────┘
```

**Loading State:**

- Initial: Skeleton for customer card + 5 transaction items
- Pagination: Spinner at bottom of list
- Refresh: Pull indicator at top

**Offline State:**

- Banner at top
- Shows cached transactions
- Action buttons still work (creates local transaction)
- New transactions marked with sync pending icon

**Error State:**

- Customer load fail: Full error state with "Try Again"
- Transactions load fail: Shows customer card + error in list area

**Navigation:**

- Back → Dashboard
- YOU GAVE → `/transactions/new?customer_id=:id&type=GAVE`
- YOU GOT → `/transactions/new?customer_id=:id&type=GOT`
- Transaction tap → `/transactions/:id`
- WhatsApp → `/reminders/send?customer_id=:id&type=WHATSAPP`
- Edit Customer → `/customers/:id/edit`
- Settle Balance → Confirmation dialog → Calls API → Updates balance

---

### Transaction & Reminder Screens

---

### Screen 7: Add / Edit Transaction

**Route:** `/transactions/new?customer_id=X&type=GAVE` or `/transactions/:id/edit`
**Priority:** P0
**Purpose:** Enter transaction amount and optional details (type pre-selected from previous screen)

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] You Gave                  [✓]  │ ← Top Bar (type as title, save icon)
├─────────────────────────────────────┤
│                                     │
│      Ramesh Kumar                   │ ← Customer name (16px, centered)
│   Balance: ₹2,000 You'll Get        │ ← Current balance (13px, #757575)
│                                     │
│  ┌─────────────────────────────────┐│ ← Amount Display
│  │         ₹ 5,000                 ││ (Height 80px, background #F9F9F9)
│  └─────────────────────────────────┘│ (40px font, bold, centered)
│                                     │
│  ┌───┬───┬───┐                      │ ← Numpad (Component 5)
│  │ 1 │ 2 │ 3 │                      │ (Each button 64x64 dp)
│  ├───┼───┼───┤                      │
│  │ 4 │ 5 │ 6 │                      │
│  ├───┼───┼───┤                      │
│  │ 7 │ 8 │ 9 │                      │
│  ├───┼───┼───┤                      │
│  │ . │ 0 │ ⌫ │                      │
│  └───┴───┴───┘                      │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ + Add Note                      ││ ← Expandable field (collapsed)
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 📷 Add Photo                    ││ ← Photo picker button
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 📅 Today, 3:45 PM         [Edit]││ ← Date/Time selector
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │         SAVE                    ││ ← Primary Button (green #00C853)
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, title "You Gave" or "You Got", save checkmark)
- Customer info (readonly text)
- Amount Input with Numpad (Component 5)
- Expandable Text Input (note)
- Photo Picker Button
- Date/Time Picker
- Primary Button

**API Calls:**

```
On Mount (Edit Mode):
  - GET /transactions/:id (load existing data)

On Save:
  - POST /transactions (create new)
  OR
  - PUT /transactions/:id (update existing)

On Success:
  - Optimistic update: Show success immediately
  - Background: Upload attachments if any
```

**Data Displayed:**

- Title: "You Gave" (red) or "You Got" (green) based on type
- Customer name (readonly, from route param or API)
- Current balance before this transaction
- Amount: User input, live-formatted as ₹X,XXX.XX
- Note: Optional text (collapsed by default)
- Photo: Thumbnail if attached, camera/gallery picker if not
- Date/Time: Default "Today, {current time}", editable

**User Actions:**

**Numpad:**

- **Tap number (1-9, 0)** → Append digit to amount
- **Tap decimal (.)** → Add decimal point (max 2 decimal places)
- **Tap backspace (⌫)** → Delete last character
- Haptic feedback on each tap

**Optional Fields:**

- **Tap "+ Add Note"** → Expands to multi-line text input (3 lines)
  - Placeholder: "e.g., 10kg rice, 2L oil"
  - Max 500 characters
  - Collapses if empty on save
- **Tap "📷 Add Photo"** → Opens action sheet:
  - Take Photo (opens camera)
  - Choose from Gallery
  - View Photo (if already attached)
  - Remove Photo
- **Tap Date/Time field** → Opens date/time picker modal
  - Can select past dates (up to 1 year back)
  - Cannot select future dates

**Save:**

- **Tap SAVE button** → Validates → Calls API → Shows success
- **Tap Save Icon (✓)** in top bar → Same as SAVE button
- **Tap Back with changes** → Confirmation: "Discard unsaved transaction?" (Stay / Discard)

**Validation:**

- Amount must be > 0 (error: "Please enter an amount")
- Amount > ₹100,000 → Confirmation dialog: "Large amount (₹1,00,000). Are you sure?" (Cancel / Confirm)
- Customer required (always provided via route)
- Date cannot be in future

**Success Behavior:**

```
1. Shows toast: "✓ Transaction saved" (green, 3 seconds)
2. Shows snackbar: "Undo" button (5 seconds)
   - If tap Undo → Calls POST /transactions/:id/undo
3. Optional prompt (bottom sheet):
   "Send SMS confirmation to customer?"
   - Preview: "You took ₹500 from Rajesh Store..."
   - [Don't Send] [Send SMS]
4. Navigate back to Customer Detail
5. New transaction appears at top of list
6. Customer balance updated
```

**Loading State:**

- SAVE button: Spinner replaces text, button disabled
- Full overlay if uploading photo

**Error State:**

- Validation: Inline red text below field
- API error: Toast "Failed to save transaction. Try again."
- Network error: Auto-saves locally, shows "Saved locally, will sync when online"

**Offline Behavior:**

- All actions work
- Transaction saved to WatermelonDB
- Shows "Saved locally" toast
- Sync pending indicator
- Returns to Customer Detail with optimistic update

**Navigation:**

- Back → Customer Detail (Screen 6)
- Save success → Customer Detail (Screen 6) with updated data
- Undo → Deletes transaction → Stays on Customer Detail

---

### Screen 8: Send Reminder

**Route:** `/reminders/send?customer_id=X&type=WHATSAPP`
**Priority:** P0
**Purpose:** Send payment reminder via WhatsApp, SMS, or Email

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Send Reminder                   │ ← Top Bar
├─────────────────────────────────────┤
│                                     │
│ To: Ramesh Kumar                    │ ← Customer (14px SemiBold)
│ Balance: ₹5,000 You'll Get          │ ← Balance (13px, #FF4444)
│                                     │
│ ┌─────────────────────────────────┐ │ ← Type Selector (segmented control)
│ │ [WhatsApp]  [ SMS ]  [ Email ]  │ │ (Active: #25D366 for WA, #2196F3 for SMS/Email)
│ └─────────────────────────────────┘ │
│                                     │
│ Message Preview:                    │ ← Label (12px, #757575)
│ ┌─────────────────────────────────┐ │ ← Message Box (editable text area)
│ │ Hi Ramesh Kumar,                │ │ (Min height 160px, padding 12px)
│ │                                 │ │ (Background #F9F9F9, border #EEE)
│ │ This is a friendly reminder     │ │ (Font 14px Regular)
│ │ from Rajesh General Store.      │ │
│ │                                 │ │
│ │ Your pending balance: ₹5,000    │ │
│ │                                 │ │
│ │ Please pay at your earliest     │ │
│ │ convenience.                    │ │
│ │                                 │ │
│ │ Thank you!                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │   Send via WhatsApp      [💬]  ││ ← Primary Button (color based on type)
│  └─────────────────────────────────┘│ (Green for WA, Blue for SMS/Email)
│                                     │
│  Last reminded: 5 days ago          │ ← Metadata (12px, #757575)
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, title)
- Customer info row (readonly)
- Segmented Control (WhatsApp / SMS / Email)
- Text Area (message editor)
- Primary Button (send)
- Metadata text

**API Calls:**

```
On Save:
  - POST /reminders/send
  - Logs reminder in database
  - Opens native app (WhatsApp/SMS) with pre-filled message
```

**Data Displayed:**

- Customer: name, current_balance
- Message template (editable):

  ```
  Hi {customer_name},

  This is a friendly reminder from {business_name}.

  Your pending balance: ₹{balance}

  Please pay at your earliest convenience.

  Thank you!
  ```

- Last reminder timestamp: "Last reminded: X days ago" (human-readable)
- Type tabs: WhatsApp (if phone), SMS (if phone), Email (if email)

**User Actions:**

**Type Selector:**

- **Tap WhatsApp tab** → Activates WhatsApp mode, updates button text/color
- **Tap SMS tab** → Activates SMS mode
- **Tap Email tab** → Activates Email mode
- Disabled tabs grayed out if customer missing required field

**Message:**

- **Edit message** → Text area becomes active, cursor appears
- **Use template variables** → Auto-replaces {customer_name}, {balance}, {business_name}
- **Character count** → Shows "160 chars" for SMS (optional)

**Send:**

- **Tap "Send via WhatsApp"** →
  1. Validates (has phone number)
  2. Calls `POST /reminders/send` (logs reminder)
  3. Opens WhatsApp with pre-filled message
  4. User manually sends in WhatsApp
  5. Returns to app → Navigate back to Customer Detail
  6. Toast: "Reminder logged"

**Navigation:**

- Back → Customer Detail
- Send → Opens WhatsApp/SMS/Email app → Returns to Customer Detail after sending

**Validation:**

- WhatsApp: Requires phone_number (tab disabled if missing)
- SMS: Requires phone_number
- Email: Requires email (tab disabled if missing)
- Message cannot be empty

**Loading State:** Send button spinner during API call

**Error State:**

- Missing phone/email: Tab disabled + tooltip "No phone number"
- API error: Toast "Failed to send reminder"

**Offline State:**

- Reminder saved to queue
- Shows "Reminder queued. Will send when online"
- WhatsApp/SMS app may still open if native action

---

### Reports & Analytics Screens

---

### Screen 9: Reports List

**Route:** `/reports`
**Priority:** P0
**Purpose:** Select report type to view or generate

**Layout:**

```
┌─────────────────────────────────────┐
│ Reports                       [ℹ]  │ ← Top Bar
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │ ← Report Type Card
│ │ 📊 Customer Balance Report      │ │ (Background #FFF, padding 16px)
│ │ See who owes what               │ │ (Height 72px, margin-bottom 12px)
│ │                           [>]   │ │ (Chevron right)
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📈 Transaction Report           │ │
│ │ View all transactions           │ │
│ │                           [>]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Cash Flow Report             │ │
│ │ Money in vs money out           │ │
│ │                           [>]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← P1 Feature badge
│ │ 📄 GST Report              [P1] │ │
│ │ Tax summary for filing          │ │
│ │                           [>]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📊 Business Analytics      [P1] │ │
│ │ Charts and insights             │ │
│ │                           [>]   │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ 🏠    👥      📊      ⚙️          │ ← Bottom Nav (Reports active - blue)
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (title, info icon)
- Report Type Card × 5 (custom card component)
- Bottom Tab Navigation

**Data Displayed:**

- Static list of available reports
- P1/P2 badges for future features

**User Actions:**

- **Tap Report Card** → Navigate to report configuration or direct to report view
  - Customer Balance → Report Config → Table View
  - Transaction Report → Report Config → Table View
  - Cash Flow → Report Config → Chart View
  - GST Report → Report Config (P1)
  - Business Analytics → Screen 14: Advanced Analytics
- **Tap Info (ℹ)** → Help modal explaining each report type

**Report Configuration Pattern:**
Each report leads to a configuration screen (not separately numbered):

```
Report Configuration Modal:
  - Date Range: Today / This Week / This Month / This Year / Custom
  - Filters: Customer (optional), Type (optional)
  - Format: View Now / Download PDF / Export Excel
  [Generate Report Button]
```

**Empty State:** N/A (always shows options)
**Loading State:** N/A (static list)
**Offline State:** Reports unavailable (grayed out), tooltip "Requires internet"

**Navigation:**

- Report tap → `/reports/customer-balance`, `/reports/transactions`, etc.
- Business Analytics → Screen 14: `/analytics`
- Bottom nav → Other tabs

---

### Screen 13B: Generate Payment Link (P1)

**Route:** `/payments/create-link?customer_id=X`
**Priority:** P1
**Purpose:** Generate UPI/payment gateway link for customer to pay digitally

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Collect Payment                 │ ← Top Bar
├─────────────────────────────────────┤
│                                     │
│ From: Ramesh Kumar                  │ ← Customer (14px SemiBold)
│ Balance: ₹5,000 You'll Get          │ ← Balance (13px, #FF4444)
│                                     │
│ ┌─────────────────────────────────┐ │ ← Amount Input
│ │         ₹ 5,000                 │ │ (Default: full balance)
│ └─────────────────────────────────┘ │
│                                     │
│ [Full Balance ₹5,000] [Custom ▼]   │ ← Quick amount chips
│                                     │
│ Payment Method                      │ ← Section header
│ ┌─────────────────────────────────┐ │
│ │ ☑️ UPI (Google Pay, PhonePe)     │ │ ← Checkbox (checked by default)
│ │ ☑️ Cards (Credit/Debit)          │ │
│ │ ☑️ Wallets (Paytm, PhonePe)      │ │
│ │ ☑️ Net Banking                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📝 Add note (optional)          │ │ ← Note field
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │   Generate Payment Link         ││ ← Primary Button (blue)
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**After Link Generated:**

```
┌─────────────────────────────────────┐
│ ✅ Payment Link Created              │ ← Success banner (green)
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Payment Link:                   │ │ ← Link preview card
│ │ https://rzp.io/l/abc123          │ │
│ │ Expires: 24 hours                │ │
│ │                          [Copy] │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📱 Share via WhatsApp          ││ ← Action buttons
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  💬 Share via SMS               ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  📧 Share via Email             ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar
- Amount Input (with quick chips)
- Checkboxes (payment methods)
- Text Input (note)
- Primary Button
- Success Banner
- Link Preview Card
- Share Action Buttons

**API Calls:**

- On generate: `POST /payments/create-link`

**User Actions:**

- Edit amount or use Full Balance chip
- Select payment methods (all selected by default)
- Tap "Generate" → Creates link → Shows success screen
- Tap "Copy" → Copies link to clipboard → Toast: "Link copied"
- Tap Share buttons → Opens respective app with link + message

**Navigation:**

- Back → Customer Detail
- After share → Customer Detail

---

### Screen 14: Advanced Analytics / Dashboard (P1)

**Route:** `/analytics` or `/reports/dashboard`
**Priority:** P1
**Purpose:** Visual charts and business insights beyond basic summary

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Business Analytics        [📅] │ ← Top Bar (date picker icon)
├─────────────────────────────────────┤
│                                     │
│ Period: This Month ▼                │ ← Date selector (dropdown chip)
│                                     │
│ ┌─────────────────────────────────┐ │ ← Compact Summary
│ │ ₹1.25L ↑  ₹25K ↓  ₹1L Net      │ │ (Height 56px, horizontal layout)
│ └─────────────────────────────────┘ │
│                                     │
│ Transaction Trends                  │ ← Section header
│ ┌─────────────────────────────────┐ │ ← Chart Card (Victory Native)
│ │     📊 Line/Bar Chart           │ │ (Height 220px)
│ │  ┌─┐     ┌──┐                   │ │
│ │  │ │  ┌──┤  │     ┌─┐           │ │ ← Green bars = You Got
│ │  │█│  │██│  │  ┌──┤█│           │ │ ← Red bars = You Gave
│ │  │█│  │██│  │  │██│█│           │ │
│ │  └─┴──┴──┴──┴──┴──┴─┘           │ │
│ │  W1  W2  W3  W4  W5              │ │ ← X-axis labels
│ └─────────────────────────────────┘ │
│                                     │
│ Top 5 Customers by Volume           │
│ ┌─────────────────────────────────┐ │ ← Ranked List Card
│ │ 1. 🥇 Ramesh Kumar   ₹50,000 📊 │ │ (Each row 48px)
│ │ 2. 🥈 Suresh Patel   ₹35,000 📊 │ │
│ │ 3. 🥉 Priya Sharma   ₹28,000 📊 │ │
│ │ 4.    Karim Ali      ₹22,000 📊 │ │
│ │ 5.    Deepak Kumar   ₹18,000 📊 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Top 5 Defaulters                    │
│ ┌─────────────────────────────────┐ │
│ │ 1. ⚠️  Karim Ali     ₹15,000 >  │ │
│ │ 2. ⚠️  Deepak Kumar  ₹12,000 >  │ │
│ │ 3. ⚠️  Ankit Sharma   ₹9,000 >  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Cash Flow This Month                │
│ ┌─────────────────────────────────┐ │ ← Flow Summary Card
│ │  Money In:   ₹1,25,000          │ │ (Green)
│ │  Money Out:  ₹95,000            │ │ (Red)
│ │  Net Flow:   ₹30,000 ↗️         │ │ (Bold, with trend arrow)
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ 🏠    👥      📊      ⚙️          │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, title, date action)
- Date Range Chip (dropdown)
- Summary Card (compact horizontal variant)
- Chart Card (Victory Native bar/line charts)
- Ranked List Items
- Info Cards (cash flow)
- Bottom Tab Navigation

**API Calls:**

```
On Mount:
  - GET /khatabooks/:id/reports/dashboard?period=month

On Date Change:
  - GET /khatabooks/:id/reports/dashboard?period={selected}
```

**Data Displayed:**

- Period selector: Today, This Week, This Month, This Year, Custom
- Summary: total_receivable, total_payable, net_balance (compact format: ₹1.25L)
- Chart data:
  - transactions_over_time: Array of {date, gave_amount, got_amount}
  - Displays as stacked bar chart or line chart
  - X-axis: Dates or weeks
  - Y-axis: Amount (formatted as ₹10K, ₹50K, etc.)
- Top Customers: Ranked 1-5 with medals (🥇🥈🥉), customer_name, total volume
- Top Defaulters: customer_name, outstanding balance, warning icon
- Cash Flow: total in, total out, net with trend arrow (↗️ positive, ↘️ negative)

**User Actions:**

- **Tap Date Range** → Opens date picker modal:
  - Presets: Today, This Week, This Month, This Year
  - Custom: From [date] To [date]
  - [Apply] button
- **Tap Customer in List** → Navigate to Customer Detail
- **Scroll** → View all sections
- **Pull Down** → Refresh data

**Chart Interactions:**

- **Tap Bar/Point** → Shows tooltip with exact values
- **Pinch Zoom** → Optional, zoom into date range
- **Pan** → Optional, scroll through time

**Empty State:**

```
No Data for This Period
Try selecting a different date range
[Change Date Range Button]
```

**Loading State:**

- Skeleton for all sections
- Charts show gray placeholder boxes
- Lists show skeleton rows

**Navigation:**

- Back → Reports List (Screen 9) or Dashboard
- Customer tap → Customer Detail (Screen 6)
- Date picker → Updates charts in-place (no navigation)

---

### Invoicing Screens (P1)

---

### Screen 10: Create Invoice

**Route:** `/invoices/new?customer_id=X`
**Priority:** P1
**Purpose:** Generate GST or non-GST invoice with multiple line items

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] New Invoice               [⚙️] │ ← Top Bar (settings = invoice config)
├─────────────────────────────────────┤
│                                     │ ← Scrollable content
│ Customer                            │ ← Section label
│ ┌─────────────────────────────────┐ │
│ │ Ramesh Kumar              [▼]  │ │ ← Customer Dropdown (56px height)
│ └─────────────────────────────────┘ │
│                                     │
│ Invoice Details                     │
│ ┌──────────────┐  ┌───────────────┐ │
│ │ Invoice #    │  │ Date          │ │ ← Split inputs
│ │ [INV-0042  ] │  │ [03/04/26 📅]│ │
│ └──────────────┘  └───────────────┘ │
│                                     │
│ ☑️ GST Invoice                      │ ← Checkbox (if checked, shows tax fields)
│                                     │
│ Items                         [+ Add]│ ← Section header with add button
│ ┌─────────────────────────────────┐ │
│ │ Cotton Fabric                [⋮]│ │ ← Invoice Item Card (tappable)
│ │ 100 meter × ₹80.00   GST 12%    │ │ (Height variable, min 72px)
│ │                       ₹8,960.00 │ │ (Total aligned right, bold)
│ ├─────────────────────────────────┤ │
│ │ Silk Fabric                  [⋮]│ │
│ │ 20 meter × ₹100.00   GST 12%    │ │
│ │                       ₹2,240.00 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Totals Summary Card
│ │ Subtotal:            ₹10,000.00 │ │ (Background #F9F9F9)
│ │ CGST (6%):              ₹600.00 │ │ (Padding 16px)
│ │ SGST (6%):              ₹600.00 │ │
│ │ ─────────────────────────────── │ │
│ │ Total:              ₹11,200.00 │ │ (20px Bold)
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Preview Invoice            ││ ← Primary Button
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, title, settings icon)
- Dropdown (customer selector)
- Text Inputs (invoice number, date)
- Checkbox (GST toggle)
- Invoice Item Card (custom, repeated)
- Add Item Button
- Totals Summary Card
- Primary Button

**API Calls:**

```
On Mount:
  - GET /khatabooks/:id/invoice-settings (business details, next invoice #)
  - GET /customers?khatabook_id=X (for dropdown)

On Save:
  - POST /invoices (creates invoice + items)
```

**Data Displayed:**

- Customer dropdown: All customers in khatabook
- Invoice number: Auto-filled from invoice_settings.next_invoice_number (editable)
- Invoice date: Default today (editable)
- GST checkbox: Default unchecked
- Items: Array of line items with calculations
- Tax breakdown: Auto-calculated from item tax_rates
  - CGST + SGST if same state
  - IGST if different state (based on business GSTIN vs customer GSTIN)
- Total: Subtotal + taxes, bold, prominent

**User Actions:**

**Customer:**

- **Tap Customer Dropdown** → Opens searchable modal with all customers
  - Search box at top
  - List of customers
  - Tap to select → Closes modal

**Invoice Details:**

- **Tap Invoice Number** → Edit (keyboard appears)
- **Tap Date** → Date picker modal

**GST:**

- **Toggle GST Checkbox** →
  - Checked: Shows tax fields in items, requires business GSTIN configured
  - Unchecked: Hides tax fields, simple invoice
  - If no GSTIN configured: Toast "Please configure GSTIN in settings" + checkbox auto-unchecks

**Items:**

- **Tap "+ Add"** → Opens Add Item Modal (bottom sheet):
  ```
  Add Item
  ──────────────────────────────
  Item Name:  [________________]
  Description: [________________] (optional)
  Quantity:   [100] Unit: [meter ▼]
  Rate:       [₹80.00]
  Tax:        [12% ▼] (if GST invoice)
  HSN Code:   [52082100] (optional)
               [Add Item]
  ```
- **Tap Item** → Opens Edit Item modal (same as add, pre-filled)
- **Tap Item Menu (⋮)** → Options: Edit, Duplicate, Delete
- **Swipe Item Left** → Delete (shows confirmation)

**Preview:**

- **Tap "Preview Invoice"** → Validates → Calls `POST /invoices` → Navigate to Screen 11: Invoice Preview

**Top Bar Actions:**

- **Tap Settings (⚙️)** → Navigate to Invoice Settings:
  - Business Name, Address, Phone, Email
  - GSTIN
  - Logo upload
  - Invoice prefix
  - Bank details
  - Terms & Conditions

**Validation:**

- Customer required
- At least 1 item required (error: "Add at least one item")
- Each item: name, quantity, rate required
- If GST invoice: Business GSTIN must be configured
- Invoice number must be unique

**Calculations:**

- Item total: (quantity × rate) + (quantity × rate × tax_rate)
- Subtotal: Sum of all item totals before tax
- Tax: Sum of all item taxes
- If GST: Split tax into CGST + SGST (same state) or IGST (different state)
- Total: Subtotal + Tax

**Loading State:** Preview button spinner during `POST /invoices`

**Error State:**

- Missing GSTIN: Toast + navigate to settings
- Validation: Inline errors below fields
- API error: Toast with retry option

**Navigation:**

- Back → Customer Detail or Invoices List (wherever user came from)
- Settings → `/khatabooks/:id/invoice-settings`
- Preview → Screen 11: `/invoices/:id/preview`

---

### Screen 11: Invoice Preview (P1)

**Route:** `/invoices/:id/preview`
**Priority:** P1
**Purpose:** Preview generated invoice PDF before sharing/printing

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Invoice Preview           [⋮]  │ ← Top Bar (menu for edit/delete/status)
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│ ← PDF Viewer (scrollable, zoomable)
│  │ ┌─────────────────────────────┐ ││ (Height: flexible, margin 16px)
│  │ │ [Logo]  Rajesh General Store│ ││
│  │ │         GSTIN: 24AABCU9603R1Z││ ││
│  │ │         Address, Phone      │ ││
│  │ │                             │ ││
│  │ │ INVOICE #: INV-0042         │ ││
│  │ │ Date: 03/04/2026            │ ││
│  │ │                             │ ││
│  │ │ Bill To:                    │ ││
│  │ │ Ramesh Kumar                │ ││
│  │ │ +91-98765-43210             │ ││
│  │ │                             │ ││
│  │ │ ═══════════════════════════ │ ││
│  │ │ Item       Qty Rate    Amt  │ ││
│  │ │ Cotton Fab 100m ₹80  ₹8,960 │ ││
│  │ │ Silk Fabric 20m ₹100 ₹2,240 │ ││
│  │ │                             │ ││
│  │ │ Subtotal:       ₹10,000.00  │ ││
│  │ │ CGST 6%:           ₹600.00  │ ││
│  │ │ SGST 6%:           ₹600.00  │ ││
│  │ │ ═══════════════════════════ │ ││
│  │ │ TOTAL:          ₹11,200.00  │ ││
│  │ │                             │ ││
│  │ │ Amount in words: Eleven     │ ││
│  │ │ Thousand Two Hundred Rupees │ ││
│  │ │ Only                        │ ││
│  │ └─────────────────────────────┘ ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│ ← Action Buttons (fixed bottom)
│  │  📱 Share via WhatsApp          ││ (Green #25D366)
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  ⬇️  Download PDF                ││ (Blue #2196F3)
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  🖨️  Print                       ││ (Gray outline button)
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, title, overflow menu)
- PDF Viewer (WebView or react-native-pdf)
- Action Buttons (share, download, print)

**API Calls:**

```
On Mount:
  - GET /invoices/:id (invoice data)
  - GET /invoices/:id/pdf (PDF URL - generated async)

If PDF not ready:
  - Poll every 2s until pdf_url is available
```

**Data Displayed:**

- Complete invoice PDF rendered from server
- PDF contains:
  - Business details (logo, name, GSTIN, address)
  - Invoice number, date, due date
  - Customer details (name, phone, address, GSTIN if applicable)
  - Line items table (item, qty, rate, tax, total)
  - Tax breakdown (CGST/SGST or IGST)
  - Grand total
  - Total in words
  - Bank details (if configured)
  - Terms & conditions (if configured)

**User Actions:**

**PDF Viewer:**

- **Scroll** → View entire invoice (vertical scroll)
- **Pinch Zoom** → Zoom in/out on PDF
- **Double Tap** → Zoom to fit width

**Action Buttons:**

- **Tap "Share via WhatsApp"** →
  1. Downloads PDF to temp location
  2. Opens WhatsApp share sheet
  3. Pre-attaches PDF file
  4. Pre-fills message: "Hi {customer}, here's your invoice for ₹{total}. Thank you!"
  5. User sends in WhatsApp
  6. Returns to app
  7. Updates invoice status to "SENT" (calls `PUT /invoices/:id`)

- **Tap "Download PDF"** →
  1. Downloads PDF to device storage (Downloads/Khatabook/)
  2. Toast: "Invoice saved to Downloads" with "Open" action
  3. Tap Open → Opens PDF in system viewer

- **Tap "Print"** →
  1. Opens system print dialog
  2. Options: Bluetooth printer, WiFi printer, Save as PDF
  3. Prints invoice

**Overflow Menu (⋮):**

- Edit Invoice → Returns to Screen 10: Create Invoice (edit mode)
- Delete Invoice → Confirmation → Calls `DELETE /invoices/:id`
- Change Status → Modal (Mark as Sent, Mark as Paid, Mark as Cancelled)
- Copy Link → Copies PDF URL to clipboard

**Loading State:**

- PDF generation:
  - Placeholder: "Generating invoice..." with spinner (2-5 seconds)
  - Progress: "Generating... 50%" (optional)
- Action buttons disabled until PDF ready

**Error State:**

- PDF generation failed: Shows error state with "Regenerate" button
- Download failed: Toast "Download failed. Try again."

**Navigation:**

- Back → Create Invoice screen or Customer Detail (wherever came from)
- Edit → Screen 10: Create Invoice (edit mode)
- Share → Opens WhatsApp → Returns here after sharing
- Delete → Confirmation → Returns to Invoice List or Customer Detail

---

### Inventory Screens (P2)

---

### Screen 12: Inventory List (P2)

**Route:** `/inventory`
**Priority:** P2
**Purpose:** View and manage product inventory with stock levels

**Layout:**

```
┌─────────────────────────────────────┐
│ [≡] Inventory                 [🔍] │ ← Top Bar
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │ ← Stats Summary Card
│ │ 📦 45 Items  💰 ₹1,25,000       │ │ (Horizontal layout, compact)
│ │ ⚠️  5 items low stock            │ │ (Warning if low stock exists)
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Filter Tabs (segmented control)
│ │ [ All Items ]  [ Low Stock ]    │ │ (All active by default)
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Inventory Item Card
│ │ [📦] Basmati Rice 1kg       [⋮] │ │ (Height 88px)
│ │      Stock: 50 pcs              │ │
│ │      ₹100.00            [Edit]  │ │
│ ├─────────────────────────────────┤ │
│ │ [📦] Cooking Oil 1L ⚠️       [⋮] │ │ ← Low stock warning
│ │      Stock: 8 pcs (Low!)        │ │ (Orange background tint)
│ │      ₹120.00            [Edit]  │ │
│ ├─────────────────────────────────┤ │
│ │ [📦] Sugar 1kg              [⋮] │ │
│ │      Stock: 35 pcs              │ │
│ │      ₹45.00             [Edit]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│                              [+]    │ ← FAB (add new item)
├─────────────────────────────────────┤
│ 🏠    👥      📊      ⚙️          │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (menu, title, search)
- Stats Summary Card (custom horizontal layout)
- Segmented Control (filter tabs)
- Inventory Item Card (custom, repeated)
- FAB (add item)
- Bottom Tab Navigation

**API Calls:**

```
On Mount:
  - GET /inventory?khatabook_id=X&limit=50

On Filter:
  - GET /inventory?khatabook_id=X&low_stock_only=true

On Search:
  - GET /inventory?khatabook_id=X&q={query}
```

**Data Displayed:**

- Summary: total_items, total_stock_value, low_stock_items
- Item list: item_name, current_stock, unit, selling_price, is_low_stock
- Low stock indicator: ⚠️ orange icon if current_stock <= min_stock_level
- Stock value: calculated as current_stock × selling_price

**User Actions:**

- **Tap Search** → Navigate to inventory search screen
- **Tap Filter Tab** → Switch between All Items / Low Stock Only
- **Tap Item** → Navigate to Screen 13: Edit Item
- **Tap Edit button** → Navigate to Screen 13: Edit Item
- **Tap Item Menu (⋮)** → Context menu:
  - Edit Item
  - Adjust Stock (quick modal for stock in/out)
  - Delete Item (confirmation)
- **Tap FAB** → Navigate to Screen 13: Add Item
- **Pull Down** → Refresh

**Empty State:**

```
📦 (64x64, #BDBDBD)

No Inventory Items
Track your product stock levels
[Add Item Button]
```

**Loading State:** Skeleton cards (5-6 items)

**Low Stock Alert:**

- Items with is_low_stock=true show:
  - Orange background tint (#FFF3E0)
  - Warning icon ⚠️
  - "Low!" text in red next to stock

**Navigation:**

- Search → `/inventory/search`
- Item tap → `/inventory/:id/edit` (Screen 13)
- FAB → `/inventory/new` (Screen 13)
- Adjust Stock (menu) → In-place modal with +/- buttons

---

### Screen 13: Add / Edit Inventory Item (P2)

**Route:** `/inventory/new` or `/inventory/:id/edit`
**Priority:** P2
**Purpose:** Add new product or edit existing inventory item

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Add Item                  [✓]  │ ← Top Bar (save checkmark)
├─────────────────────────────────────┤
│                                     │ ← Scrollable form
│  ┌─────────────────────────────────┐│ ← Image Upload Area
│  │ [Add Photo]                     ││ (Height 120px, dashed border)
│  │   📷 Tap to upload              ││ (Shows thumbnail if image exists)
│  └─────────────────────────────────┘│
│                                     │
│ Item Details                        │ ← Section header (12px, uppercase)
│ ┌─────────────────────────────────┐ │
│ │ Item Name *                     │ │ ← Text Input (required)
│ │ [Basmati Rice 1kg             ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌──────────────┐  ┌───────────────┐ │
│ │ SKU          │  │ Barcode       │ │ ← Split inputs (optional)
│ │ [RICE-BAS-1] │  │ [Scan 📷    ] │ │
│ └──────────────┘  └───────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Description (optional)          │ │ ← Multi-line text
│ │ [Premium quality basmati...   ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Pricing                             │
│ ┌──────────────┐  ┌───────────────┐ │
│ │ Purchase ₹   │  │ Selling ₹ *   │ │
│ │ [80.00     ] │  │ [100.00     ] │ │
│ └──────────────┘  └───────────────┘ │
│                                     │
│ Stock                               │
│ ┌──────────────┐  ┌───────────────┐ │
│ │ Current Stock│  │ Min Level     │ │
│ │ [50        ] │  │ [10         ] │ │
│ │ pcs ▼        │  │ pcs           │ │ ← Unit dropdown
│ └──────────────┘  └───────────────┘ │
│                                     │
│ Tax Details (for GST invoices)      │
│ ┌──────────────┐  ┌───────────────┐ │
│ │ GST Rate %   │  │ HSN Code      │ │
│ │ [0% ▼      ] │  │ [10063020   ] │ │
│ └──────────────┘  └───────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │         SAVE ITEM               ││ ← Primary Button
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (back, title "Add Item" or item name, save icon)
- Image Picker (photo upload area)
- Text Input × 7 (name, SKU, barcode, description, prices, stock, HSN)
- Number Input × 4 (purchase price, selling price, current stock, min level)
- Dropdown × 2 (unit, GST rate)
- Primary Button

**API Calls:**

```
On Mount (Edit Mode):
  - GET /inventory/:id

On Save:
  - POST /inventory (create)
  OR
  - PUT /inventory/:id (update)

On Barcode Scan:
  - Use device camera to scan barcode
  - Auto-fills barcode field
```

**Data Displayed:**

- Form fields (empty for new, pre-filled for edit)
- Unit dropdown: pcs, kg, liter, meter, box, packet, dozen
- GST rate dropdown: 0%, 5%, 12%, 18%, 28%
- Image: Thumbnail if exists, placeholder if not

**User Actions:**

**Photo:**

- **Tap Photo Area** → Action sheet:
  - Take Photo (camera)
  - Choose from Gallery
  - Remove Photo (if exists)
- Shows thumbnail after selection

**Barcode:**

- **Tap Barcode field** → Options:
  - Manual entry (keyboard)
  - Scan Barcode (opens camera with barcode scanner overlay)

**Dropdowns:**

- **Tap Unit** → Picker modal with unit options
- **Tap GST Rate** → Picker modal with tax percentages

**Save:**

- **Tap SAVE** → Validates → Calls API → Navigate back to Inventory List
- **Tap Save Icon (✓)** → Same as SAVE button
- **Tap Back with changes** → Confirmation: "Discard changes?" (Stay / Discard)

**Validation:**

- Item name required (min 2 chars, max 255)
- Selling price required (must be > 0)
- Current stock: Defaults to 0, must be >= 0
- Min stock level: Defaults to 0, must be >= 0
- Purchase price: Optional, must be > 0 if provided
- HSN code: Optional, must be 4-8 digits if provided

**Calculation Helpers:**

- Shows profit margin if both purchase and selling price entered:
  - "Margin: ₹20 (25%)" below pricing fields

**Loading State:** Save button spinner

**Success:**

- Toast: "Item saved successfully"
- Navigate to Inventory List
- New/updated item highlighted briefly

**Error State:**

- Validation: Inline red text below fields
- Duplicate SKU/Barcode: Toast "SKU already exists"
- API error: Toast with retry option

**Navigation:**

- Back → Inventory List (Screen 12)
- Save → Inventory List (Screen 12) with item highlighted

---

### Settings & System Screens

---

### Screen 15: Settings

**Route:** `/settings`
**Priority:** P0
**Purpose:** App configuration, account management, and preferences

**Layout:**

```
┌─────────────────────────────────────┐
│ Settings                            │ ← Top Bar (title only)
├─────────────────────────────────────┤
│                                     │ ← Scrollable content
│ Account                             │ ← Section Header (12px, uppercase, #757575)
│ ┌─────────────────────────────────┐ │
│ │ [👤] Rajesh Kumar               │ │ ← Profile Row (72px height)
│ │      +91-98765-43210            │ │
│ │                           [>]   │ │
│ ├─────────────────────────────────┤ │ ← Settings Row (56px height)
│ │ Language             English [>]│ │
│ ├─────────────────────────────────┤ │
│ │ Active Khatabook                │ │
│ │ Kirana Store              [>]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Security                            │
│ ┌─────────────────────────────────┐ │
│ │ 🔒 Biometric Lock     [Toggle]  │ │ ← Row with toggle switch
│ │    Enable fingerprint/Face ID   │ │ (Subtitle 12px, #757575)
│ ├─────────────────────────────────┤ │
│ │ 🔢 App PIN                  [>] │ │
│ │    Set 4-digit PIN lock         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Invoice Settings (P1)               │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Business Details         [>] │ │
│ │    Name, GSTIN, Logo            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Data & Backup                       │
│ ┌─────────────────────────────────┐ │
│ │ ☁️  Sync Status                  │ │ ← Info row (non-tappable)
│ │    ✓ All synced (2 min ago)     │ │ (Green checkmark if synced)
│ ├─────────────────────────────────┤ │
│ │ 💾 Export Data              [>] │ │
│ │    Download all as CSV/Excel    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ About                               │
│ ┌─────────────────────────────────┐ │
│ │ Version 1.0.0                   │ │ ← Static info row
│ │ Terms & Privacy             [>] │ │
│ │ Help & Support              [>] │ │
│ │ Rate App                    [>] │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Log Out                    ││ ← Destructive button (red text)
│  └─────────────────────────────────┘│ (#F44336, outline button)
│                                     │
├─────────────────────────────────────┤
│ 🏠    👥      📊      ⚙️          │ ← Bottom Nav (Settings active)
└─────────────────────────────────────┘
```

**Components Used:**

- Top App Bar (title only)
- Section Headers (repeated)
- Settings Row (profile, options)
- Toggle Switch (biometric)
- Info Row (sync status, version)
- Link Rows (terms, help, rate)
- Destructive Button (log out)
- Bottom Tab Navigation

**API Calls:**

```
On Mount:
  - GET /auth/me (user profile)
  - GET /sync/status (sync info)

On Toggle Change:
  - PUT /auth/me (update biometric_enabled)

On Export:
  - POST /khatabooks/:id/reports/export

On Logout:
  - POST /auth/logout
```

**Data Displayed:**

- Profile: name, phone_number
- Language: language_code → Display name (e.g., "en" → "English")
- Active khatabook: khatabook.name
- Biometric toggle: biometric_enabled status
- Sync status: last_sync_at, pending_count
  - "✓ All synced (2 min ago)" if synced
  - "🔄 Syncing... 3 items" if syncing
  - "⚠️ 5 pending changes" if pending
- App version: From package.json

**User Actions:**

**Account Section:**

- **Tap Profile Row** → Navigate to Edit Profile screen
  - Edit name, email
  - Change phone (requires OTP)
  - Profile photo upload
- **Tap Language** → Language selector modal:
  - Grid of 11 languages (en, hi, ta, te, mr, gu, kn, ml, bn, pa, or)
  - Each language in its native script
  - Tap to select → Calls `PUT /auth/me` → App language changes immediately
- **Tap Active Khatabook** → Khatabook switcher modal (P1):
  - List of all user's khatabooks
  - Shows balance summary for each
  - Tap to switch active khatabook
  - "+ Create New Khatabook" option at bottom

**Security:**

- **Toggle Biometric** →
  - If enabling: Requests biometric permission → Calls `PUT /auth/me`
  - If disabling: Confirmation → Calls `PUT /auth/me`
  - Updates immediately
- **Tap App PIN** → Set/Change PIN screen:
  - Enter 4-digit PIN
  - Confirm PIN
  - Saves to secure storage

**Invoice Settings (P1):**

- **Tap Business Details** → Navigate to Invoice Settings screen:
  - Business name, address, phone, email
  - GSTIN (validated format)
  - Logo upload
  - Invoice prefix (INV, BILL, etc.)
  - Bank details
  - Terms & Conditions

**Data & Backup:**

- **Tap Sync Status** → Shows sync details modal:
  - Last sync time
  - Pending items count
  - Sync health status
  - [Force Sync Now] button
- **Tap Export Data** → Confirmation → Calls API → Shows progress → Downloads CSV/Excel

**About:**

- **Tap Terms** → Opens Terms of Service (web view)
- **Tap Privacy** → Opens Privacy Policy (web view)
- **Tap Help** → Opens Help Center or FAQ
- **Tap Rate App** → Opens App Store/Play Store rating dialog

**Log Out:**

- **Tap Log Out** → Confirmation dialog:
  ```
  Are you sure you want to log out?
  Your data is safely backed up.
  [Cancel] [Log Out]
  ```
- **Confirm** → Calls `POST /auth/logout` → Clears local session → Navigate to Login screen

**Loading State:** Individual rows show spinner during actions (e.g., biometric toggle, export)

**Offline State:**

- Sync status shows offline indicator
- Export disabled (grayed out)
- Other settings still work

**Navigation:**

- Profile → `/profile/edit`
- Language → Modal (stays on settings)
- Khatabook → Modal (stays on settings)
- Business Details → `/khatabooks/:id/invoice-settings`
- Export → Downloads file → Toast confirmation
- Terms/Privacy/Help → Web view or modal
- Rate App → External (App Store/Play Store)
- Log Out → `/auth/login`

---

### Screen 16: Error / 404 Page

**Route:** `/error` or `*` (catch-all route)
**Priority:** P0
**Purpose:** Handle navigation errors, 404s, and unexpected states gracefully

**Layout:**

```
┌─────────────────────────────────────┐
│ [←] Error                           │ ← Top Bar (back if nav stack exists)
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│         ⚠️  (64x64)                 │ ← Error icon, centered
│                                     │
│      Something went wrong           │ ← H2 (20px Bold), centered
│                                     │
│   We couldn't find what you're      │ ← Body (14px Regular, #757575)
│      looking for, or there          │ (Max-width 280px, centered)
│    was an unexpected error.         │
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Go to Home                 ││ ← Primary Button
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Try Again                  ││ ← Secondary Button (outline)
│  └─────────────────────────────────┘│
│                                     │
│                                     │
│   Still having issues?              │ ← Help text (13px, #757575)
│   [Contact Support]                 │ ← Link (13px, #2196F3, underlined)
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Variants (Different Error Types):**

**404 Not Found:**

- Icon: 🔍 (search, 64x64)
- Title: "Page Not Found"
- Message: "This page doesn't exist or has been moved."
- Actions: [Go to Home] only (no Try Again)

**Network Error (Offline):**

- Icon: 📡 (64x64, #FFC107)
- Title: "No Internet Connection"
- Message: "Check your connection and try again. Working offline with cached data."
- Actions: [Try Again] [Go to Home]
- Shows cached data if available in background

**Server Error (500):**

- Icon: ⚠️ (64x64, #F44336)
- Title: "Server Error"
- Message: "Our servers are having issues. Please try again in a moment."
- Actions: [Try Again] [Go to Home]
- Auto-retry countdown: "Retrying in 5s..." (optional)

**Permission Error (403):**

- Icon: 🔒 (64x64, #F44336)
- Title: "Access Denied"
- Message: "You don't have permission to view this page."
- Actions: [Go to Home] only

**Session Expired (401):**

- Icon: ⏱️ (64x64, #FFC107)
- Title: "Session Expired"
- Message: "Please log in again to continue."
- Actions: [Log In] (navigates to login screen)

**Components Used:**

- Top App Bar (back if possible)
- Error State Component (Component 11)
- Primary Button
- Secondary Button (outline)
- Text Link

**Data Displayed:**

- Error type (determines icon, title, message)
- Optional error code (for debugging in dev mode)
- Optional "Report this error" link with error ID

**User Actions:**

- **Tap "Go to Home"** → Navigate to Dashboard (clears navigation stack)
- **Tap "Try Again"** → Retry last failed action:
  - If page load failed: Reload page
  - If API call failed: Retry API call
  - Shows loading state
- **Tap "Contact Support"** → Opens support options:
  - Email: support@khatabook.com
  - WhatsApp: +91-XXXXX-XXXXX
  - Help Center
- **Tap Back** → Navigate back in stack (if exists)

**Auto-Retry (Server Error only):**

- Countdown: "Retrying in 5s..." → 4s → 3s → 2s → 1s → Retry
- User can cancel by tapping elsewhere
- Max 3 auto-retries, then manual only

**Loading State:**

- During retry: Spinner overlay + "Retrying..."

**Navigation:**

- Go Home → `/home` (Dashboard, clears stack)
- Try Again → Retry in-place or go back
- Contact Support → Opens email/WhatsApp
- Back → Previous screen (if nav stack exists)
- Session Expired → `/auth/login`

---

## 5. Navigation Map & Flow

### App Navigation Architecture

```
Authentication Flow (Linear, No Bottom Nav):
─────────────────────────────────────────────
Screen 1: Login
    ↓ (OTP sent)
Screen 2: OTP Verification
    ↓ (is_new_user=true) OR → Dashboard (is_new_user=false)
Screen 3: Profile Setup
    ↓ (Continue or Skip)
Screen 4: Create First Khatabook
    ↓
Screen 5: Dashboard/Home (App main entry point)
```

### Main App Structure (Bottom Tabs)

```
┌─────────────────────────────────────────────┐
│           Bottom Tab Navigation              │
├───────────┬───────────┬──────────┬──────────┤
│   Home    │ Customers │ Reports  │ Settings │
│  (Screen 5│    (TBD)  │(Screen 9)│(Screen 15│
│            │           │          │          │
└───────────┴───────────┴──────────┴──────────┘
```

**Tab Routing:**

- **Home Tab:** Leads to Dashboard/Home (Screen 5) - Summary cards + customer list
- **Customers Tab:** Same as Home tab (shows Screen 5) OR dedicated customer list without summary cards (implementation decision)
- **Reports Tab:** Leads to Reports List (Screen 9)
- **Settings Tab:** Leads to Settings (Screen 15)

**Note on Customers Tab:**

- In original Khatabook, Home and Customers tabs both show customer list
- Home includes summary cards at top, Customers tab shows list only
- For MVP, both tabs can route to Screen 5 (Dashboard/Home)
- For polish, create dedicated Customers List screen (same as Screen 5 but without summary cards)

### Complete Navigation Flow Map

**From Dashboard (Screen 5):**

```
Dashboard/Home
  ├─> Hamburger Menu
  │     ├─> Switch Khatabook (if >1 khatabook - P1)
  │     ├─> Settings (Screen 15)
  │     └─> Help & Support
  ├─> Search Icon → Search Screen (not specified)
  ├─> Tap Customer → Screen 6: Customer Detail
  ├─> Swipe Customer → Quick actions (Send Reminder, Delete)
  ├─> Tap FAB → Modal
  │     ├─> Add Customer → Add Customer Screen (not specified)
  │     └─> Add Transaction → Customer Selector → Screen 7
  └─> Bottom Nav → Screens 9, 15
```

**From Customer Detail (Screen 6):**

```
Customer Detail
  ├─> YOU GAVE button → Screen 7: Add Transaction (type=GAVE)
  ├─> YOU GOT button → Screen 7: Add Transaction (type=GOT)
  ├─> WhatsApp Icon → Screen 8: Send Reminder
  ├─> Phone Icon → Opens dialer (native)
  ├─> Tap Transaction → Transaction Detail (view/edit)
  ├─> Overflow Menu
  │     ├─> Edit Customer → Edit Customer Screen (not specified)
  │     ├─> Send Reminder → Screen 8
  │     ├─> Settle Balance → Confirmation → Updates balance
  │     └─> Delete Customer → Confirmation → Deletes
  └─> Bottom Nav → Other tabs
```

**From Add Transaction (Screen 7):**

```
Add Transaction
  ├─> Save → Screen 6: Customer Detail (updated balance, new transaction at top)
  ├─> Undo (5s snackbar) → Deletes transaction → Stays on Screen 6
  └─> Back with changes → Confirmation → Screen 6
```

**From Reports (Screen 9):**

```
Reports List
  ├─> Customer Balance Report → Config → Report View → Export
  ├─> Transaction Report → Config → Report View → Export
  ├─> Cash Flow Report → Config → Report View
  ├─> GST Report (P1) → Config → Report View
  ├─> Business Analytics → Screen 14: Advanced Analytics
  └─> Bottom Nav → Other tabs
```

**From Analytics (Screen 14):**

```
Advanced Analytics
  ├─> Tap Customer in list → Screen 6: Customer Detail
  ├─> Date Range picker → Updates charts in-place
  └─> Back → Screen 9: Reports List
```

**From Invoices:**

```
Customer Detail → Create Invoice option
    ↓
Screen 10: Create Invoice
  ├─> Add Item → Item modal (inline)
  ├─> Edit Item → Item modal (inline)
  ├─> Settings → Invoice Settings Screen
  └─> Preview → Screen 11: Invoice Preview

Screen 11: Invoice Preview
  ├─> Share WhatsApp → Opens WhatsApp app → Returns
  ├─> Download PDF → Saves to device → Toast
  ├─> Print → Print dialog
  ├─> Edit (menu) → Screen 10: Edit mode
  └─> Back → Customer Detail or Invoices List
```

**From Inventory (P2):**

```
Screen 12: Inventory List
  ├─> Tap Item → Screen 13: Edit Item
  ├─> Tap FAB → Screen 13: Add New Item
  ├─> Search → Inventory Search Screen
  └─> Bottom Nav → Other tabs

Screen 13: Add/Edit Item
  ├─> Save → Screen 12: Inventory List (with item highlighted)
  └─> Back → Screen 12: Inventory List
```

**From Settings (Screen 15):**

```
Settings
  ├─> Profile → Edit Profile Screen
  ├─> Language → Language Selector Modal (inline)
  ├─> Khatabook → Khatabook Switcher Modal (inline, P1)
  ├─> Biometric Toggle → Updates in-place
  ├─> App PIN → Set PIN Screen
  ├─> Business Details → Invoice Settings Screen
  ├─> Export Data → Downloads file → Toast
  ├─> Terms/Privacy/Help → Web view or modal
  ├─> Rate App → App Store/Play Store (external)
  └─> Log Out → Confirmation → Screen 1: Login
```

### Modal Overlays (Not Full Screens)

**These appear as overlays, not separate routes:**

**Bottom Sheets:**

- FAB Actions Modal (Add Customer / Add Transaction)
- Add Invoice Item
- Adjust Stock Quick Entry
- Filter Transactions
- Sort Customers
- Date Range Picker
- Khatabook Switcher (P1) - specified below
- Sync Queue Details

**Dialogs:**

- Confirmation Dialogs (Delete, Settle, Log Out, Discard)
- Settlement Confirmation (P1) - specified below
- Success/Error Toasts
- Help/Info Dialogs

**Pickers:**

- Language Selector (11 languages)
- Customer Dropdown
- Unit Selector
- Tax Rate Selector
- Date/Time Picker

---

### Modal: Khatabook Switcher (P1)

**Trigger:** Tap hamburger menu → Switch Khatabook OR tap active khatabook name in Settings

**Layout:**

```
┌─────────────────────────────────────┐
│ Switch Khatabook              [✕]  │ ← Modal header with close
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │ ← Active Khatabook (highlighted)
│ │ ✓ Kirana Store                  │ │ (Background #E3F2FD, border #2196F3)
│ │   Net: ₹1,00,000                │ │
│ │   45 customers                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Other Khatabooks
│ │ Wholesale Business              │ │ (Background #FFF)
│ │   Net: ₹2,50,000                │ │
│ │   120 customers                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Personal Khata                  │ │
│ │   Net: ₹15,000                  │ │
│ │   8 customers                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  + Create New Khatabook         ││ ← Secondary button
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**User Actions:**

- Tap khatabook → Switches active khatabook → Refreshes Dashboard → Closes modal
- Tap "+ Create New" → Opens Create Khatabook screen → After creation, switches to it

**API Calls:**

- GET /khatabooks (on open)
- On switch: Updates local state, refetches Dashboard data

---

### Modal: Settlement Confirmation Dialog (P1)

**Trigger:** Customer Detail overflow menu → Settle Balance

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│ ┌─────────────────────────────────┐ │
│ │   Settle Balance                │ │ ← Dialog title (18px SemiBold)
│ │                                 │ │
│ │   Ramesh Kumar                  │ │ ← Customer name (16px)
│ │   Current Balance: ₹5,000       │ │
│ │                                 │ │
│ │   This will create a settlement │ │ ← Explanation (14px, #757575)
│ │   transaction and clear the     │ │
│ │   balance to zero.              │ │
│ │                                 │ │
│ │   ┌──────────────────────────┐  │ │
│ │   │ Settlement Note (optional)│ │ ← Text input
│ │   │ [Paid in full          ] │  │ │
│ │   └──────────────────────────┘  │ │
│ │                                 │ │
│ │   ┌──────────┐  ┌─────────────┐│ │
│ │   │ Cancel   │  │Settle ₹5,000││ │ ← Buttons
│ │   └──────────┘  └─────────────┘│ │ (Cancel: outline, Settle: green)
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**User Actions:**

- Add optional note
- Tap "Settle" → Calls `POST /customers/:id/settle` → Creates GOT transaction → Balance = 0 → Toast: "Balance settled" → Closes dialog

---

### Modal: Sync Queue Details

**Trigger:** Tap offline banner OR tap Sync Status in Settings

**Layout:**

```
┌─────────────────────────────────────┐
│ Sync Queue                    [✕]  │ ← Modal header
├─────────────────────────────────────┤
│                                     │
│ Status: ⚡ Offline                   │
│ Pending: 5 items                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔄 Transaction #1               │ │ ← Queued item
│ │    Ramesh Kumar - ₹500 (GAVE)   │ │
│ │    Pending                      │ │
│ ├─────────────────────────────────┤ │
│ │ 🔄 Customer #2                  │ │
│ │    New customer: Suresh Patel   │ │
│ │    Pending                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │   Force Sync Now                ││ ← Action button (if online)
│  └─────────────────────────────────┘│
│                                     │
│  Last synced: 5 minutes ago         │ ← Metadata
│                                     │
└─────────────────────────────────────┘
```

**User Actions:**

- View pending items
- Tap "Force Sync" → Triggers sync immediately
- Auto-closes when all items synced

---

### Screen 14: Advanced Analytics / Dashboard (P1)

### Deep Linking Support

**External Links (from notifications, reminders):**

```
khatabook://customer/{id}        → Screen 6: Customer Detail
khatabook://transaction/{id}     → Transaction Detail
khatabook://invoice/{id}/preview → Screen 11: Invoice Preview
khatabook://payment/{id}         → Payment Status Screen
```

**Usage:** Push notifications or SMS links can deep link directly to screens.

---

## 6. State Patterns

### Empty State Pattern (Consistent Across All List Screens)

**Visual Structure:**

```
┌─────────────────────────────────────┐
│                                     │
│         [Icon 64x64 #BDBDBD]        │ ← Centered, gray
│                                     │
│      [Empty State Title]            │ ← 20px SemiBold, #212121
│   [Friendly help message]           │ ← 14px Regular, #757575, max-width 280px
│                                     │
│  ┌─────────────────────────────────┐│
│  │   [Primary Action Button]       ││ ← If applicable
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Examples by Screen:**

| Screen             | Icon | Title                      | Message                                            | Action                   |
| ------------------ | ---- | -------------------------- | -------------------------------------------------- | ------------------------ |
| Dashboard          | 👥   | "No Customers Yet"         | "Tap + to add your first customer"                 | [Add Customer]           |
| Customer Detail    | 📝   | "No Transactions Yet"      | "Record your first transaction with this customer" | (Action buttons visible) |
| Inventory List     | 📦   | "No Inventory Items"       | "Track your product stock levels"                  | [Add Item]               |
| Reports List       | N/A  | N/A                        | (Always shows report options)                      | N/A                      |
| Search Results     | 🔍   | "No Results Found"         | "Try different keywords"                           | None                     |
| Transaction Filter | 📝   | "No Transactions in Range" | "Try a different date range"                       | [Change Filter]          |

**Guidelines:**

- Always center-aligned, vertically centered in available space
- Icon color always #BDBDBD (gray)
- Title always #212121 (black)
- Message always #757575 (gray)
- Keep message helpful and action-oriented
- Include primary action button if user can resolve the empty state
- No empty state on error conditions (use Error State instead)

---

### Loading State Patterns

**1. Full Screen Loading (Initial Load):**

```
Used when: Screen first loads, no cached data
Position: Center of screen
Display:
  - Spinner (32x32 dp, #2196F3)
  - Optional text: "Loading..." (14px, #757575, margin-top 12px)
Background: #FFFFFF or transparent
Duration: Minimum 300ms (avoid flash for fast loads)
```

**2. Skeleton Loading (List Data):**

```
Used when: Loading lists (customers, transactions, etc.)
Display:
  - Gray boxes matching content shape
  - Shimmer animation (left to right gradient)
  - Animation: 1.5s duration, infinite loop
Color: #F5F5F5 (box), shimmer from #EEEEEE to #FAFAFA
Count: Show 5-6 skeleton items for lists
```

**Skeleton Examples:**

- Customer List: Rectangle for avatar + 2 lines text + balance
- Transaction List: 1 line for amount + 1 line for note + date
- Summary Cards: Rectangle matching card size

**3. Inline Loading (Button State):**

```
Used when: Button triggers async action
Display:
  - Small spinner (20x20 dp, #FFFFFF or button text color)
  - Replaces button text
  - Button disabled (opacity 0.6)
Duration: Until API response or timeout
```

**4. Pull-to-Refresh:**

```
Used when: User pulls down to refresh list
Display: Platform-standard refresh indicator
Color: #2196F3
Position: Top of scroll container
Trigger: Pull down >60px, release
```

**5. Pagination Loading:**

```
Used when: Loading more items in infinite scroll
Display:
  - Small spinner at bottom of list (20x20 dp)
  - Text: "Loading more..." (12px, #757575)
Position: Bottom of scroll container
Trigger: Scroll to within 100px of bottom
```

---

### Error State Patterns

**1. Full Screen Error (Page Load Failed):**

```
Used when: Screen fails to load entirely
Display: Error State Component (Component 11)
Actions: [Try Again] [Go to Home]
Examples: Network error, 404, server error
```

**2. Inline Error (Field Validation):**

```
Used when: Form field has validation error
Display:
  - Red text below field (12px, #F44336)
  - Field border changes to #F44336
  - Error icon ⚠️ (16x16) in field (optional)
Position: Directly below invalid field
Clear: When user starts typing (real-time validation)
```

**Common Validation Errors:**

- "Required field" (generic)
- "Please enter a valid 10-digit mobile number"
- "Please enter an amount greater than 0"
- "Invoice must have at least one item"
- "Name must be at least 2 characters"

**3. Toast Notification (Temporary Error):**

```
Used when: Action fails but not critical
Display:
  - Snackbar at bottom (above bottom nav)
  - Background: #F44336 (error) or #FFC107 (warning)
  - Text: #FFFFFF, 14px Medium
  - Icon: ⚠️ or ℹ️ (24x24, #FFFFFF)
  - Action button: "Retry" or "Dismiss" (optional)
Position: Bottom, margin-bottom 72px (above bottom nav)
Duration: 4 seconds (or until dismissed)
Animation: Slide up (appear), slide down (dismiss)
```

**Common Toast Errors:**

- "Failed to save. Please try again."
- "Unable to send reminder."
- "Network error. Check your connection."

**4. Dialog Error (Blocking Action):**

```
Used when: Critical error requires acknowledgment
Display:
  - Modal dialog, center of screen
  - Icon: ⚠️ (48x48, #F44336)
  - Title: 18px SemiBold, #212121
  - Message: 14px Regular, #757575
  - Actions: [Cancel] [Retry] or [OK]
Background: Dim overlay (#000000, opacity 0.5)
```

**Examples:**

- "Cannot delete customer with transactions"
- "Session expired. Please log in again."
- "Payment failed. Try again or contact support."

---

### Offline State Patterns

**1. Offline Banner (Persistent):**

```
Display: Component 12 (Offline Banner)
Position: Top of screen, below status bar, above all content
Visibility: Shown on ALL screens when offline
States:
  - Offline: "⚡ Offline - Data will sync when online" (#FFC107 background)
  - Pending: "⚡ Offline - 3 changes pending" (#FFC107)
  - Syncing: "🔄 Syncing... 2 of 5" (#E3F2FD, blue tint)
```

**2. Offline Data Handling:**

**Lists (Dashboard, Customers, Transactions):**

- Show cached data
- Gray timestamp: "Last updated: 5 min ago"
- Pull-to-refresh disabled (shows toast if attempted)

**Create/Edit Actions:**

- Allow all actions
- Save to local WatermelonDB
- Add to sync queue
- Show toast: "Saved locally. Will sync when online."
- Visual indicator: Sync pending icon (🔄) on items

**API-Dependent Screens (Invoices, Reports, Analytics):**

- Show cached PDF if available
- Reports: Show "Requires internet" message
- Disable actions that require server (PDF generation, reminders)

**3. Sync Indicators:**

**In Lists:**

- Items pending sync show small 🔄 icon (12x12 dp, #FFC107)
- Tooltip on tap: "Pending sync"

**In Sync Status (Settings):**

- "✓ All synced (2 min ago)" - Green
- "🔄 Syncing... 5 items" - Blue with progress
- "⚠️ 3 pending changes" - Orange
- "❌ Sync failed" - Red with retry button

**4. Offline Behavior by Feature:**

| Feature          | Offline Behavior               |
| ---------------- | ------------------------------ |
| View Lists       | ✅ Works (cached data)         |
| Add Customer     | ✅ Works (saves locally)       |
| Add Transaction  | ✅ Works (saves locally)       |
| Edit Data        | ✅ Works (saves locally)       |
| Delete           | ✅ Works (soft delete locally) |
| Send Reminder    | ⚠️ Queued (sends when online)  |
| Generate Invoice | ❌ Disabled (requires server)  |
| Generate Reports | ❌ Disabled (requires server)  |
| Payment Links    | ❌ Disabled (requires server)  |
| PDF Download     | ⚠️ Works if PDF already cached |

---

### Success State Patterns

**1. Toast Notifications (Success):**

```
Display:
  - Snackbar at bottom
  - Background: #00C853 (success green)
  - Icon: ✓ (24x24, #FFFFFF)
  - Text: #FFFFFF, 14px Medium
Position: Bottom, above bottom nav
Duration: 3 seconds
Animation: Slide up (appear), fade out (dismiss)
```

**Examples:**

- "✓ Transaction saved"
- "✓ Customer added"
- "✓ Invoice created"
- "✓ Reminder sent"

**2. Success with Undo:**

```
Display: Toast with action button
Message: "✓ Transaction saved"
Action: [Undo] button (white text, no background)
Duration: 5 seconds (longer to allow undo)
Behavior: Tap Undo → Calls undo API → Updates UI
```

**3. Success Animations (Micro-interactions):**

- Checkmark fade-in (200ms) on successful save
- Item highlight (green background fade, 500ms) when added to list
- Balance update (number count-up animation, 300ms)

---

## 7. Implementation Checklist

### P0 Screens (MVP - Must Have)

**Authentication Flow:**

- [ ] Screen 0: Language Selection (11+ languages with native scripts)
- [ ] Screen 1: Login (Phone Input)
- [ ] Screen 2: OTP Verification
- [ ] Screen 3: Profile Setup (First-Time)
- [ ] Screen 4: Create First Khatabook

**Main Application:**

- [ ] Screen 5: Dashboard/Home (Summary + Customer List)
- [ ] Screen 6: Customer Detail (Transaction History)
- [ ] Screen 7: Add/Edit Transaction
- [ ] Screen 8: Send Reminder (WhatsApp/SMS)
- [ ] Screen 9: Reports List
- [ ] Screen 15: Settings
- [ ] Screen 16: Error/404 Page

**Modals & Overlays (P0):**

- [ ] FAB Action Sheet (Add Customer / Transaction)
- [ ] Customer Selector Modal
- [ ] Sort/Filter Modals
- [ ] Date Range Picker
- [ ] Confirmation Dialogs
- [ ] Success/Error Toasts

---

### P1 Screens (Important)

**Invoicing:**

- [ ] Screen 10: Create Invoice
- [ ] Screen 11: Invoice Preview
- [ ] Invoice Settings Screen

**Payments:**

- [ ] Screen 13B: Generate Payment Link (UPI/cards/wallets)
- [ ] Payment Status Tracking

**Analytics:**

- [ ] Screen 14: Advanced Analytics/Dashboard

**Multi-Ledger:**

- [ ] Khatabook Switcher Modal (fully specified)
- [ ] Create New Khatabook Screen

**Additional Modals:**

- [ ] Settlement Confirmation Dialog
- [ ] Sync Queue Details Modal
- [ ] Language Selector Modal (11 languages)

**Additional:**

- [ ] Add Customer Screen (form)
- [ ] Edit Customer Screen
- [ ] Transaction Detail Screen (view/edit existing)
- [ ] Invoice List Screen

---

### P2 Screens (Nice to Have)

**Inventory:**

- [ ] Screen 12: Inventory List
- [ ] Screen 13: Add/Edit Inventory Item
- [ ] Inventory Search Screen

**Other:**

- [ ] Search Customers Screen
- [ ] Language Selector (full screen version)
- [ ] Edit Profile Screen
- [ ] Set PIN Screen

---

### Component Implementation Priority

**P0 Components (Build First):**

1. [ ] Summary Card (used in Dashboard)
2. [ ] Customer List Item (used in Dashboard, lists)
3. [ ] Transaction List Item (used in Customer Detail)
4. [ ] Action Button Pair (used in Customer Detail)
5. [ ] Amount Input with Numpad (used in Add Transaction)
6. [ ] Bottom Tab Navigation (used everywhere)
7. [ ] FAB (used in Dashboard, Inventory)
8. [ ] Top App Bar (used in all screens)
9. [ ] Empty State (used in all list screens)
10. [ ] Loading State (skeleton, spinners)
11. [ ] Offline Banner (used globally)

**P1 Components:** 12. [ ] Error State (comprehensive error handling) 13. [ ] Invoice Item Card (used in Create Invoice) 14. [ ] Chart Components (used in Analytics)

---

### Testing Checklist

**Visual Regression:**

- [ ] All 16 screens match specifications pixel-perfect
- [ ] All colors match design system (use color picker to verify)
- [ ] All spacing follows 8px grid
- [ ] All touch targets minimum 44x44 dp
- [ ] All fonts match typography scale

**Interaction Testing:**

- [ ] All tap actions work as specified
- [ ] Swipe actions function (delete, quick actions)
- [ ] Long press shows context menus
- [ ] Pull-to-refresh reloads data
- [ ] Infinite scroll pagination works

**State Testing:**

- [ ] Empty states appear when no data
- [ ] Loading states show during API calls
- [ ] Error states appear on failures
- [ ] Offline banner appears when offline
- [ ] Success toasts show after actions

**Navigation Testing:**

- [ ] All navigation flows work as mapped
- [ ] Back button behavior correct on each screen
- [ ] Bottom tabs navigate correctly
- [ ] Modals dismiss properly
- [ ] Deep links work (if implemented)

**Responsive Testing:**

- [ ] Works on small phones (iPhone SE, 320px width)
- [ ] Works on large phones (iPhone Pro Max, 428px width)
- [ ] Works on tablets (iPad, 768px+ width)
- [ ] Safe areas respected (iOS notch, Android gesture bar)
- [ ] Keyboard doesn't cover inputs

**Accessibility:**

- [ ] All interactive elements labeled for screen readers
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Touch targets 44x44 dp minimum
- [ ] Works with device text size scaling

---

## Appendix: Related Documents

- [Product Requirements Document (PRD)](./docs/superpowers/specs/PRD.md)
- [Technical Architecture (TECH_STACK)](./docs/superpowers/specs/TECH_STACK.md)
- [Database Schema](./docs/superpowers/specs/DATABASE_SCHEMA.md)
- [API Specification](./API_SPEC.md)

---

## Document Control

| Version | Date       | Author            | Changes                                               |
| ------- | ---------- | ----------------- | ----------------------------------------------------- |
| 1.0     | 2026-04-03 | UI/UX Design Team | Initial screen specifications - complete and approved |

---

**END OF DOCUMENT**

_This Screen Specification Document has been reviewed and approved for implementation. All 16 screens are fully specified with layouts, components, interactions, and navigation flows. Ready for React Native development._
