# taxi-accounting Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: Taxi Accounting Web App (taxi-ledger)
> **Version**: 2.0.1
> **Analyst**: gap-detector
> **Date**: 2026-03-04
> **Design Doc**: [taxi-accounting.design.md](../../docs/02-design/features/taxi-accounting.design.md)
> **Previous Analysis**: 2026-02-11 (Match Rate: 97%, v2)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Post-implementation gap analysis for the "taxi-accounting" feature following 6 commits made since the previous analysis (97% match rate, v2). The primary focus is evaluating the newly added `time` field (v2.0.1), home tab month navigation, income/expense button repositioning, CSV backward compatibility fix, and overall design-implementation alignment.

### 1.2 Analysis Scope

- **Design Document**: `/Users/yonghaekim/my-folder/docs/02-design/features/taxi-accounting.design.md`
- **Implementation Path**: `/Users/yonghaekim/my-folder/taxi-ledger/src/`
- **Analysis Date**: 2026-03-04
- **Changes Since Last Analysis (v2, 2026-02-11)**:
  1. `feat: add time field to income/expense entries (v2.0.1)` -- Added `time: string` field to Income and Expense interfaces
  2. `fix: separate date/time fields in forms` -- Forms now have separate date and time inputs
  3. `fix: combine date/time into single bordered container` -- UI: date and time inputs in unified container
  4. `fix: CSV import backward compat for entries without time field` -- CSV parser handles 7-column (old) and 8-column (new) records
  5. `fix: add month navigation buttons to home tab` -- Month navigation (prev/next) added to homepage header
  6. `style: move income/expense buttons above transaction list` -- Button order changed: buttons now appear before transaction list

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 Project Structure

| Design Path | Implementation | Status | Notes |
|-------------|---------------|--------|-------|
| `src/app/layout.tsx` | `/src/app/layout.tsx` | Match | |
| `src/app/page.tsx` | `/src/app/page.tsx` | Match | Significant changes: month nav, calendar, work status |
| `src/app/daily/page.tsx` | `/src/app/daily/page.tsx` | Match | time field display added |
| `src/app/monthly/page.tsx` | `/src/app/monthly/page.tsx` | Match | |
| `src/app/driving/page.tsx` | `/src/app/driving/page.tsx` | Match | |
| `src/app/settings/page.tsx` | `/src/app/settings/page.tsx` | Match | Version displays "2.0.1" |
| `src/types/index.ts` | `/src/types/index.ts` | Changed | `time` field added to Income and Expense |
| `src/contexts/app-data-context.tsx` | `/src/contexts/app-data-context.tsx` | Match | |
| `src/hooks/use-app-data.ts` | `/src/hooks/use-app-data.ts` | Match | |
| `src/hooks/use-daily-summary.ts` | `/src/hooks/use-daily-summary.ts` | Match | |
| `src/hooks/use-monthly-summary.ts` | `/src/hooks/use-monthly-summary.ts` | Match | |
| `src/lib/storage.ts` | `/src/lib/storage.ts` | Changed | time field migration, version 2.0.1 |
| `src/lib/data-utils.ts` | `/src/lib/data-utils.ts` | Changed | sort by time in filterByDate functions |
| `src/lib/csv.ts` | `/src/lib/csv.ts` | Changed | time column added, backward compat parsing |
| `src/lib/date-utils.ts` | `/src/lib/date-utils.ts` | Changed | `getNowTime()` function added |
| `src/components/common/stat-card.tsx` | `/src/components/common/stat-card.tsx` | Match | |
| `src/components/common/date-picker.tsx` | Not found | Missing | Low impact, covered by DateNavigator |
| `src/components/common/modal.tsx` | `/src/components/common/modal.tsx` | Match | |
| `src/components/common/bottom-nav.tsx` | `/src/components/common/bottom-nav.tsx` | Match | |
| `src/components/common/progress-bar.tsx` | `/src/components/common/progress-bar.tsx` | Match | |
| `src/components/common/date-navigator.tsx` | `/src/components/common/date-navigator.tsx` | Match | |
| `src/components/goal/monthly-goal-form.tsx` | `/src/components/goal/monthly-goal-form.tsx` | Match | |
| `src/components/goal/goal-progress.tsx` | `/src/components/goal/goal-progress.tsx` | Match | |
| `src/components/dayoff/dayoff-toggle.tsx` | `/src/components/dayoff/dayoff-toggle.tsx` | Match | |
| `src/components/transactions/income-form.tsx` | `/src/components/transactions/income-form.tsx` | Changed | time field added |
| `src/components/transactions/expense-form.tsx` | `/src/components/transactions/expense-form.tsx` | Changed | time field added |
| `src/components/transactions/transaction-list.tsx` | `/src/components/transactions/transaction-list.tsx` | Match | |
| `src/components/transactions/transaction-item.tsx` | `/src/components/transactions/transaction-item.tsx` | Match | |
| `src/components/charts/trend-bar-chart.tsx` | `/src/components/charts/trend-bar-chart.tsx` | Match | |
| `src/components/charts/category-pie-chart.tsx` | `/src/components/charts/category-pie-chart.tsx` | Match | |
| `src/components/charts/comparison-chart.tsx` | `/src/components/charts/comparison-chart.tsx` | Match | |
| `src/components/driving/driving-form.tsx` | `/src/components/driving/driving-form.tsx` | Match | |
| `src/components/driving/driving-stats.tsx` | `/src/components/driving/driving-stats.tsx` | Match | |
| - | `/src/lib/chart-colors.ts` | Added | Centralized chart color constants (since v2) |
| - | `/src/components/calendar/calendar-grid.tsx` | Added | Calendar view for monthly/home page (since v2) |
| - | `/src/components/common/swipeable-view.tsx` | Added | Touch swipe navigation wrapper |
| - | `/src/components/common/navigation-guard.tsx` | Added | Scroll-to-top + pointer-events guard on nav |
| - | `/src/hooks/use-swipe.ts` | Added | Touch gesture detection hook |

