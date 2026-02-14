import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parse,
  isAfter,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(date: string): string {
  return format(parse(date, 'yyyy-MM-dd', new Date()), 'yyyy년 M월 d일 (EEE)', { locale: ko });
}

export function formatMonth(month: string): string {
  return format(parse(month + '-01', 'yyyy-MM-dd', new Date()), 'yyyy년 M월', { locale: ko });
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getPrevDay(date: string): string {
  return format(subDays(parse(date, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd');
}

export function getNextDay(date: string): string {
  const next = addDays(parse(date, 'yyyy-MM-dd', new Date()), 1);
  if (isAfter(next, new Date())) return date;
  return format(next, 'yyyy-MM-dd');
}

export function getPrevMonth(month: string): string {
  return format(subMonths(parse(month + '-01', 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM');
}

export function getNextMonth(month: string): string {
  const next = addMonths(parse(month + '-01', 'yyyy-MM-dd', new Date()), 1);
  if (isAfter(startOfMonth(next), new Date())) return month;
  return format(next, 'yyyy-MM');
}

export function getDaysInMonth(month: string): string[] {
  const start = startOfMonth(parse(month + '-01', 'yyyy-MM-dd', new Date()));
  const end = endOfMonth(start);
  const today = new Date();
  const actualEnd = isAfter(end, today) ? today : end;
  return eachDayOfInterval({ start, end: actualEnd }).map((d) => format(d, 'yyyy-MM-dd'));
}

export function getDaysInMonthFull(month: string): string[] {
  const start = startOfMonth(parse(month + '-01', 'yyyy-MM-dd', new Date()));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
}

export function getDayLabel(date: string): string {
  return format(parse(date, 'yyyy-MM-dd', new Date()), 'd');
}

export function getNowTime(): string {
  return format(new Date(), 'HH:mm');
}
