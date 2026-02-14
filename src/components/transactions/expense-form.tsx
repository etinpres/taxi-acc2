'use client';

import { useForm } from 'react-hook-form';
import { useAppData } from '@/hooks/use-app-data';
import { ExpenseCategory, EXPENSE_CATEGORY_LABELS } from '@/types';
import { getToday, getNowTime } from '@/lib/date-utils';

interface ExpenseFormValues {
  date: string;
  time: string;
  amount: string;
  category: ExpenseCategory;
  memo: string;
}

interface Props {
  defaultDate?: string;
  onSuccess?: () => void;
  editId?: string;
}

export function ExpenseForm({ defaultDate, onSuccess, editId }: Props) {
  const { data, dispatch } = useAppData();
  const existing = editId ? data.expenses.find((e) => e.id === editId) : null;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ExpenseFormValues>({
    defaultValues: {
      date: existing?.date ?? defaultDate ?? getToday(),
      time: existing?.time ?? getNowTime(),
      amount: existing ? existing.amount.toLocaleString('ko-KR') : '',
      category: existing?.category ?? 'fuel',
      memo: existing?.memo ?? '',
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setValue('amount', raw ? Number(raw).toLocaleString('ko-KR') : '', { shouldValidate: true });
  };

  const parseAmount = (formatted: string) => Number(formatted.replace(/,/g, ''));

  const onSubmit = (values: ExpenseFormValues) => {
    const amount = parseAmount(values.amount);
    if (editId) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: { id: editId, data: { date: values.date, time: values.time, amount, category: values.category, memo: values.memo } } });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: { date: values.date, time: values.time, amount, category: values.category, memo: values.memo } });
    }
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input type="date" {...register('date', { required: true })} max={getToday()} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm transition-colors" />
        </div>
        <div className="w-[120px] shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
          <input type="time" {...register('time', { required: true })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">금액</label>
        <input type="text" inputMode="numeric" placeholder="금액을 입력하세요" {...register('amount', { required: '금액을 입력해주세요', validate: (v) => parseAmount(v) >= 1 || '1원 이상 입력해주세요' })} onChange={handleAmountChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm transition-colors" />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(EXPENSE_CATEGORY_LABELS) as [ExpenseCategory, string][]).map(([value, label]) => (
            <label key={value}>
              <input type="radio" value={value} {...register('category')} className="peer hidden" />
              <div className="text-center py-2 rounded-lg border border-gray-300 text-xs cursor-pointer peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500 transition-colors">
                {label}
              </div>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
        <input type="text" placeholder="선택사항" {...register('memo')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm transition-colors" />
      </div>
      <button type="submit" className="btn-press w-full bg-red-500 text-white rounded-2xl py-3.5 text-sm font-semibold shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors">
        {editId ? '수정 완료' : '지출 추가'}
      </button>
    </form>
  );
}
