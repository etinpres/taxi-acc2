export type PaymentMethod = 'cash' | 'card';

export type ExpenseCategory = 'fuel' | 'food' | 'repair' | 'toll' | 'insurance' | 'other';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  fuel: '유류비',
  food: '식비',
  repair: '수리/정비',
  toll: '통행료',
  insurance: '보험료',
  other: '기타',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: '현금',
  card: '카드',
};

export interface Income {
  id: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface DrivingLog {
  id: string;
  date: string;
  tripCount: number;
  distanceKm: number;
  drivingHours: number;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyGoal {
  month: string;
  targetAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  incomes: Income[];
  expenses: Expense[];
  drivingLogs: DrivingLog[];
  monthlyGoals: MonthlyGoal[];
  daysOff: string[];
  version: string;
  lastUpdated: string;
}

export interface DailySummary {
  date: string;
  totalIncome: number;
  cashIncome: number;
  cardIncome: number;
  totalExpense: number;
  netProfit: number;
  incomeCount: number;
  expenseCount: number;
  isDayOff: boolean;
}

export interface GoalProgress {
  month: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  remainingAmount: number;
  remainingDays: number;
  dailyTarget: number;
  isAchieved: boolean;
}

export interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  totalTrips: number;
  totalDistanceKm: number;
  totalDrivingHours: number;
  dailySummaries: DailySummary[];
  expenseByCategory: Record<ExpenseCategory, number>;
  workingDays: number;
  daysOffCount: number;
  avgIncomePerWorkDay: number;
  goalProgress: GoalProgress | null;
}
