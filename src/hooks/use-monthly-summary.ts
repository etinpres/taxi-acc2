'use client';

import { useMemo } from 'react';
import { useAppData } from './use-app-data';
import { getMonthlySummary } from '@/lib/data-utils';

export function useMonthlySummary(month: string) {
  const { data } = useAppData();
  return useMemo(() => getMonthlySummary(data, month), [data, month]);
}