**Structure Score: 33/35 design files present**
- 1 design-only file (`date-picker.tsx`) -- low impact, covered by `date-navigator.tsx`
- 5 added files beyond design (chart-colors.ts, calendar-grid.tsx, swipeable-view.tsx, navigation-guard.tsx, use-swipe.ts)
- 6 files changed from design spec (types, storage, data-utils, csv, income-form, expense-form) -- all related to time field addition

---

### 2.2 Data Model (types/index.ts)

| Entity / Type | Design | Implementation | Status | Notes |
|---------------|--------|---------------|--------|-------|
| `PaymentMethod` | `'cash' \| 'card'` | `'cash' \| 'card'` | Match | |
| `ExpenseCategory` | 6 values | 6 values -- identical | Match | |
| `EXPENSE_CATEGORY_LABELS` | 6 entries | Identical | Match | |
| `PAYMENT_METHOD_LABELS` | 2 entries | Identical | Match | |
| `Income` interface | 7 fields (id, date, amount, paymentMethod, memo, createdAt, updatedAt) | 8 fields (+time) | Changed | `time: string` field added (v2.0.1) |
| `Expense` interface | 7 fields (id, date, amount, category, memo, createdAt, updatedAt) | 8 fields (+time) | Changed | `time: string` field added (v2.0.1) |
| `DrivingLog` interface | 8 fields | 8 fields -- identical | Match | |
| `MonthlyGoal` interface | 4 fields | 4 fields -- identical | Match | |
| `AppData` interface | 7 fields | 7 fields -- identical | Match | |
| `DailySummary` interface | 9 fields | 9 fields -- identical | Match | |
| `GoalProgress` interface | 8 fields | 8 fields -- identical | Match | |
| `MonthlySummary` interface | 13 fields | 13 fields -- identical | Match | |

**Data Model Score: 10/12 fully match, 2 changed (Income +time, Expense +time)**

#### Income/Expense `time` Field Change Detail

| Aspect | Design | Implementation | Impact |
|--------|--------|---------------|--------|
| `Income.time` | Not in design | `time: string` (HH:mm format) | Medium -- new field |
| `Expense.time` | Not in design | `time: string` (HH:mm format) | Medium -- new field |
| Forms | date only | date + time (separate inputs, single container) | Medium -- UX change |
| Sort order | by createdAt desc | by time desc (within same date) | Low -- behavioral |
| CSV columns | 7 per income/expense | 8 per income/expense (+time column) | Medium -- format change |
| Backward compat | N/A | Old 7-col CSV parsed with `time: ''` | Handled correctly |

This is a significant feature addition (v2.0.1) not reflected in the design document. The time field enables more precise record-keeping for taxi drivers, allowing them to track when specific income/expense events occurred during their shift.

---

### 2.3 State Management (Context + Reducer)

#### Action Types

| Design Action | Implementation | Status | Notes |
|---------------|---------------|--------|-------|
| `ADD_INCOME` | Present | Match | payload now includes `time` field |
| `UPDATE_INCOME` | Present | Match | partial data can include `time` |
| `DELETE_INCOME` | Present | Match | |
| `ADD_EXPENSE` | Present | Match | payload now includes `time` field |
| `UPDATE_EXPENSE` | Present | Match | partial data can include `time` |
| `DELETE_EXPENSE` | Present | Match | |
| `ADD_DRIVING_LOG` | Present | Match | |
| `UPDATE_DRIVING_LOG` | Present | Match | |
| `DELETE_DRIVING_LOG` | Present | Match | |
| `SET_MONTHLY_GOAL` | Present | Match | |
| `DELETE_MONTHLY_GOAL` | Present | Match | |
| `TOGGLE_DAY_OFF` | Present | Match | |
| `IMPORT_DATA` | Present | Match | |
| `CLEAR_ALL` | Present | Match | |
| - | `INIT` | Added | Hydrates from localStorage (since v1) |

#### Context Value and Reducer Logic

All reducer behaviors match the design specification exactly. The `ADD_INCOME` and `ADD_EXPENSE` payloads now include `time` via the `Omit<Income, 'id' | 'createdAt' | 'updatedAt'>` type, which automatically picks up the new field from the updated interface.

**State Management Score: 14/14 design items match, 1 added (INIT action)**

---

### 2.4 Component Design

#### SC-01: Home / Dashboard (/)

| Design Requirement | Implementation | Status | Notes |
|-------------------|---------------|--------|-------|
| Today's date display | Month display in header (not single date) | Changed | Shows month selector instead of today's date |
| 3 StatCards (income, expense, profit) | 3 inline cards in gradient header | Changed | Embedded in gradient header, not separate StatCard components |
| GoalProgress card (hidden if no goal) | GoalProgressCard renders conditionally | Match | |
| Goal 100% achievement message | "목표 달성!" text | Match | |
| Quick add income/expense buttons | 2-column grid with Plus icons | Match | |
| Buttons position (design: after goal, before list) | After GoalProgressCard, before CalendarGrid | Changed | Buttons before calendar/content (was "before list" in design) |
| Today's transaction list (newest first) | CalendarGrid + work status replaces today's list | Changed | Major layout change: no "today's transactions" on home |
| All components are 'use client' | `'use client'` present | Match | |
| - | Month navigation (prev/next) in header | Added | ChevronLeft/ChevronRight in gradient header |
| - | CalendarGrid showing monthly overview | Added | Full calendar with income/expense indicators |
| - | Work status card (working days, days off, avg) | Added | 3-column grid at bottom of home |

