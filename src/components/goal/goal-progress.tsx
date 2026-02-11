'use client';

import { GoalProgress as GoalProgressType } from '@/types';
import { ProgressBar } from '@/components/common/progress-bar';
import { formatCurrency } from '@/lib/data-utils';
import { Target } from 'lucide-react';

interface GoalProgressProps {
  goalProgress: GoalProgressType | null;
  onSetGoal: () => void;
}

export function GoalProgressCard({ goalProgress, onSetGoal }: GoalProgressProps) {
  if (!goalProgress) {
    return (
      <button onClick={onSetGoal} className="w-full bg-white rounded-xl p-4 border border-dashed border-gray-300 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
        <Target size={24} className="mx-auto text-gray-400 mb-1" />
        <p className="text-sm text-gray-500">이번 달 목표를 설정해보세요</p>
      </button>
    );
  }

  const { targetAmount, currentAmount, progressPercent, remainingAmount, remainingDays, dailyTarget, isAchieved } = goalProgress;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">이번 달 목표 (순이익)</span>
        <button onClick={onSetGoal} className="text-xs text-blue-600 hover:underline">변경</button>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">{progressPercent}%</span>
        <span className="text-xs text-gray-500">
          {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
        </span>
      </div>
      <ProgressBar percent={progressPercent} className="mb-2" />
      {isAchieved ? (
        <p className="text-sm text-green-600 font-semibold text-center">목표 달성!</p>
      ) : (
        <p className="text-xs text-gray-500">
          남은 금액 {formatCurrency(remainingAmount)}
          {remainingDays > 0 && <> &middot; 일평균 {formatCurrency(dailyTarget)} 필요 ({remainingDays}일 남음)</>}
        </p>
      )}
    </div>
  );
}
