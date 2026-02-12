'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getCurrentMonth, getPrevMonth, getNextMonth } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/data-utils';
import { useMonthlySummary } from '@/hooks/use-monthly-summary';
import { StatCard } from '@/components/common/stat-card';
import { DateNavigator } from '@/components/common/date-navigator';
import { SwipeableView } from '@/components/common/swipeable-view';
import { Modal } from '@/components/common/modal';
import { GoalProgressCard } from '@/components/goal/goal-progress';
import { MonthlyGoalForm } from '@/components/goal/monthly-goal-form';

const TrendBarChart = dynamic(() => import('@/components/charts/trend-bar-chart').then((m) => ({ default: m.TrendBarChart })), { ssr: false });
const CategoryPieChart = dynamic(() => import('@/components/charts/category-pie-chart').then((m) => ({ default: m.CategoryPieChart })), { ssr: false });
const ComparisonChart = dynamic(() => import('@/components/charts/comparison-chart').then((m) => ({ default: m.ComparisonChart })), { ssr: false });

export default function MonthlyPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [goalModal, setGoalModal] = useState(false);
  const summary = useMonthlySummary(month);
  const prevSummary = useMonthlySummary(getPrevMonth(month));

  const handlePrev = useCallback(() => setMonth((m) => getPrevMonth(m)), []);
  const handleNext = useCallback(() => setMonth((m) => getNextMonth(m)), []);

  return (
    <SwipeableView viewKey={month} onPrev={handlePrev} onNext={handleNext} className="space-y-4 pt-2">
      <h1 className="text-lg font-bold px-4 pt-2">월별 통계</h1>

      <DateNavigator date={month} onChange={setMonth} mode="month" />

      <div className="grid grid-cols-3 gap-2 px-4">
        <StatCard label="수입" amount={summary.totalIncome} variant="income" />
        <StatCard label="지출" amount={summary.totalExpense} variant="expense" />
        <StatCard label="순이익" amount={summary.netProfit} variant="profit" />
      </div>

      <div className="px-4">
        <GoalProgressCard goalProgress={summary.goalProgress} onSetGoal={() => setGoalModal(true)} />
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

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">일별 수입/지출 추세</h2>
        <TrendBarChart dailySummaries={summary.dailySummaries} />
        <p className="text-[10px] text-gray-400 mt-1 text-center">* 회색 바 = 휴무일</p>
      </div>

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">지출 카테고리별 비율</h2>
        <CategoryPieChart expenseByCategory={summary.expenseByCategory} />
      </div>

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">월간 비교</h2>
        <ComparisonChart currentMonth={summary} previousMonth={prevSummary} />
      </div>

      <Modal isOpen={goalModal} onClose={() => setGoalModal(false)} title="월 목표 설정">
        <MonthlyGoalForm month={month} onClose={() => setGoalModal(false)} />
      </Modal>
    </SwipeableView>
  );
}
