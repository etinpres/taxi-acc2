'use client';

import { useMemo } from 'react';
import { useAppData } from './use-app-data';
import { getDailySummary } from '@/lib/data-utils';

export function useDailySummary(date: string) {
  const { data } = useAppData();
  return useMemo(() => getDailySummary(data, date), [data, date]);
}
