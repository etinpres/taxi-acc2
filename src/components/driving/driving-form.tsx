'use client';

import { useForm } from 'react-hook-form';
import { useAppData } from '@/hooks/use-app-data';

interface DrivingFormValues {
  tripCount: string;
  distanceKm: string;
  drivingHours: string;
  memo: string;
}

interface Props {
  date: string;
  onSuccess?: () => void;
}

export function DrivingForm({ date, onSuccess }: Props) {
  const { data, dispatch } = useAppData();
  const existing = data.drivingLogs.find((d) => d.date === date);

  const { register, handleSubmit, formState: { errors } } = useForm<DrivingFormValues>({
    defaultValues: {
      tripCount: existing ? String(existing.tripCount) : '',
      distanceKm: existing ? String(existing.distanceKm) : '',
      drivingHours: existing ? String(existing.drivingHours) : '',
      memo: existing?.memo ?? '',
    },
  });

  const onSubmit = (values: DrivingFormValues) => {
    const payload = {
      date,
      tripCount: Number(values.tripCount) || 0,
      distanceKm: Number(values.distanceKm) || 0,
      drivingHours: Number(values.drivingHours) || 0,
      memo: values.memo,
    };

    if (existing) {
      dispatch({ type: 'UPDATE_DRIVING_LOG', payload: { id: existing.id, data: payload } });
    } else {
      dispatch({ type: 'ADD_DRIVING_LOG', payload });
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">운행 횟수</label>
        <div className="flex items-center gap-2">
          <input type="number" inputMode="numeric" placeholder="0" {...register('tripCount', { min: { value: 0, message: '0 이상' } })} className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
          <span className="text-sm text-gray-500">회</span>
        </div>
        {errors.tripCount && <p className="text-red-500 text-xs mt-1">{errors.tripCount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">주행거리</label>
        <div className="flex items-center gap-2">
          <input type="number" inputMode="decimal" step="0.1" placeholder="0" {...register('distanceKm', { min: { value: 0, message: '0 이상' } })} className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
          <span className="text-sm text-gray-500">km</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">운행시간</label>
        <div className="flex items-center gap-2">
          <input type="number" inputMode="decimal" step="0.5" placeholder="0" {...register('drivingHours', { min: { value: 0, message: '0 이상' }, max: { value: 24, message: '24시간 이하' } })} className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
          <span className="text-sm text-gray-500">시간</span>
        </div>
        {errors.drivingHours && <p className="text-red-500 text-xs mt-1">{errors.drivingHours.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
        <input type="text" placeholder="선택사항" {...register('memo')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 transition-colors">
        {existing ? '운행 기록 수정' : '운행 기록 저장'}
      </button>
    </form>
  );
}
