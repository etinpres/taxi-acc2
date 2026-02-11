'use client';

import { useForm } from 'react-hook-form';
import { useAppData } from '@/hooks/use-app-data';
import { formatMonth } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/data-utils';

interface Props {
  month: string;
  onClose: () => void;
}

const QUICK_AMOUNTS = [3_000_000, 4_000_000, 5_000_000, 6_000_000];

export function MonthlyGoalForm({ month, onClose }: Props) {
  const { data, dispatch } = useAppData();
  const existing = data.monthlyGoals.find((g) => g.month === month);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { targetAmount: existing ? existing.targetAmount.toLocaleString('ko-KR') : '' },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setValue('targetAmount', raw ? Number(raw).toLocaleString('ko-KR') : '', { shouldValidate: true });
  };

  const parseAmount = (formatted: string) => Number(formatted.replace(/,/g, ''));

  const onSubmit = (values: { targetAmount: string }) => {
    dispatch({ type: 'SET_MONTHLY_GOAL', payload: { month, targetAmount: parseAmount(values.targetAmount) } });
    onClose();
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_MONTHLY_GOAL', payload: month });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-500">{formatMonth(month)} 목표 수입금액</p>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => setValue('targetAmount', amt.toLocaleString('ko-KR'))}
            className="py-2 rounded-lg border border-gray-300 text-xs hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            {formatCurrency(amt).replace('원', '')}
          </button>
        ))}
      </div>
      <div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="직접 입력 (원)"
          {...register('targetAmount', { required: '목표 금액을 입력해주세요', validate: (v) => parseAmount(v) >= 0 || '0원 이상 입력해주세요' })}
          onChange={handleAmountChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        />
        {errors.targetAmount && <p className="text-red-500 text-xs mt-1">{errors.targetAmount.message}</p>}
      </div>
      <div className="flex gap-2">
        {existing && (
          <button type="button" onClick={handleDelete} className="flex-1 py-3 rounded-lg border border-red-300 text-red-500 text-sm font-semibold hover:bg-red-50">
            삭제
          </button>
        )}
        <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700">
          설정
        </button>
      </div>
    </form>
  );
}
