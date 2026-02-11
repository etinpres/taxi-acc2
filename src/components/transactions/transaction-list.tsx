'use client';

import { Income, Expense } from '@/types';
import { TransactionItem } from './transaction-item';

interface TransactionListProps {
  incomes: Income[];
  expenses: Expense[];
  onEditIncome: (id: string) => void;
  onDeleteIncome: (id: string) => void;
  onEditExpense: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

export function TransactionList({ incomes, expenses, onEditIncome, onDeleteIncome, onEditExpense, onDeleteExpense }: TransactionListProps) {
  const all = [
    ...incomes.map((i) => ({ ...i, _type: 'income' as const })),
    ...expenses.map((e) => ({ ...e, _type: 'expense' as const })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (all.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-8">내역이 없습니다</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {all.map((item) =>
        item._type === 'income' ? (
          <TransactionItem key={item.id} type="income" item={item as Income} onEdit={onEditIncome} onDelete={onDeleteIncome} />
        ) : (
          <TransactionItem key={item.id} type="expense" item={item as Expense} onEdit={onEditExpense} onDelete={onDeleteExpense} />
        )
      )}
    </div>
  );
}
