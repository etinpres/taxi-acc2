'use client';

import { useRef, useState } from 'react';
import { useAppData } from '@/hooks/use-app-data';
import { storage } from '@/lib/storage';
import { exportToCsv, importFromCsv } from '@/lib/csv';
import { Modal } from '@/components/common/modal';
import { Download, Upload, Trash2, Info } from 'lucide-react';

export default function SettingsPage() {
  const { data, dispatch } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleExport = () => {
    exportToCsv(data);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromCsv(file);
      dispatch({ type: 'IMPORT_DATA', payload: imported });
      setImportResult(`가져오기 완료! 수입 ${imported.incomes.length}건, 지출 ${imported.expenses.length}건, 운행 ${imported.drivingLogs.length}건`);
    } catch {
      setImportResult('파일 형식이 올바르지 않습니다.');
    }
    e.target.value = '';
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_ALL' });
    setConfirmClear(false);
  };

  const dataSize = storage.getSize();
  const sizeText = dataSize >= 1024 * 1024
    ? `${(dataSize / (1024 * 1024)).toFixed(1)} MB`
    : `${(dataSize / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-lg font-bold px-4 pt-2">설정</h1>

      <div className="bg-white rounded-xl mx-4 shadow-sm overflow-hidden">
        <h2 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">데이터 관리</h2>

        <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left">
          <Download size={20} className="text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">데이터 내보내기</p>
            <p className="text-xs text-gray-500">CSV 파일로 백업</p>
          </div>
        </button>

        <hr className="mx-4 border-gray-100" />

        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left">
          <Upload size={20} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">데이터 가져오기</p>
            <p className="text-xs text-gray-500">CSV 파일에서 복원 (기존 데이터 대체)</p>
          </div>
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />

        <hr className="mx-4 border-gray-100" />

        <button onClick={() => setConfirmClear(true)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left">
          <Trash2 size={20} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-500">데이터 전체 삭제</p>
            <p className="text-xs text-gray-500">모든 기록을 삭제합니다</p>
          </div>
        </button>
      </div>

      {importResult && (
        <div className="mx-4 bg-blue-50 text-blue-700 text-sm p-3 rounded-lg flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>{importResult}</span>
          <button onClick={() => setImportResult(null)} className="ml-auto text-blue-500 text-xs hover:underline">닫기</button>
        </div>
      )}

      <div className="bg-white rounded-xl mx-4 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">앱 정보</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">버전</span>
            <span className="text-gray-900">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">저장된 데이터</span>
            <span className="text-gray-900">{sizeText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">수입 기록</span>
            <span className="text-gray-900">{data.incomes.length}건</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">지출 기록</span>
            <span className="text-gray-900">{data.expenses.length}건</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">운행 기록</span>
            <span className="text-gray-900">{data.drivingLogs.length}일분</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">월별 목표</span>
            <span className="text-gray-900">{data.monthlyGoals.length}건</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">휴무일</span>
            <span className="text-gray-900">{data.daysOff.length}일</span>
          </div>
        </div>
      </div>

      <Modal isOpen={confirmClear} onClose={() => setConfirmClear(false)} title="데이터 전체 삭제">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-700">모든 수입/지출/운행 기록이 삭제됩니다.<br />이 작업은 되돌릴 수 없습니다.</p>
          <p className="text-xs text-gray-500">삭제 전에 CSV 내보내기로 백업을 권장합니다.</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmClear(false)} className="flex-1 py-3 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button onClick={handleClear} className="flex-1 py-3 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
              전체 삭제
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
