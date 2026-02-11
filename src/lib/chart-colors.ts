import { ExpenseCategory } from '@/types';

export const CHART_COLORS = {
  income: '#2563EB',
  expense: '#EF4444',
  fuel: '#3B82F6',
  food: '#22C55E',
  repair: '#F59E0B',
  toll: '#8B5CF6',
  insurance: '#EC4899',
  other: '#6B7280',
} as const;

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  fuel: CHART_COLORS.fuel,
  food: CHART_COLORS.food,
  repair: CHART_COLORS.repair,
  toll: CHART_COLORS.toll,
  insurance: CHART_COLORS.insurance,
  other: CHART_COLORS.other,
};
