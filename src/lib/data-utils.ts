import {
  AppData,
  DailySummary,
  MonthlySummary,
  GoalProgress,
  Income,
  Expense,
  ExpenseCategory,
} from '@/types';
import { getDaysInMonth, getCurrentMonth } from './date-utils';
import { differenceInDays, parse, endOfMonth, startOfMonth, isAfter } from 'date-fns';

export function filterIncomesByDate(incomes: Income[], date: string): Income[] {
  return incomes.filter((i) => i.date === date).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function filterExpensesByDate(expenses: Expense[], date: string): Expense[] {
  return expenses.filter((e) => e.date === date).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function filterIncomesByMonth(incomes: Income[], month: string): Income[] {
  return incomes.filter((i) => i.date.startsWith(month));
}

export function filterExpensesByMonth(expenses: Expense[], month: string): Expense[] {
  return expenses.filter((e) => e.date.startsWith(month));
}

export function isDayOff(data: AppData, date: string): boolean {
  return data.daysOff.includes(date);
}

export function getDailySummary(data: AppData, date: string): DailySummary {
  const incomes = filterIncomesByDate(data.incomes, date);
  const expenses = filterExpensesByDate(data.expenses, date);

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const cashIncome = incomes.filter((i) => i.paymentMethod === 'cash').reduce((s, i) => s + i.amount, 0);
  const cardIncome = incomes.filter((i) => i.paymentMethod === 'card').reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  return {
    date,
    totalIncome,
    cashIncome,
    cardIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    incomeCount: incomes.length,
    expenseCount: expenses.length,
    isDayOff: isDayOff(data, date),
  };
}

export function getWorkingDaysCount(data: AppData, month: string): number {
  const days = getDaysInMonth(month);
  return days.filter((d) => !data.daysOff.includes(d)).length;
}

export function getDaysOffCount(data: AppData, month: string): number {
  const days = getDaysInMonth(month);
  return days.filter((d) => data.daysOff.includes(d)).length;
}

export function getAvgIncomePerWorkDay(data: AppData, month: string): number {
  const workingDays = getWorkingDaysCount(data, month);
  if (workingDays === 0) return 0;
  const totalIncome = filterIncomesByMonth(data.incomes, month).reduce((s, i) => s + i.amount, 0);
  return Math.round(totalIncome / workingDays);
}

export function getGoalProgress(data: AppData, month: string): GoalProgress | null {
  const goal = data.monthlyGoals.find((g) => g.month === month);
  if (!goal) return null;

  const monthIncomes = filterIncomesByMonth(data.incomes, month);
  const monthExpenses = filterExpensesByMonth(data.expenses, month);
  const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const currentAmount = totalIncome - totalExpense;
  const progressPercent = goal.targetAmount > 0 ? Math.round((currentAmount / goal.targetAmount) * 100) : 0;
  const remainingAmount = Math.max(0, goal.targetAmount - currentAmount);
  const isAchieved = currentAmount >= goal.targetAmount;

  const today = new Date();
  const monthEnd = endOfMonth(parse(month + '-01', 'yyyy-MM-dd', new Date()));
  const monthStart = startOfMonth(parse(month + '-01', 'yyyy-MM-dd', new Date()));
  const isCurrentOrFuture = !isAfter(monthStart, today) && !isAfter(today, monthEnd);

  let remainingDays = 0;
  if (isCurrentOrFuture) {
    const daysLeft = differenceInDays(monthEnd, today) + 1;
    const futureDaysOff = data.daysOff.filter((d) => {
      const parsed = parse(d, 'yyyy-MM-dd', new Date());
      return d.startsWith(month) && isAfter(parsed, today);
    }).length;
    remainingDays = Math.max(0, daysLeft - futureDaysOff);
  }

  const dailyTarget = remainingDays > 0 ? Math.ceil(remainingAmount / remainingDays) : 0;

  return {
    month,
    targetAmount: goal.targetAmount,
    currentAmount,
    progressPercent,
    remainingAmount,
    remainingDays,
    dailyTarget,
    isAchieved,
  };
}

export function getMonthlySummary(data: AppData, month: string): MonthlySummary {
  const days = getDaysInMonth(month);
  const dailySummaries = days.map((d) => getDailySummary(data, d));
  const monthIncomes = filterIncomesByMonth(data.incomes, month);
  const monthExpenses = filterExpensesByMonth(data.expenses, month);
  const monthDrivingLogs = data.drivingLogs.filter((d) => d.date.startsWith(month));

  const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const workingDays = getWorkingDaysCount(data, month);
  const daysOffCount = getDaysOffCount(data, month);

  const categories: ExpenseCategory[] = ['fuel', 'food', 'repair', 'toll', 'insurance', 'other'];
  const expenseByCategory = {} as Record<ExpenseCategory, number>;
  for (const cat of categories) {
    expenseByCategory[cat] = monthExpenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
  }

  return {
    month,
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    totalTrips: monthDrivingLogs.reduce((s, d) => s + d.tripCount, 0),
    totalDistanceKm: monthDrivingLogs.reduce((s, d) => s + d.distanceKm, 0),
    totalDrivingHours: monthDrivingLogs.reduce((s, d) => s + d.drivingHours, 0),
    dailySummaries,
    expenseByCategory,
    workingDays,
    daysOffCount,
    avgIncomePerWorkDay: getAvgIncomePerWorkDay(data, month),
    goalProgress: getGoalProgress(data, month),
  };
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

export function formatCurrencyShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(amount) >= 1_000) {
    return (amount / 1_000).toFixed(0) + 'K';
  }
  return amount.toString();
}
