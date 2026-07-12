import { TrendingUp, Lightbulb, Droplets, Activity, LucideIcon } from 'lucide-react';
import { CoachInsight } from '../../types/coach';
import { cn } from '../../utils/cn';

interface CoachInsightCardProps {
  insight: CoachInsight;
}

const insightMeta: Record<CoachInsight['type'], { icon: LucideIcon; className: string }> = {
  improvement: { icon: TrendingUp, className: 'text-emerald-500 bg-emerald-500/10' },
  tip: { icon: Lightbulb, className: 'text-amber-500 bg-amber-500/10' },
  reminder: { icon: Droplets, className: 'text-blue-500 bg-blue-500/10' },
  form: { icon: Activity, className: 'text-primary bg-primary/10' },
};

export default function CoachInsightCard({ insight }: CoachInsightCardProps) {
  const { icon: Icon, className } = insightMeta[insight.type];

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', className)}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm text-text leading-relaxed pt-1.5">{insight.message}</p>
    </div>
  );
}