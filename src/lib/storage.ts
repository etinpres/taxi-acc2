import { AppData } from '@/types';

const STORAGE_KEY = 'taxi-accounting-data';

const INITIAL_DATA: AppData = {
  incomes: [],
  expenses: [],
  drivingLogs: [],
  monthlyGoals: [],
  daysOff: [],
  version: '2.0.1',
  lastUpdated: new Date().toISOString(),
};

export const storage = {
  load(): AppData {
    if (typeof window === 'undefined') return INITIAL_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_DATA;
      const data = JSON.parse(raw) as AppData;
      // 마이그레이션: 이전 버전 호환
      return {
        ...INITIAL_DATA,
        ...data,
        incomes: (data.incomes ?? []).map((i) => ({ ...i, time: i.time ?? '' })),
        expenses: (data.expenses ?? []).map((e) => ({ ...e, time: e.time ?? '' })),
        monthlyGoals: data.monthlyGoals ?? [],
        daysOff: data.daysOff ?? [],
      };
    } catch (e) {
      console.error('localStorage 로드 실패:', e);
      return INITIAL_DATA;
    }
  },

  save(data: AppData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('저장 공간이 부족합니다. 설정에서 CSV 백업 후 오래된 데이터를 삭제해주세요.');
      }
      console.error('localStorage 저장 실패:', e);
    }
  },

  getSize(): number {
    if (typeof window === 'undefined') return 0;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Blob([raw]).size : 0;
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

export { INITIAL_DATA };
