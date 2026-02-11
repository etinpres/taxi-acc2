'use client';

import { MonthlySummary } from '@/types';
import { formatCurrency } from '@/lib/data-utils';

interface Props {
  monthlySummary: MonthlySummary;
}

export function DrivingStats({ monthlySummary }: Props) {
  return (
    <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">이번 달 운행 요약</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 운행</span>
          <span className="font-semibold">{monthlySummary.totalTrips}회</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 거리</span>
          <span className="font-semibold">{monthlySummary.totalDistanceKm.toLocaleString()} km</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 시간</span>
          <span className="font-semibold">{monthlySummary.totalDrivingHours}시간</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">근무일 기준 일평균</span>
          <span className="font-semibold">
            {monthlySummary.workingDays > 0
              ? `${Math.round(monthlySummary.totalTrips / monthlySummary.workingDays)}회`
              : '-'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">km당 수입</span>
          <span className="font-semibold">
            {monthlySummary.totalDistanceKm > 0
              ? formatCurrency(Math.round(monthlySummary.totalIncome / monthlySummary.totalDistanceKm))
              : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