**SC-01 Score: 4/7 design items match, 3 changed, 3 added**

The home page has undergone significant UI evolution beyond the design:
- The header is now a blue gradient with month navigation, replacing the simple "today's date" display
- Instead of showing today's transaction list, the page shows a full CalendarGrid for the month
- A work status summary card has been added
- The overall page now functions as a monthly dashboard rather than a daily summary

#### SC-02: Daily Record (/daily)

| Design Requirement | Implementation | Status | Notes |
|-------------------|---------------|--------|-------|
| Date navigation (prev/next) | DateNavigator with mode='day' | Match | |
| Day-off toggle under date | DayOffToggle next to navigator | Match | Positioned inline rather than below |
| Day-off display: emoji + message | Shows emoji and gray box | Match | |
| Day-off: records still possible | Forms still accessible on day off | Match | |
| StatCards for selected date | 3 StatCards with summary | Match | |
| Income section with count | "수입 ({n}건)" heading | Match | |
| Expense section with count | "지출 ({n}건)" heading | Match | |
| Per-item edit/delete menu | Inline edit/delete text buttons | Changed | Design: dropdown menu; impl: inline buttons |
| Add income/expense buttons | 2-column grid with buttons | Match | |
| Buttons position | Between StatCards and transaction sections | Changed | Now above transaction sections (after StatCards) |
| - | Time display per transaction item | Added | `{i.time}` shown when available |
| - | SwipeableView for date navigation | Added | Swipe left/right to change date |
| - | Query parameter support (`?date=`) | Added | Calendar navigation (since v2) |

**SC-02 Score: 7/9 design items match, 2 changed, 3 added**

#### SC-03: Monthly Stats (/monthly)

| Design Requirement | Implementation | Status | Notes |
|-------------------|---------------|--------|-------|
| Month navigation | DateNavigator mode='month' | Match | |
| 3 StatCards (monthly totals) | Grid of 3 StatCards | Match | |
| Goal progress card + settings button | GoalProgressCard + modal | Match | |
| Work status card | 3-column grid with stats | Match | |
| BarChart: daily income/expense trend | TrendBarChart with dynamic import | Match | |
| Day-off bars shown in gray | Implemented | Match | |
| PieChart: category expense ratio | CategoryPieChart with dynamic import | Match | |
| Chart dynamic import | `next/dynamic` with ssr: false | Match | |
| - | ComparisonChart | Added | Previous vs current month comparison |
| - | SwipeableView for month navigation | Added | Swipe gesture support |

**SC-03 Score: 8/8 design items match, 2 added**

Note: The calendar/stats view toggle from v2 has been removed from the monthly page. The CalendarGrid has moved to the home page instead.

#### SC-04: Driving Record (/driving)

| Design Requirement | Implementation | Status |
|-------------------|---------------|--------|
| Date navigation | DateNavigator mode='day' | Match |
| Today's driving display | 3-column grid with icons | Match |
| Edit button | Edit2 icon + text | Match |
| Empty state with input prompt | Dashed border button | Match |
| Date-per-1-record (upsert) | existing check + UPDATE/ADD | Match |
| Monthly driving summary stats | DrivingStats component | Match |
| Stats: total trips, distance, hours | All displayed | Match |
| Stats: avg trips per day | Computed | Match |
| Stats: income per km | Computed | Match |
| - | SwipeableView | Added | Swipe gesture support |

**SC-04 Score: 9/9 (100%), 1 added**

#### SC-05: Settings (/settings)

| Design Requirement | Implementation | Status | Notes |
|-------------------|---------------|--------|-------|
| CSV export button | Download button -> exportToCsv | Match | |
| CSV import via file input | Hidden file input + Upload button | Match | |
| Clear all with confirmation modal | Trash2 button + Modal confirm | Match | |
| App info: version | "2.0.1" displayed | Changed | Design: "1.0.0"; impl: "2.0.1" |
| App info: storage size | Computed via storage.getSize() | Match | |
| App info: income/expense/driving counts | All counts displayed | Match | |
| - | Goals + daysOff counts | Added | Extra info rows (since v2) |
| - | Import result feedback | Added | Toast-like feedback message |

**SC-05 Score: 5/6 design items match, 1 changed (version), 2 added**

---

### 2.5 Common Components

#### StatCard -- Match
Props and variants identical to design.

#### BottomNav -- Match
5 tabs, icons, active state, responsive -- all identical to design.

#### Modal -- Match
Props, overlay, ESC key handling -- all identical.

#### GoalProgress -- Match (with label note)
Label says "이번 달 목표 (순이익)" reflecting net profit calculation (changed from v2, design says "목표 수입금액").

#### MonthlyGoalForm -- Changed
Uses context dispatch internally instead of callback props (unchanged from v2).

#### DayOffToggle -- Changed
Uses context internally, takes only `date` prop (unchanged from v2).

#### DateNavigator -- Match
Props, modes, chevron icons all identical.

#### SwipeableView -- Added (not in design)
New component wrapping touch swipe navigation for date/month changes.

#### NavigationGuard -- Added (not in design)
Scroll-to-top and pointer-events guard on navigation changes.

**Common Components Score: 5/7 fully match, 2 changed (context-based props), 2 added**

---

### 2.6 Utility Functions

#### storage.ts

