'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/use-app-data';
import { useDailySummary } from '@/hooks/use-daily-summary';
import { getToday, getCurrentMonth, formatDate } from '@/lib/date-utils';
import { getGoalProgress, filterIncomesByDate, filterExpensesByDate, formatCurrency } from '@/lib/data-utils';
import { StatCard } from '@/components/common/stat-card';
import { Modal } from '@/components/common/modal';
import { GoalProgressCard } from '@/components/goal/goal-progress';
import { MonthlyGoalForm } from '@/components/goal/monthly-goal-form';
import { IncomeForm } from '@/components/transactions/income-form';
import { ExpenseForm } from '@/components/transactions/expense-form';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const today = getToday();
  const currentMonth = getCurrentMonth();
  const { data, dispatch } = useAppData();
  const summary = useDailySummary(today);
  const goalProgress = getGoalProgress(data, currentMonth);

  const [modal, setModal] = useState<'income' | 'expense' | 'goal' | 'editIncome' | 'editExpense' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const todayIncomes = filterIncomesByDate(data.incomes, today);
  const todayExpenses = filterExpensesByDate(data.expenses, today);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">고도비만 택시장부</h1>
          <span className="text-xs text-blue-200 bg-white/10 px-2.5 py-1 rounded-full">{formatDate(today)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-[10px] font-medium text-blue-200">수입</p>
            <p className="text-base font-bold text-white mt-0.5">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-[10px] font-medium text-blue-200">지출</p>
            <p className="text-base font-bold text-white mt-0.5">{formatCurrency(summary.totalExpense)}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-[10px] font-medium text-blue-200">순이익</p>
            <p className={`text-base font-bold mt-0.5 ${summary.netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>{formatCurrency(summary.netProfit)}</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <GoalProgressCard goalProgress={goalProgress} onSetGoal={() => setModal('goal')} />
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        <button
          onClick={() => setModal('income')}
          className="btn-press flex items-center justify-center gap-1.5 bg-blue-600 text-white rounded-2xl py-3.5 text-sm font-semibold shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> 수입 추가
        </button>
        <button
          onClick={() => setModal('expense')}
          className="btn-press flex items-center justify-center gap-1.5 bg-red-500 text-white rounded-2xl py-3.5 text-sm font-semibold shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors"
        >
          <Plus size={16} /> 지출 추가
        </button>
      </div>

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">오늘의 내역</h2>
        <TransactionList
          incomes={todayIncomes}
          expenses={todayExpenses}
          onEditIncome={(id) => { setEditId(id); setModal('editIncome'); }}
          onDeleteIncome={(id) => dispatch({ type: 'DELETE_INCOME', payload: id })}
          onEditExpense={(id) => { setEditId(id); setModal('editExpense'); }}
          onDeleteExpense={(id) => dispatch({ type: 'DELETE_EXPENSE', payload: id })}
        />
      </div>

      <Modal isOpen={modal === 'income'} onClose={() => setModal(null)} title="수입 추가">
        <IncomeForm defaultDate={today} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'expense'} onClose={() => setModal(null)} title="지출 추가">
        <ExpenseForm defaultDate={today} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'goal'} onClose={() => setModal(null)} title="월 목표 설정">
        <MonthlyGoalForm month={currentMonth} onClose={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'editIncome'} onClose={() => { setModal(null); setEditId(null); }} title="수입 수정">
        {editId && <IncomeForm editId={editId} onSuccess={() => { setModal(null); setEditId(null); }} />}
      </Modal>
      <Modal isOpen={modal === 'editExpense'} onClose={() => { setModal(null); setEditId(null); }} title="지출 수정">
        {editId && <ExpenseForm editId={editId} onSuccess={() => { setModal(null); setEditId(null); }} />}
      </Modal>
    </div>
  );
}
