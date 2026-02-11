'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/use-app-data';
import { useMonthlySummary } from '@/hooks/use-monthly-summary';
import { getToday } from '@/lib/date-utils';
import { DateNavigator } from '@/components/common/date-navigator';
import { Modal } from '@/components/common/modal';
import { DrivingForm } from '@/components/driving/driving-form';
import { DrivingStats } from '@/components/driving/driving-stats';
import { Car, Route, Clock, Edit2 } from 'lucide-react';

export default function DrivingPage() {
  const [date, setDate] = useState(getToday());
  const { data } = useAppData();
  const month = date.slice(0, 7);
  const monthlySummary = useMonthlySummary(month);
  const [formOpen, setFormOpen] = useState(false);

  const todayLog = data.drivingLogs.find((d) => d.date === date);

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-lg font-bold px-4 pt-2">운행 기록</h1>
      <DateNavigator date={date} onChange={setDate} mode="day" />

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">오늘의 운행</h2>
          <button onClick={() => setFormOpen(true)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            <Edit2 size={12} /> {todayLog ? '수정' : '입력'}
          </button>
        </div>
        {todayLog ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
              <Car size={20} className="text-blue-600" />
              <span className="text-lg font-bold">{todayLog.tripCount}</span>
              <span className="text-[10px] text-gray-500">운행 횟수</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
              <Route size={20} className="text-green-600" />
              <span className="text-lg font-bold">{todayLog.distanceKm}</span>
              <span className="text-[10px] text-gray-500">km</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
              <Clock size={20} className="text-amber-600" />
              <span className="text-lg font-bold">{todayLog.drivingHours}</span>
              <span className="text-[10px] text-gray-500">시간</span>
            </div>
          </div>
        ) : (
          <button onClick={() => setFormOpen(true)} className="w-full py-6 text-center border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500">
            운행 기록을 입력해주세요
          </button>
        )}
      </div>

      <DrivingStats monthlySummary={monthlySummary} />

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="운행 기록">
        <DrivingForm date={date} onSuccess={() => setFormOpen(false)} />
      </Modal>
    </div>
  );
}
