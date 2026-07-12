import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className,
}: StatCardProps) {
  return (
    <div className={cn('bg-surface border border-border rounded-2xl p-5 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-muted">{label}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-text">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-medium',
              changeType === 'positive' && 'text-primary',
              changeType === 'negative' && 'text-red-500',
              changeType === 'neutral' && 'text-text-muted',
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}