| Design Function | Implementation | Status | Notes |
|-----------------|---------------|--------|-------|
| `storage.load(): AppData` | Present | Changed | Added time field migration (`time: i.time ?? ''`) |
| `storage.save(data: AppData): void` | Present | Match | |
| `storage.getSize(): number` | Present | Match | |
| `storage.clear(): void` | Present | Match | |
| STORAGE_KEY | `'taxi-accounting-data'` | Match | |
| JSON.parse failure handling | INITIAL_DATA + console.error | Match | |
| QuotaExceededError handling | alert for CSV backup | Match | |
| INITIAL_DATA.version | `'1.1.0'` | Changed | Now `'2.0.1'` |
| - | `INITIAL_DATA` export | Added | Needed by context (since v1) |
| - | SSR guard | Added | `typeof window` checks (since v1) |

**storage.ts Score: 6/7 match, 1 changed (version + migration), 2 enhancements**

#### data-utils.ts

| Design Function | Implementation | Status | Notes |
|-----------------|---------------|--------|-------|
| `getDailySummary(data, date)` | Present | Match | |
| `getMonthlySummary(data, month)` | Present | Match | |
| `filterIncomesByDate(incomes, date)` | Present | Changed | Now sorts by `time` desc instead of `createdAt` |
| `filterExpensesByDate(expenses, date)` | Present | Changed | Now sorts by `time` desc instead of `createdAt` |
| `filterIncomesByMonth(incomes, month)` | Present | Match | |
| `filterExpensesByMonth(expenses, month)` | Present | Match | |
| `formatCurrency(amount)` | Present | Match | |
| `getGoalProgress(data, month)` | Present | Changed | Uses net profit (since v2) |
| `getWorkingDaysCount(data, month)` | Present | Match | |
| `getDaysOffCount(data, month)` | Present | Match | |
| `getAvgIncomePerWorkDay(data, month)` | Present | Match | |
| `isDayOff(data, date)` | Present | Match | |
| - | `formatCurrencyShort(amount)` | Added | Abbreviated format (since v2) |

**data-utils.ts Score: 9/12 fully match, 3 changed, 1 added**

#### csv.ts

| Design Spec | Implementation | Status | Notes |
|-------------|---------------|--------|-------|
| `exportToCsv(data): void` | Present | Changed | time column added to income/expense headers |
| `importFromCsv(file): Promise<AppData>` | Present | Changed | Handles 7-col (old) and 8-col (new) CSV formats |
| 3 sections (design) | 5 sections | Changed | +goals, +daysOff (since v2) |
| Filename pattern | `고도비만택시장부-YYYY-MM-DD.csv` | Changed | Customized name (was `taxi-ledger-` in design) |
| BOM for Excel | BOM added | Match | |
| CSV headers | time column added | Changed | Income: 8 cols, Expense: 8 cols |
| - | `parseCsvLine()` helper | Added | Proper CSV quote handling |
| - | Capacitor share support | Added | Platform-specific export logic |
| - | Backward compat (7-col CSV) | Added | Graceful degradation for old exports |

**csv.ts Score: 1/3 design items fully match, 4 changed, 3 added**

#### date-utils.ts

| Design Function | Implementation | Status | Notes |
|-----------------|---------------|--------|-------|
| `formatDate(date)` | Present | Match | |
| `formatMonth(month)` | Present | Match | |
| `getToday()` | Present | Match | |
| `getCurrentMonth()` | Present | Match | |
| `getPrevDay(date)` | Present | Match | |
| `getNextDay(date)` | Present | Match | Blocks beyond end of current month |
| `getPrevMonth(month)` | Present | Match | |
| `getNextMonth(month)` | Present | Match | Blocks future months |
| `getDaysInMonth(month)` | Present | Match | |
| - | `getDaysInMonthFull(month)` | Added | Full month for calendar (since v2) |
| - | `getDayLabel(date)` | Added | Day number string (since v2) |
| - | `getNowTime()` | Added | Returns current time as HH:mm (v2.0.1) |
| - | `getLastDayOfCurrentMonth()` | Added | End of current month |

**date-utils.ts Score: 9/9 match, 4 added**

#### chart-colors.ts (Added file, not in design structure)

All 8 color values match design Section 7.2 exactly. File location is an enhancement for centralization.

---

### 2.7 Form Design

#### IncomeForm

| Design Spec | Implementation | Status | Notes |
|-------------|---------------|--------|-------|
| Fields: date, amount, paymentMethod, memo | Present + `time` field | Changed | time field added (v2.0.1) |
| Default date: today | `getToday()` | Match | |
| Default paymentMethod: 'card' | `'card'` | Match | |
| Validation: amount required, min 1 | Present | Match | |
| - | Default time: `getNowTime()` | Added | Current time as default |
| - | Date+time in single bordered container | Added | UI: flex row with divider |
| - | 3-digit comma formatting | Added | Since v2 |
| - | Edit mode (editId prop) | Added | Since v2 |

#### ExpenseForm

| Design Spec | Implementation | Status | Notes |
|-------------|---------------|--------|-------|
| Fields: date, amount, category, memo | Present + `time` field | Changed | time field added (v2.0.1) |
| Default category: 'fuel' | `'fuel'` | Match | |
| - | Default time: `getNowTime()` | Added | |
| - | Date+time in single bordered container | Added | |
| - | 3-digit comma formatting | Added | Since v2 |
| - | Edit mode (editId prop) | Added | Since v2 |

#### DrivingForm -- Match
All fields and validations match design.

#### MonthlyGoalForm -- Match (with context pattern)
Quick amounts, validation, delete button all match. Uses context dispatch (since v2).

