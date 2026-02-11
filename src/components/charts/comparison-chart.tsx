'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlySummary } from '@/types';
import { formatCurrency } from '@/lib/data-utils';
import { formatMonth } from '@/lib/date-utils';
import { CHART_COLORS } from '@/lib/chart-colors';

interface Props {
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary;
}

export function ComparisonChart({ currentMonth, previousMonth }: Props) {
  const chartData = [
    {
      name: formatMonth(previousMonth.month),
      income: previousMonth.totalIncome,
      expense: previousMonth.totalExpense,
    },
    {
      name: formatMonth(currentMonth.month),
      income: currentMonth.totalIncome,
      expense: currentMonth.totalExpense,
    },
  ];

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="income" name="수입" fill={CHART_COLORS.income} radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="expense" name="지출" fill={CHART_COLORS.expense} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
