'use client';

import { useMemo } from 'react';
import { parse, getDay, startOfMonth, endOfMonth, eachDayOfInterval, format, isToday } from 'date-fns';
import { AppData, DailySummary } from '@/types';
import { getDailySummary, isDayOff, formatCurrency } from '@/lib/data-utils';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  month: string;
  data: AppData;
  onSelectDate?: (date: string) => void;
}

interface CellData {
  date: string;
  day: number;
  summary: DailySummary;
  isDayOff: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export function CalendarGrid({ month, data, onSelectDate }: Props) {
  const cells = useMemo(() => {
    const start = startOfMonth(parse(month + '-01', 'yyyy-MM-dd', new Date()));
    const end = endOfMonth(start);
    const allDays = eachDayOfInterval({ start, end });
    const today = new Date();

    const startDayOfWeek = getDay(start);
    const blanks: null[] = Array(startDayOfWeek).fill(null);

    const dayCells: CellData[] = allDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      return {
        date: dateStr,
        day: d.getDate(),
        summary: getDailySummary(data, dateStr),
        isDayOff: isDayOff(data, dateStr),
        isToday: isToday(d),
        isFuture: d > today,
      };
    });

    return { blanks, dayCells };
  }, [month, data]);

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`text-center text-[10px] font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
        {cells.blanks.map((_, i) => (
          <div key={`blank-${i}`} className="bg-white p-1 min-h-[72px]" />
        ))}
        {cells.dayCells.map((cell) => {
          const hasIncome = cell.summary.totalIncome > 0;
          const hasExpense = cell.summary.totalExpense > 0;
          const dayOfWeek = getDay(parse(cell.date, 'yyyy-MM-dd', new Date()));

          return (
            <button
              key={cell.date}
              onClick={() => onSelectDate?.(cell.date)}
              disabled={cell.isFuture}
              className={`bg-white p-1 min-h-[72px] text-left flex flex-col transition-colors
                ${cell.isDayOff ? 'bg-gray-50' : ''}
                ${cell.isToday ? 'ring-2 ring-inset ring-blue-500' : ''}
                ${cell.isFuture ? 'opacity-40' : 'hover:bg-blue-50 active:bg-blue-100'}
              `}
            >
              <div className="flex items-center gap-0.5">
                <span
                  className={`text-xs font-medium leading-none ${
                    cell.isToday
                      ? 'bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center'
                      : dayOfWeek === 0
                        ? 'text-red-500'
                        : dayOfWeek === 6
                          ? 'text-blue-500'
                          : 'text-gray-700'
                  }`}
                >
                  {cell.day}
                </span>
                {cell.isDayOff && !cell.isToday && (
                  <span className="text-[8px] text-blue-400 font-medium">휴</span>
                )}
              </div>
              {!cell.isFuture && (hasIncome || hasExpense) && (
                <div className="mt-auto space-y-0.5">
                  {hasIncome && (
                    <p className="text-[9px] text-blue-600 font-medium leading-tight truncate">
                      +{formatCompact(cell.summary.totalIncome)}
                    </p>
                  )}
                  {hasExpense && (
                    <p className="text-[9px] text-red-500 font-medium leading-tight truncate">
                      -{formatCompact(cell.summary.totalExpense)}
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 10_000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '만';
  }
  if (amount >= 10_000) {
    return Math.round(amount / 10_000) + '만';
  }
  return amount.toLocaleString('ko-KR');
}
