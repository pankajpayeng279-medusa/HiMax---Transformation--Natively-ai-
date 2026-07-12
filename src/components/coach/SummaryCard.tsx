import { LucideIcon, Droplets, Utensils, Footprints, Flame, Moon, ShieldCheck } from 'lucide-react';
import { DailySummary } from '../../types/coach';

interface SummaryCardProps {
  summary: DailySummary;
}

interface ProgressRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  goalLabel: string;
  percentage: number;
}

function ProgressRow({ icon: Icon, label, value, goalLabel, percentage }: ProgressRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-text-muted">
          <Icon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className="text-xs font-semibold text-text">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-[11px] text-text-muted mt-1">{goalLabel}</p>
    </div>
  );
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <aside className="lg:sticky lg:top-8 rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5">
      <h2 className="text-base font-heading font-bold text-text">Today&apos;s Summary</h2>

      <ProgressRow
        icon={Droplets}
        label="Water Intake"
        value={`${(summary.waterIntakeMl / 1000).toFixed(1)}L`}
        goalLabel={`Goal ${(summary.waterGoalMl / 1000).toFixed(1)}L`}
        percentage={(summary.waterIntakeMl / summary.waterGoalMl) * 100}
      />
      <ProgressRow
        icon={Utensils}
        label="Protein Goal"
        value={`${summary.proteinGrams}g`}
        goalLabel={`Goal ${summary.proteinGoalGrams}g`}
        percentage={(summary.proteinGrams / summary.proteinGoalGrams) * 100}
      />
      <ProgressRow
        icon={Footprints}
        label="Steps"
        value={summary.steps.toLocaleString()}
        goalLabel={`Goal ${summary.stepsGoal.toLocaleString()}`}
        percentage={(summary.steps / summary.stepsGoal) * 100}
      />

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div className="rounded-xl bg-bg border border-border px-3 py-3">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Streak</span>
          </div>
          <p className="text-sm font-semibold text-text">{summary.currentStreakDays} days</p>
        </div>
        <div className="rounded-xl bg-bg border border-border px-3 py-3">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Moon className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Rest Day</span>
          </div>
          <p className="text-sm font-semibold text-text">in {summary.restDayInDays}d</p>
        </div>
      </div>

      <div className="rounded-xl bg-bg border border-border px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-text-muted mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Recovery Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${summary.recoveryScore}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-text">{summary.recoveryScore}</span>
        </div>
      </div>
    </aside>
  );
}