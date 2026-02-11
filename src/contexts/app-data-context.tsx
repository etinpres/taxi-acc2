'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AppData, Income, Expense, DrivingLog } from '@/types';
import { storage, INITIAL_DATA } from '@/lib/storage';

type AppDataAction =
  | { type: 'ADD_INCOME'; payload: Omit<Income, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_INCOME'; payload: { id: string; data: Partial<Income> } }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; data: Partial<Expense> } }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_DRIVING_LOG'; payload: Omit<DrivingLog, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_DRIVING_LOG'; payload: { id: string; data: Partial<DrivingLog> } }
  | { type: 'DELETE_DRIVING_LOG'; payload: string }
  | { type: 'SET_MONTHLY_GOAL'; payload: { month: string; targetAmount: number } }
  | { type: 'DELETE_MONTHLY_GOAL'; payload: string }
  | { type: 'TOGGLE_DAY_OFF'; payload: string }
  | { type: 'IMPORT_DATA'; payload: AppData }
  | { type: 'CLEAR_ALL' }
  | { type: 'INIT'; payload: AppData };

interface AppDataContextValue {
  data: AppData;
  dispatch: React.Dispatch<AppDataAction>;
}

export const AppDataContext = createContext<AppDataContextValue | null>(null);

function appDataReducer(state: AppData, action: AppDataAction): AppData {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'INIT':
      return action.payload;

    case 'ADD_INCOME':
      return {
        ...state,
        incomes: [...state.incomes, { ...action.payload, id: crypto.randomUUID(), createdAt: now, updatedAt: now }],
        lastUpdated: now,
      };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data, updatedAt: now } : item
        ),
        lastUpdated: now,
      };
    case 'DELETE_INCOME':
      return { ...state, incomes: state.incomes.filter((item) => item.id !== action.payload), lastUpdated: now };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: crypto.randomUUID(), createdAt: now, updatedAt: now }],
        lastUpdated: now,
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data, updatedAt: now } : item
        ),
        lastUpdated: now,
      };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((item) => item.id !== action.payload), lastUpdated: now };

    case 'ADD_DRIVING_LOG':
      return {
        ...state,
        drivingLogs: [...state.drivingLogs, { ...action.payload, id: crypto.randomUUID(), createdAt: now, updatedAt: now }],
        lastUpdated: now,
      };
    case 'UPDATE_DRIVING_LOG':
      return {
        ...state,
        drivingLogs: state.drivingLogs.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data, updatedAt: now } : item
        ),
        lastUpdated: now,
      };
    case 'DELETE_DRIVING_LOG':
      return { ...state, drivingLogs: state.drivingLogs.filter((item) => item.id !== action.payload), lastUpdated: now };

    case 'SET_MONTHLY_GOAL': {
      const idx = state.monthlyGoals.findIndex((g) => g.month === action.payload.month);
      const goals =
        idx >= 0
          ? state.monthlyGoals.map((g, i) => (i === idx ? { ...g, targetAmount: action.payload.targetAmount, updatedAt: now } : g))
          : [...state.monthlyGoals, { month: action.payload.month, targetAmount: action.payload.targetAmount, createdAt: now, updatedAt: now }];
      return { ...state, monthlyGoals: goals, lastUpdated: now };
    }
    case 'DELETE_MONTHLY_GOAL':
      return { ...state, monthlyGoals: state.monthlyGoals.filter((g) => g.month !== action.payload), lastUpdated: now };

    case 'TOGGLE_DAY_OFF': {
      const date = action.payload;
      const daysOff = state.daysOff.includes(date) ? state.daysOff.filter((d) => d !== date) : [...state.daysOff, date];
      return { ...state, daysOff, lastUpdated: now };
    }

    case 'IMPORT_DATA':
      return { ...action.payload, lastUpdated: now };
    case 'CLEAR_ALL':
      return { ...INITIAL_DATA, lastUpdated: now };

    default:
      return state;
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(appDataReducer, INITIAL_DATA);

  useEffect(() => {
    const loaded = storage.load();
    dispatch({ type: 'INIT', payload: loaded });
  }, []);

  useEffect(() => {
    if (data.lastUpdated !== INITIAL_DATA.lastUpdated) {
      storage.save(data);
    }
  }, [data]);

  return <AppDataContext.Provider value={{ data, dispatch }}>{children}</AppDataContext.Provider>;
}