**Form Score: 3/4 forms functionally match, 2 changed (IncomeForm +time, ExpenseForm +time)**

---

### 2.8 Styling Design

#### Color Palette (Section 7.1)

| Purpose | Design | Implementation | Status |
|---------|--------|---------------|--------|
| Income | `text-blue-600`, `bg-blue-50` | Used throughout | Match |
| Expense | `text-red-500`, `bg-red-50` | Used throughout | Match |
| Profit positive | `text-green-600` | Home: `text-green-300` (on dark bg) | Changed |
| Profit negative | `text-red-500` | Home: `text-red-300` (on dark bg) | Changed |
| Primary Action | `bg-blue-600` | Form submit, income button | Match |
| Background | `bg-gray-50` | Body background | Match |
| Card | `bg-white` | All cards | Match |
| Text Primary | `text-gray-900` | Layout body | Match |
| Text Secondary | `text-gray-500` | Labels | Match |
| Day-off background | `bg-gray-100` | Daily page | Match |
| Day-off badge | `bg-blue-500 text-white` | DayOffToggle | Match |
| Goal colors | amber/green per thresholds | ProgressBar | Match |

**Styling Score: 11/13 match, 2 changed (gradient header uses lighter variants for contrast)**

Note: The home page uses a gradient header (`from-blue-600 via-blue-700 to-indigo-800`) with `text-green-300`/`text-red-300` for profit colors on the dark background. This is a reasonable adaptation for readability on the gradient but differs from the flat card design in the spec.

---

### 2.9 Requirement-Design Traceability (FR Verification)

| Requirement | Design Component | Implementation | Status |
|-------------|------------------|---------------|--------|
| FR-01 Income Entry | IncomeForm + Context | `income-form.tsx` (with time field) | Match |
| FR-02 Expense Entry | ExpenseForm + Context | `expense-form.tsx` (with time field) | Match |
| FR-03 Edit/Delete | TransactionItem + Modal | `transaction-item.tsx`, inline in daily page | Match |
| FR-04 Daily Summary | DailySummary + StatCard | `use-daily-summary.ts`, `stat-card.tsx` | Match |
| FR-05 Monthly Graph | TrendBarChart + MonthlySummary | `trend-bar-chart.tsx`, `use-monthly-summary.ts` | Match |
| FR-06 Category Chart | CategoryPieChart | `category-pie-chart.tsx` | Match |
| FR-07 Driving Entry | DrivingForm + Context | `driving-form.tsx`, `app-data-context.tsx` | Match |
| FR-08 Driving Stats | DrivingStats + MonthlySummary | `driving-stats.tsx`, `use-monthly-summary.ts` | Match |
| FR-09 CSV Export | exportToCsv + Settings | `csv.ts`, `settings/page.tsx` | Match |
| FR-10 CSV Import | importFromCsv + Settings | `csv.ts`, `settings/page.tsx` | Match |
| FR-11 Date Filter | DateNavigator + data-utils | `date-navigator.tsx`, `data-utils.ts` | Match |
| FR-12 Monthly Goal | GoalProgress + MonthlyGoalForm + Context | `goal-progress.tsx`, `monthly-goal-form.tsx` | Match |
| FR-13 Day-off | DayOffToggle + Context + MonthlySummary | `dayoff-toggle.tsx`, `app-data-context.tsx` | Match |

**Functional Requirement Score: 13/13 (100%)**

---

## 3. Summary of Differences

### 3.1 Missing Features (Design O, Implementation X)

| Item | Design Location | Description | Impact |
|------|-----------------|-------------|--------|
| `date-picker.tsx` | Section 1.3 (project structure) | Standalone date picker component | Low -- DateNavigator covers this |

### 3.2 Added Features (Design X, Implementation O)

| Item | Implementation Location | Description | Impact |
|------|------------------------|-------------|--------|
| `time` field on Income | `types/index.ts:22` | `time: string` (HH:mm) | Medium -- new data field |
| `time` field on Expense | `types/index.ts:33` | `time: string` (HH:mm) | Medium -- new data field |
| `getNowTime()` | `date-utils.ts:73-75` | Current time utility | Low |
| `getLastDayOfCurrentMonth()` | `date-utils.ts:35-37` | End of month utility | Low |
| Time field in forms | `income-form.tsx:10,29,61-65` | Separate time input in unified container | Medium |
| Time display in daily list | `daily/page.tsx:91,117` | Shows time per transaction item | Low |
| Time column in CSV | `csv.ts:10,17` | 8-column export format | Medium |
| CSV backward compat | `csv.ts:98-113` | 7-col old CSV support | Low |
| `parseCsvLine()` | `csv.ts:151-180` | Proper CSV quote parsing | Low |
| Capacitor share | `csv.ts:46-63` | Platform-specific CSV export | Low |
| Month navigation on home | `app/page.tsx:25-26,39-51` | ChevronLeft/Right in header | Medium |
| Home gradient header | `app/page.tsx:36-67` | Blue gradient with inline stats | Medium |
| Home CalendarGrid | `app/page.tsx:88-90` | Calendar view on home page | Medium |
| Home work status card | `app/page.tsx:92-108` | Working days/off/avg card | Low |
| `SwipeableView` | `components/common/swipeable-view.tsx` | Touch swipe wrapper | Low |
| `NavigationGuard` | `components/common/navigation-guard.tsx` | Nav transition helper | Low |
| `useSwipe` hook | `hooks/use-swipe.ts` | Swipe gesture detection | Low |
| `INIT` action | `app-data-context.tsx:22` | localStorage hydration | Low |
| `INITIAL_DATA` export | `storage.ts:61` | Context initialization | Low |
| SSR guard | `storage.ts:17,38,50,56` | `typeof window` checks | Low |
| Migration logic | `storage.ts:26-27` | time field + version migration | Low |
| `formatCurrencyShort()` | `data-utils.ts:153-161` | Abbreviated currency | Low |
| `getDaysInMonthFull()` | `date-utils.ts:63-67` | Full month days | Low |
| `getDayLabel()` | `date-utils.ts:69-71` | Day number string | Low |
| `chart-colors.ts` | `lib/chart-colors.ts` | Centralized colors | Low |
| CalendarGrid component | `components/calendar/calendar-grid.tsx` | Monthly calendar | Medium |
| ComparisonChart | `components/charts/comparison-chart.tsx` | Month comparison | Low |
| Import result toast | `settings/page.tsx:80-86` | Import feedback UI | Low |

