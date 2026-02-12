'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppData } from '@/hooks/use-app-data';
import { useDailySummary } from '@/hooks/use-daily-summary';
import { useSwipe } from '@/hooks/use-swipe';
import { getToday, getPrevDay, getNextDay } from '@/lib/date-utils';
import { filterIncomesByDate, filterExpensesByDate } from '@/lib/data-utils';
import { StatCard } from '@/components/common/stat-card';
import { DateNavigator } from '@/components/common/date-navigator';
import { Modal } from '@/components/common/modal';
import { DayOffToggle } from '@/components/dayoff/dayoff-toggle';
import { IncomeForm } from '@/components/transactions/income-form';
import { ExpenseForm } from '@/components/transactions/expense-form';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Plus } from 'lucide-react';

export default function DailyPage() {
  return (
    <Suspense>
      <DailyPageContent />
    </Suspense>
  );
}

function DailyPageContent() {
  const searchParams = useSearchParams();
  const [date, setDate] = useState(searchParams.get('date') || getToday());

  useEffect(() => {
    const paramDate = searchParams.get('date');
    if (paramDate) setDate(paramDate);
  }, [searchParams]);
  const { data, dispatch } = useAppData();
  const summary = useDailySummary(date);

  const [modal, setModal] = useState<'income' | 'expense' | 'editIncome' | 'editExpense' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const incomes = filterIncomesByDate(data.incomes, date);
  const expenses = filterExpensesByDate(data.expenses, date);

  const handleSwipeLeft = useCallback(() => setDate((d) => getNextDay(d)), []);
  const handleSwipeRight = useCallback(() => setDate((d) => getPrevDay(d)), []);
  const swipeRef = useSwipe<HTMLDivElement>({ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight });

  return (
    <div ref={swipeRef} className="space-y-4 pt-2">
      <h1 className="text-lg font-bold px-4 pt-2">일별 기록</h1>
      <DateNavigator date={date} onChange={setDate} mode="day" />

      <div className="flex justify-center">
        <DayOffToggle date={date} />
      </div>

      {summary.isDayOff && (
        <div className="mx-4 bg-gray-100 rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">😴</p>
          <p className="text-sm text-gray-500">오늘은 휴무일입니다</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 px-4">
        <StatCard label="수입" amount={summary.totalIncome} variant="income" />
        <StatCard label="지출" amount={summary.totalExpense} variant="expense" />
        <StatCard label="순이익" amount={summary.netProfit} variant="profit" />
      </div>

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">수입 ({incomes.length}건)</h2>
        {incomes.length === 0 ? (
          <p className="text-xs text-gray-400 py-3">수입 내역이 없습니다</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {incomes.map((i) => (
              <div key={i.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                    {i.paymentMethod === 'cash' ? '현금' : '카드'}
                  </span>
                  {i.memo && <span className="text-xs text-gray-400">{i.memo}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">{i.amount.toLocaleString()}원</span>
                  <button onClick={() => { setEditId(i.id); setModal('editIncome'); }} className="text-xs text-gray-400 hover:text-gray-600">수정</button>
                  <button onClick={() => dispatch({ type: 'DELETE_INCOME', payload: i.id })} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">지출 ({expenses.length}건)</h2>
        {expenses.length === 0 ? (
          <p className="text-xs text-gray-400 py-3">지출 내역이 없습니다</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-500">
                    {{ fuel: '유류비', food: '식비', repair: '수리/정비', toll: '통행료', insurance: '보험료', other: '기타' }[e.category]}
                  </span>
                  {e.memo && <span className="text-xs text-gray-400">{e.memo}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-500">{e.amount.toLocaleString()}원</span>
                  <button onClick={() => { setEditId(e.id); setModal('editExpense'); }} className="text-xs text-gray-400 hover:text-gray-600">수정</button>
                  <button onClick={() => dispatch({ type: 'DELETE_EXPENSE', payload: e.id })} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <button onClick={() => setModal('income')} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> 수입 추가
        </button>
        <button onClick={() => setModal('expense')} className="flex items-center justify-center gap-1.5 bg-red-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-red-600">
          <Plus size={16} /> 지출 추가
        </button>
      </div>

      <Modal isOpen={modal === 'income'} onClose={() => setModal(null)} title="수입 추가">
        <IncomeForm defaultDate={date} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'expense'} onClose={() => setModal(null)} title="지출 추가">
        <ExpenseForm defaultDate={date} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'editIncome'} onClose={() => { setModal(null); setEditId(null); }} title="수입 수정">
        {editId && <IncomeForm editId={editId} onSuccess={() => { setModal(null); setEditId(null); }} />}
      </Modal>
      <Modal isOpen={modal === 'editExpense'} onClose={() => { setModal(null); setEditId(null); }} title="지출 수정">
        {editId && <ExpenseForm editId={editId} onSuccess={() => { setModal(null); setEditId(null); }} />}
      </Modal>
    </div>
  );
}
