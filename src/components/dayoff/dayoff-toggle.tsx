'use client';

import { useAppData } from '@/hooks/use-app-data';

interface DayOffToggleProps {
  date: string;
}

export function DayOffToggle({ date }: DayOffToggleProps) {
  const { data, dispatch } = useAppData();
  const isDayOff = data.daysOff.includes(date);

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_DAY_OFF', payload: date });
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        isDayOff
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${isDayOff ? 'bg-white' : 'bg-gray-400'}`} />
      {isDayOff ? '휴무일' : '휴무일 설정'}
    </button>
  );
}
