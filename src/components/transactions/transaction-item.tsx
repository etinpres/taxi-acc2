'use client';

import { Income, Expense, PAYMENT_METHOD_LABELS, EXPENSE_CATEGORY_LABELS } from '@/types';
import { formatCurrency } from '@/lib/data-utils';
import { MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

type TransactionItemProps =
  | { type: 'income'; item: Income; onEdit: (id: string) => void; onDelete: (id: string) => void }
  | { type: 'expense'; item: Expense; onEdit: (id: string) => void; onDelete: (id: string) => void };

export function TransactionItem(props: TransactionItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { type, item, onEdit, onDelete } = props;

  const isIncome = type === 'income';
  const label = isIncome
    ? PAYMENT_METHOD_LABELS[(item as Income).paymentMethod]
    : EXPENSE_CATEGORY_LABELS[(item as Expense).category];

  return (
    <div className="flex items-center gap-3 py-3 relative">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-500'}`}>
        {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs px-1.5 py-0.5 rounded ${isIncome ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>{label}</span>
          {item.memo && <span className="text-xs text-gray-400 truncate">{item.memo}</span>}
        </div>
      </div>
      <span className={`text-sm font-semibold ${isIncome ? 'text-blue-600' : 'text-red-500'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
      </span>
      <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-gray-400 hover:text-gray-600">
        <MoreVertical size={16} />
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-full z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[80px]">
          <button onClick={() => { setMenuOpen(false); onEdit(item.id); }} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">수정</button>
          <button onClick={() => { setMenuOpen(false); onDelete(item.id); }} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50">삭제</button>
        </div>
      )}
    </div>
  );
}
