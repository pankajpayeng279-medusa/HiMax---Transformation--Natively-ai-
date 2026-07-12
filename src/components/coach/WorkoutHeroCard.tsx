import { motion } from 'framer-motion';
import { RotateCcw, Play, Flame, Clock, Dumbbell, Battery } from 'lucide-react';
import { WorkoutPlan } from '../../types/coach';
import { cn } from '../../utils/cn';

interface WorkoutHeroCardProps {
  userName: string;
  workout: WorkoutPlan;
  onStart: () => void;
  onRegenerate: () => void;
  regenerating?: boolean;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const recoveryStyles: Record<WorkoutPlan['recoveryStatus'], string> = {
  Ready: 'text-emerald-500 bg-emerald-500/10',
  Moderate: 'text-amber-500 bg-amber-500/10',
  'Needs Rest': 'text-red-500 bg-red-500/10',
};

export default function WorkoutHeroCard({
  userName,
  workout,
  onStart,
  onRegenerate,
  regenerating,
}: WorkoutHeroCardProps) {
  const stats = [
    { label: "Today's Goal", value: workout.goal, icon: Dumbbell },
    { label: 'Estimated Duration', value: `${workout.estimatedDuration} Minutes`, icon: Clock },
    { label: 'Calories Estimate', value: `${workout.caloriesEstimate} kcal`, icon: Flame },
    { label: 'Difficulty', value: workout.difficulty, icon: Dumbbell },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border border-border bg-surface p-6 lg:p-8"
    >
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-sm font-medium text-text-muted">
          {getGreeting()}, {userName}.
        </p>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">
          Your AI Coach has today&apos;s plan ready
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-bg border border-border px-4 py-3.5">
            <div className="flex items-center gap-1.5 text-text-muted mb-1.5">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-sm font-semibold text-text truncate">{value}</p>
          </div>
        ))}
        <div className="rounded-xl bg-bg border border-border px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-text-muted mb-1.5">
            <Battery className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Recovery Status</span>
          </div>
          <span
            className={cn(
              'inline-block text-xs font-semibold px-2 py-0.5 rounded-full',
              recoveryStyles[workout.recoveryStatus],
            )}
          >
            {workout.recoveryStatus}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-3.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <Play className="w-4 h-4 fill-current" />
          Start Today&apos;s Workout
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onRegenerate}
          disabled={regenerating}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg hover:bg-border/40 text-text font-semibold text-sm px-6 py-3.5 transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <RotateCcw className={cn('w-4 h-4', regenerating && 'animate-spin')} />
          {regenerating ? 'Regenerating…' : 'Regenerate Workout'}
        </motion.button>
      </div>
    </motion.section>
  );
}