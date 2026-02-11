'use client';

import { formatCurrency } from '@/lib/data-utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface StatCardProps {
  label: string;
  amount: number;
  variant: 'income' | 'expense' | 'profit';
}

const config = {
  income: { bg: 'bg-blue-50', text: 'text-blue-600', icon: TrendingUp, iconBg: 'bg-blue-100' },
  expense: { bg: 'bg-red-50', text: 'text-red-500', icon: TrendingDown, iconBg: 'bg-red-100' },
};

export function StatCard({ label, amount, variant }: StatCardProps) {
  const isProfit = variant === 'profit';
  const isPositive = amount >= 0;
  const bg = isProfit ? (isPositive ? 'bg-green-50' : 'bg-red-50') : config[variant].bg;
  const text = isProfit ? (isPositive ? 'text-green-600' : 'text-red-500') : config[variant].text;
  const Icon = isProfit ? Wallet : config[variant].icon;
  const iconBg = isProfit ? (isPositive ? 'bg-green-100' : 'bg-red-100') : config[variant].iconBg;

  return (
    <div className={`rounded-2xl p-3 ${bg} shadow-sm`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`w-5 h-5 rounded-md ${iconBg} flex items-center justify-center`}>
          <Icon size={12} className={text} strokeWidth={2.5} />
        </div>
        <p className={`text-[10px] font-semibold ${text} opacity-80`}>{label}</p>
      </div>
      <p className={`text-base font-bold ${text} leading-tight`}>{formatCurrency(amount)}</p>
    </div>
  );
}
