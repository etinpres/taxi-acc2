'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppData } from '@/hooks/use-app-data';
import { useMonthlySummary } from '@/hooks/use-monthly-summary';
import { getToday, getCurrentMonth, formatMonth } from '@/lib/date-utils';
import { getGoalProgress, formatCurrency } from '@/lib/data-utils';
import { Modal } from '@/components/common/modal';
import { GoalProgressCard } from '@/components/goal/goal-progress';
import { MonthlyGoalForm } from '@/components/goal/monthly-goal-form';
import { IncomeForm } from '@/components/transactions/income-form';
import { ExpenseForm } from '@/components/transactions/expense-form';
import { CalendarGrid } from '@/components/calendar/calendar-grid';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const today = getToday();
  const currentMonth = getCurrentMonth();
  const { data } = useAppData();
  const summary = useMonthlySummary(currentMonth);
  const goalProgress = getGoalProgress(data, currentMonth);
  const router = useRouter();

  const [modal, setModal] = useState<'income' | 'expense' | 'goal' | null>(null);

  const handleSelectDate = (date: string) => {
    router.push(`/daily?date=${date}`);
  };

  return (
    <div className="space-y-2">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 pt-3 pb-4 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-white">고도비만 택시장부</h1>
          <span className="text-xs text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">{formatMonth(currentMonth)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-[10px] font-medium text-blue-200">수입</p>
            <p className="text-sm font-bold text-white">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-[10px] font-medium text-blue-200">지출</p>
            <p className="text-sm font-bold text-white">{formatCurrency(summary.totalExpense)}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-[10px] font-medium text-blue-200">순이익</p>
            <p className={`text-sm font-bold ${summary.netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>{formatCurrency(summary.netProfit)}</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <GoalProgressCard goalProgress={goalProgress} onSetGoal={() => setModal('goal')} />
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <button
          onClick={() => setModal('income')}
          className="btn-press flex items-center justify-center gap-1.5 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} /> 수입 추가
        </button>
        <button
          onClick={() => setModal('expense')}
          className="btn-press flex items-center justify-center gap-1.5 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors"
        >
          <Plus size={14} /> 지출 추가
        </button>
      </div>

      <div className="bg-white rounded-xl mx-4 p-3 shadow-sm">
        <CalendarGrid month={currentMonth} data={data} onSelectDate={handleSelectDate} />
      </div>

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">근무 현황</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">근무일</p>
            <p className="text-lg font-bold text-gray-900">{summary.workingDays}일</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">휴무일</p>
            <p className="text-lg font-bold text-blue-500">{summary.daysOffCount}일</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">일평균 수입</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.avgIncomePerWorkDay)}</p>
          </div>
        </div>
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
    </div>
  );
}