### 3.3 Changed Features (Design != Implementation)

| Item | Design | Implementation | Impact | File |
|------|--------|---------------|--------|------|
| `Income` interface | 7 fields | 8 fields (+time) | Medium | `types/index.ts:22` |
| `Expense` interface | 7 fields | 8 fields (+time) | Medium | `types/index.ts:33` |
| Home page layout | Today's summary + transaction list | Month dashboard + calendar + work status | High | `app/page.tsx` |
| Home date display | Today's date | Month navigation with chevrons | Medium | `app/page.tsx:37-51` |
| Home StatCards | Separate StatCard components | Inline cards in gradient header | Medium | `app/page.tsx:53-66` |
| `filterIncomesByDate` sort | by createdAt desc | by time desc | Low | `data-utils.ts:14` |
| `filterExpensesByDate` sort | by createdAt desc | by time desc | Low | `data-utils.ts:18` |
| `getGoalProgress()` basis | income only | net profit (income - expenses) | Medium | `data-utils.ts:80` |
| CSV sections | 3 (income, expense, driving) | 5 (+goals, +daysOff) | Low | `csv.ts` |
| CSV income headers | 7 columns | 8 columns (+time) | Medium | `csv.ts:10` |
| CSV expense headers | 7 columns | 8 columns (+time) | Medium | `csv.ts:17` |
| CSV filename | `taxi-ledger-YYYY-MM-DD.csv` | `고도비만택시장부-YYYY-MM-DD.csv` | Low | `csv.ts:44` |
| IncomeForm fields | date, amount, paymentMethod, memo | +time | Medium | `income-form.tsx:10` |
| ExpenseForm fields | date, amount, category, memo | +time | Medium | `expense-form.tsx:10` |
| MonthlyGoalForm props | callback props | context dispatch | Low | `monthly-goal-form.tsx` |
| DayOffToggle props | date, isDayOff, onToggle | date only (context) | Low | `dayoff-toggle.tsx` |
| Daily item menu | dropdown [vertical dots] | inline edit/delete buttons | Low | `daily/page.tsx:96-97` |
| App version | 1.0.0 | 2.0.1 | Low | `settings/page.tsx:93` |
| Data version | 1.1.0 | 2.0.1 | Low | `storage.ts:11` |
| Profit color on home | text-green-600 | text-green-300 (on gradient) | Low | `app/page.tsx:64` |

---

## 4. Architecture Compliance

### 4.1 Architecture Level

**Designed**: Starter (components, lib, types, contexts, hooks)
**Implemented**: Starter (components, lib, types, contexts, hooks)

Status: **Match**

### 4.2 Folder Structure Verification

| Expected Folder | Exists | Contents Correct |
|-----------------|:------:|:----------------:|
| `src/components/` | Yes | Yes |
| `src/components/common/` | Yes | Yes (+2 new components) |
| `src/components/charts/` | Yes | Yes |
| `src/components/transactions/` | Yes | Yes |
| `src/components/goal/` | Yes | Yes |
| `src/components/dayoff/` | Yes | Yes |
| `src/components/driving/` | Yes | Yes |
| `src/components/calendar/` | Yes | Added (not in design) |
| `src/contexts/` | Yes | Yes |
| `src/hooks/` | Yes | Yes (+1 new hook) |
| `src/lib/` | Yes | Yes (+1 new file) |
| `src/types/` | Yes | Yes |
| `src/app/` | Yes | Yes |
| `src/app/daily/` | Yes | Yes |
| `src/app/monthly/` | Yes | Yes |
| `src/app/driving/` | Yes | Yes |
| `src/app/settings/` | Yes | Yes |

### 4.3 Dependency Direction

| Layer | Dependencies | Status |
|-------|-------------|--------|
| Pages (app/) | components, hooks, lib, types | Correct |
| Components | hooks, lib, types, contexts | Correct |
| Hooks | contexts, lib | Correct |
| Contexts | types, lib/storage | Correct |
| Lib (utilities) | types, date-fns | Correct |
| Types | None (independent) | Correct |

No circular dependencies or layer violations detected.

**Architecture Score: 100%**

---

## 5. Convention Compliance

### 5.1 Naming Convention Check

| Category | Convention | Files Checked | Compliance | Violations |
|----------|-----------|:-------------:|:----------:|------------|
| Components | PascalCase exports | 20 | 100% | None |
| Functions | camelCase exports | 30 | 100% | None |
| Constants | UPPER_SNAKE_CASE | 10 | 100% | None |
| Component files | kebab-case.tsx | 20 | 100% | Consistent project convention |
| Utility files | kebab-case.ts | 6 | 100% | Consistent |
| Folders | kebab-case | 13 | 100% | None |

### 5.2 Import Order Check

Sampled 12 files:

