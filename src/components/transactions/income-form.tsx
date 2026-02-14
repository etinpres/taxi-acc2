'use client';

import { useForm } from 'react-hook-form';
import { useAppData } from '@/hooks/use-app-data';
import { PaymentMethod, PAYMENT_METHOD_LABELS } from '@/types';
import { getToday, getNowTime } from '@/lib/date-utils';

interface IncomeFormValues {
  date: string;
  time: string;
  amount: string;
  paymentMethod: PaymentMethod;
  memo: string;
}

interface Props {
  defaultDate?: string;
  onSuccess?: () => void;
  editId?: string;
}

export function IncomeForm({ defaultDate, onSuccess, editId }: Props) {
  const { data, dispatch } = useAppData();
  const existing = editId ? data.incomes.find((i) => i.id === editId) : null;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<IncomeFormValues>({
    defaultValues: {
      date: existing?.date ?? defaultDate ?? getToday(),
      time: existing?.time ?? getNowTime(),
      amount: existing ? existing.amount.toLocaleString('ko-KR') : '',
      paymentMethod: existing?.paymentMethod ?? 'card',
      memo: existing?.memo ?? '',
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setValue('amount', raw ? Number(raw).toLocaleString('ko-KR') : '', { shouldValidate: true });
  };

  const parseAmount = (formatted: string) => Number(formatted.replace(/,/g, ''));

  const onSubmit = (values: IncomeFormValues) => {
    const amount = parseAmount(values.amount);
    if (editId) {
      dispatch({ type: 'UPDATE_INCOME', payload: { id: editId, data: { date: values.date, time: values.time, amount, paymentMethod: values.paymentMethod, memo: values.memo } } });
    } else {
      dispatch({ type: 'ADD_INCOME', payload: { date: values.date, time: values.time, amount, paymentMethod: values.paymentMethod, memo: values.memo } });
    }
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input type="date" {...register('date', { required: true })} max={getToday()} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm transition-colors" />
        </div>
        <div className="w-28">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">결제수단</label>
        <div className="flex gap-2">
          {(Object.entries(PAYMENT_METHOD_LABELS) as [PaymentMethod, string][]).map(([value, label]) => (
            <label key={value} className="flex-1">
              <input type="radio" value={value} {...register('paymentMethod')} className="peer hidden" />
              <div className="text-center py-2.5 rounded-lg border border-gray-300 text-sm cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-colors">
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
      <button type="submit" className="btn-press w-full bg-blue-600 text-white rounded-2xl py-3.5 text-sm font-semibold shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-colors">
        {editId ? '수정 완료' : '수입 추가'}
      </button>
    </form>
  );
}
