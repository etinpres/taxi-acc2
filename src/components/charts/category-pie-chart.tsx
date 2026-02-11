'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseCategory, EXPENSE_CATEGORY_LABELS } from '@/types';
import { formatCurrency } from '@/lib/data-utils';
import { CATEGORY_COLORS } from '@/lib/chart-colors';

interface Props {
  expenseByCategory: Record<ExpenseCategory, number>;
}

export function CategoryPieChart({ expenseByCategory }: Props) {
  const data = (Object.entries(expenseByCategory) as [ExpenseCategory, number][])
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: EXPENSE_CATEGORY_LABELS[key],
      value,
      color: CATEGORY_COLORS[key],
    }));

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return <p className="text-center text-sm text-gray-400 py-8">지출 내역이 없습니다</p>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-[130px] h-[130px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" stroke="none">
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-gray-700">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{Math.round((d.value / total) * 100)}%</span>
              <span className="font-medium text-gray-900 w-20 text-right">{formatCurrency(d.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