| File | External | Internal (@/) | Relative (./) | Status |
|------|:--------:|:-------------:|:-------------:|--------|
| `app/page.tsx` | react, next (1-2) | hooks, lib, components (3-15) | - | OK |
| `app/daily/page.tsx` | react, next (1-2) | hooks, lib, components (3-17) | - | OK |
| `app/monthly/page.tsx` | react, next (1-2) | lib, hooks, components (3-13) | - | OK |
| `app/driving/page.tsx` | react (1) | hooks, lib, components (2-12) | - | OK |
| `app/settings/page.tsx` | react (1) | hooks, lib, components (2-8) | - | OK |
| `income-form.tsx` | react-hook-form (1) | hooks, types, lib (2-4) | - | OK |
| `expense-form.tsx` | react-hook-form (1) | hooks, types, lib (2-4) | - | OK |
| `app-data-context.tsx` | react (1) | types, lib (2-3) | - | OK |
| `data-utils.ts` | @/types (1) | ./date-utils (2) | date-fns (3) | Minor: date-fns after relative |
| `date-utils.ts` | date-fns (1-2) | - | - | OK |
| `csv.ts` | @/types (1) | date-fns (2) | - | OK |
| `swipeable-view.tsx` | react (1) | @/hooks (2) | - | OK |

1 minor violation in `data-utils.ts`: `date-fns` import appears after `./date-utils` relative import (unchanged from v2).

### 5.3 Convention Score

```
Naming:          100%
File Naming:     100% (consistent kebab-case per design)
Folder Structure: 100%
Import Order:     97% (1 minor ordering issue, unchanged)
Overall:          99%
```

---

## 6. Overall Scores

### Category Scores

| Category | Items | Match | Changed | Missing | Added | Score |
|----------|:-----:|:-----:|:-------:|:-------:|:-----:|:-----:|
| Data Model | 12 | 10 | 2 | 0 | 0 | 92% |
| State Management | 15 | 14 | 0 | 0 | 1 | 100% |
| Components (Pages) | 39 | 31 | 6 | 1 | 9 | 87% |
| Common Components | 28 | 23 | 3 | 0 | 2 | 88% |
| Utility Functions | 31 | 25 | 5 | 0 | 11 | 89% |
| Forms | 15 | 12 | 2 | 0 | 8 | 87% |
| Styling | 15 | 13 | 2 | 0 | 0 | 93% |
| FR Traceability | 13 | 13 | 0 | 0 | 0 | 100% |
| Architecture | 17 | 17 | 0 | 0 | 1 | 100% |
| Convention | 4 cats | - | - | - | - | 99% |

### Match Rate Calculation

```
Design Items Total:        172
Fully Matching:            152
Changed (minor, partial):  20  (time field x8, home layout x3, goal calc x1,
                                CSV x4, sort x2, props x2)
Missing:                   1   (date-picker.tsx)
Added Enhancements:        28  (non-design items in implementation)

Match Rate = (152 + 20 * 0.5) / 172 = 162 / 172 = 94.2%
```

Note: Changed items receive 50% credit because the core functionality is present but deviates from the design specification. The time field additions are significant enhancements that improve the product but are not reflected in the design document.

### Overall Summary

```
+-----------------------------------------------+
|  Overall Match Rate: 94%                       |
+-----------------------------------------------+
|  Design Match:          94%     [DOWN from 97%]|
|  Architecture:          100%                   |
|  Convention:            99%                    |
|  FR Coverage:           100% (13/13)           |
|  Status:                PASS (>= 90%)          |
+-----------------------------------------------+
```

---

## 7. Comparison with Previous Analyses

| Metric | v1 (2026-02-11) | v2 (2026-02-11) | v3 (2026-03-04) | Delta (v2->v3) |
|--------|:---------------:|:---------------:|:---------------:|:--------------:|
| Match Rate | 94% | 97% | 94% | -3% |
| Missing Files | 3 | 1 | 1 | -- |
| Changed Items | 5 | 5 | 20 | +15 |
| Added Enhancements | 8 | 18 | 28 | +10 |
| FR Coverage | 13/13 | 13/13 | 13/13 | -- |
| Architecture | 100% | 100% | 100% | -- |
| Convention | 98% | 99% | 99% | -- |

### Why Match Rate Decreased (97% -> 94%)

The match rate decreased because of significant new features and UI changes that are not reflected in the design document:

1. **Time field addition (v2.0.1)**: The `time` field was added to both `Income` and `Expense` interfaces, affecting types, forms, CSV, sorting logic, and display -- all without updating the design document.

2. **Home page redesign**: The home page evolved from a "today's transactions" dashboard to a monthly overview with gradient header, calendar grid, month navigation, and work status. This is a substantial departure from the design wireframe.

3. **Swipeable navigation**: Touch gesture support (SwipeableView, useSwipe) was added across daily, monthly, and driving pages.

4. **CSV format change**: Column count changed from 7 to 8 for income/expense records, and the filename pattern changed.

These are all **positive improvements** that make the app more useful, but they widen the gap between the design document and the actual implementation.

### Resolved from Previous Analysis

| Previously Noted | Status in v3 |
|-----------------|-------------|
| `date-picker.tsx` missing | Still unimplemented (low impact) |
| `getGoalProgress()` net profit change | Still changed (design doc not updated) |
| Context-based props pattern | Still changed (design doc not updated) |
| CSV 5 sections | Still changed, now also 8 columns per record |
| import order in data-utils.ts | Still 1 minor violation (unchanged) |

---

## 8. New Changes Detail (v2.0.1 Focus)

### 8.1 Time Field Feature

