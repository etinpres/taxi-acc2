'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailySummary } from '@/types';
import { getDayLabel } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/data-utils';
import { CHART_COLORS } from '@/lib/chart-colors';

interface Props {
  dailySummaries: DailySummary[];
}

export function TrendBarChart({ dailySummaries }: Props) {
  const chartData = dailySummaries.map((d) => ({
    name: getDayLabel(d.date),
    income: d.totalIncome,
    expense: d.totalExpense,
    isDayOff: d.isDayOff,
  }));

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${v / 1000}K` : v} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="income" name="수입" radius={[2, 2, 0, 0]} maxBarSize={12}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.isDayOff ? '#CBD5E1' : CHART_COLORS.income} />
            ))}
          </Bar>
          <Bar dataKey="expense" name="지출" radius={[2, 2, 0, 0]} maxBarSize={12}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.isDayOff ? '#E2E8F0' : CHART_COLORS.expense} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
