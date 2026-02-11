'use client';

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  const capped = Math.min(percent, 100);
  const color = percent >= 100
    ? 'bg-gradient-to-r from-green-400 to-green-500'
    : percent >= 50
      ? 'bg-gradient-to-r from-blue-400 to-blue-500'
      : 'bg-gradient-to-r from-amber-400 to-amber-500';

  return (
    <div className={`w-full bg-gray-100 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${capped}%` }}
      />
    </div>
  );
}