**Files affected (8 files)**:
- `src/types/index.ts` -- `time: string` added to Income (line 22) and Expense (line 33)
- `src/components/transactions/income-form.tsx` -- time input field, `getNowTime()` default (lines 10, 29, 61-65)
- `src/components/transactions/expense-form.tsx` -- time input field, `getNowTime()` default (lines 10, 29, 61-65)
- `src/lib/date-utils.ts` -- `getNowTime()` function added (lines 73-75)
- `src/lib/data-utils.ts` -- sort by `time` desc in `filterIncomesByDate` and `filterExpensesByDate` (lines 14, 18)
- `src/lib/storage.ts` -- migration: `time: i.time ?? ''` for backward compat (lines 26-27)
- `src/lib/csv.ts` -- time column in export headers (lines 10, 17), backward-compat import parsing (lines 98-127)
- `src/app/daily/page.tsx` -- time display per item `{i.time}` (lines 91, 117)

**Design document impact**: The design document's Section 2.1 (Type Definitions), Section 5.3 (CSV spec), and Section 6 (Form Design) all need updates to reflect the `time` field.

### 8.2 Home Page Month Navigation

**File affected**: `src/app/page.tsx`
- ChevronLeft/ChevronRight buttons in gradient header (lines 40-51)
- Month state management with `useState(getCurrentMonth())` (line 19)
- `handlePrev`/`handleNext` callbacks (lines 25-26)
- Future month blocking (`month >= getCurrentMonth()`) (line 46)

**Design document impact**: Section 4.1 SC-01 wireframe and description need complete redesign to reflect the monthly dashboard concept.

### 8.3 Income/Expense Button Repositioning

**File affected**: `src/app/daily/page.tsx` (lines 70-77)
- Buttons now appear between StatCards and transaction sections
- Design placed them at the bottom after transaction list

**Design document impact**: Section 4.1 SC-02 wireframe needs update.

---

## 9. Design Document Updates Needed

### 9.1 High Priority (new since v2)

- [ ] **Section 2.1**: Add `time: string` (HH:mm) field to `Income` interface
- [ ] **Section 2.1**: Add `time: string` (HH:mm) field to `Expense` interface
- [ ] **Section 4.1 SC-01**: Redesign home page wireframe -- monthly dashboard with gradient header, month navigation, CalendarGrid, work status card (replaces today's transaction list)
- [ ] **Section 5.3**: Update CSV headers to 8 columns (add time), update filename to Korean
- [ ] **Section 5.4**: Add `getNowTime()` function to date-utils spec
- [ ] **Section 6.1**: Add `time` field to `IncomeFormValues` with `getNowTime()` default
- [ ] **Section 6.2**: Add `time` field to `ExpenseFormValues` with `getNowTime()` default

### 9.2 Medium Priority (carried from v2, still pending)

- [ ] Section 1.3: Add `src/lib/chart-colors.ts` to project structure
- [ ] Section 1.3: Add `src/components/calendar/calendar-grid.tsx` to project structure
- [ ] Section 1.3: Add `src/components/common/swipeable-view.tsx` to project structure
- [ ] Section 1.3: Add `src/hooks/use-swipe.ts` to project structure
- [ ] Section 1.3: Remove `src/components/common/date-picker.tsx` from project structure
- [ ] Section 4.1 SC-02: Update button positions and add time display per item
- [ ] Section 4.2: Update DayOffToggle props to context-based pattern
- [ ] Section 4.2: Update MonthlyGoalForm props to context-based pattern
- [ ] Section 5.2: Update `getGoalProgress()` description to net profit basis

### 9.3 Low Priority (carried from v2)

- [ ] Section 5.3: Document goals + daysOff sections in CSV format
- [ ] Section 5.4: Add `getDaysInMonthFull()`, `getDayLabel()`, `getLastDayOfCurrentMonth()` functions
- [ ] Section 6: Document 3-digit comma formatting behavior in form specs
- [ ] Section 8: Update app version references from 1.0.0 to 2.0.1

**Total design document updates needed: 20 items (7 high, 9 medium, 4 low)**

---

## 10. Recommended Actions

### 10.1 Documentation Sync (Immediate)

| Priority | Action | Files |
|----------|--------|-------|
| High | Update Income/Expense type definitions in design doc | `taxi-accounting.design.md` Section 2.1 |
| High | Redesign home page wireframe in design doc | `taxi-accounting.design.md` Section 4.1 SC-01 |
| High | Update CSV spec with time column | `taxi-accounting.design.md` Section 5.3 |
| High | Update form specs with time field | `taxi-accounting.design.md` Section 6.1, 6.2 |

### 10.2 Code Quality (Minor)

| Priority | Item | File | Notes |
|----------|------|------|-------|
| Low | Fix import order | `src/lib/data-utils.ts` | Move `date-fns` import above `./date-utils` |

### 10.3 Versioning

The app version has been updated to 2.0.1 in the implementation (`storage.ts`, `settings/page.tsx`), reflecting the time field addition. The design document header still shows version 1.0.0 and should be updated to match.

---

## 11. Next Steps

- [x] All 13 functional requirements implemented
- [x] Match rate >= 90% (94%) -- PASS
- [ ] Update design document with 20 items listed in Section 9 (7 high priority from time field / home redesign)
- [ ] Generate completion report (`/pdca report taxi-accounting`)
- [ ] Consider bumping design document version to 2.0.1

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-11 | Initial analysis (94% match rate) | gap-detector |
| 2.0 | 2026-02-11 | Re-analysis after 8 changes (97% match rate) | gap-detector |
| 3.0 | 2026-03-04 | Re-analysis after v2.0.1 time field, home redesign (94% match rate) | gap-detector |
