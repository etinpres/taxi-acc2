import { AppData, Income, Expense, DrivingLog } from '@/types';
import { format } from 'date-fns';

const BOM = '\uFEFF';

export function exportToCsv(data: AppData): void {
  const lines: string[] = [];

  lines.push('[수입]');
  lines.push('id,date,amount,paymentMethod,memo,createdAt,updatedAt');
  for (const i of data.incomes) {
    lines.push(`${i.id},${i.date},${i.amount},${i.paymentMethod},"${(i.memo || '').replace(/"/g, '""')}",${i.createdAt},${i.updatedAt}`);
  }

  lines.push('');
  lines.push('[지출]');
  lines.push('id,date,amount,category,memo,createdAt,updatedAt');
  for (const e of data.expenses) {
    lines.push(`${e.id},${e.date},${e.amount},${e.category},"${(e.memo || '').replace(/"/g, '""')}",${e.createdAt},${e.updatedAt}`);
  }

  lines.push('');
  lines.push('[운행기록]');
  lines.push('id,date,tripCount,distanceKm,drivingHours,memo,createdAt,updatedAt');
  for (const d of data.drivingLogs) {
    lines.push(`${d.id},${d.date},${d.tripCount},${d.distanceKm},${d.drivingHours},"${(d.memo || '').replace(/"/g, '""')}",${d.createdAt},${d.updatedAt}`);
  }

  lines.push('');
  lines.push('[월별목표]');
  lines.push('month,targetAmount,createdAt,updatedAt');
  for (const g of data.monthlyGoals) {
    lines.push(`${g.month},${g.targetAmount},${g.createdAt},${g.updatedAt}`);
  }

  lines.push('');
  lines.push('[휴무일]');
  lines.push('date');
  for (const d of data.daysOff) {
    lines.push(d);
  }

  const blob = new Blob([BOM + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `고도비만택시장부-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromCsv(file: File): Promise<AppData> {
  const text = await file.text();
  const lines = text.replace(/^\uFEFF/, '').split('\n').map((l) => l.trim());

  const incomes: Income[] = [];
  const expenses: Expense[] = [];
  const drivingLogs: DrivingLog[] = [];
  const monthlyGoals: { month: string; targetAmount: number; createdAt: string; updatedAt: string }[] = [];
  const daysOff: string[] = [];

  let section = '';

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith('[수입]')) { section = 'income'; continue; }
    if (line.startsWith('[지출]')) { section = 'expense'; continue; }
    if (line.startsWith('[운행기록]')) { section = 'driving'; continue; }
    if (line.startsWith('[월별목표]')) { section = 'goal'; continue; }
    if (line.startsWith('[휴무일]')) { section = 'dayoff'; continue; }
    if (line.startsWith('id,') || line.startsWith('month,') || line === 'date') continue;

    const cols = parseCsvLine(line);

    if (section === 'income' && cols.length >= 7) {
      incomes.push({
        id: cols[0], date: cols[1], amount: Number(cols[2]),
        paymentMethod: cols[3] as 'cash' | 'card',
        memo: cols[4], createdAt: cols[5], updatedAt: cols[6],
      });
    } else if (section === 'expense' && cols.length >= 7) {
      expenses.push({
        id: cols[0], date: cols[1], amount: Number(cols[2]),
        category: cols[3] as Expense['category'],
        memo: cols[4], createdAt: cols[5], updatedAt: cols[6],
      });
    } else if (section === 'driving' && cols.length >= 8) {
      drivingLogs.push({
        id: cols[0], date: cols[1], tripCount: Number(cols[2]),
        distanceKm: Number(cols[3]), drivingHours: Number(cols[4]),
        memo: cols[5], createdAt: cols[6], updatedAt: cols[7],
      });
    } else if (section === 'goal' && cols.length >= 4) {
      monthlyGoals.push({
        month: cols[0], targetAmount: Number(cols[1]),
        createdAt: cols[2], updatedAt: cols[3],
      });
    } else if (section === 'dayoff' && cols[0]) {
      daysOff.push(cols[0]);
    }
  }

  return {
    incomes, expenses, drivingLogs, monthlyGoals, daysOff,
    version: '1.1.0',
    lastUpdated: new Date().toISOString(),
  };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}
