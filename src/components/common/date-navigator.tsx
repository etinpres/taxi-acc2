'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatMonth, getPrevDay, getNextDay, getPrevMonth, getNextMonth, getToday, getCurrentMonth } from '@/lib/date-utils';

interface DateNavigatorProps {
  date: string;
  onChange: (date: string) => void;
  mode: 'day' | 'month';
}

export function DateNavigator({ date, onChange, mode }: DateNavigatorProps) {
  const label = mode === 'day' ? formatDate(date) : formatMonth(date);
  const isToday = mode === 'day' ? date === getToday() : date === getCurrentMonth();

  const handlePrev = () => {
    onChange(mode === 'day' ? getPrevDay(date) : getPrevMonth(date));
  };

  const handleNext = () => {
    onChange(mode === 'day' ? getNextDay(date) : getNextMonth(date));
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
        <ChevronLeft size={20} />
      </button>
      <span className="text-base font-semibold text-gray-900">{label}</span>
      <button
        onClick={handleNext}
        disabled={isToday}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
