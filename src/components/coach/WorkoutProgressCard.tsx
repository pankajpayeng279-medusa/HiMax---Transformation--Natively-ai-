import { motion } from 'framer-motion';
import { Flame, Clock, CheckCircle2 } from 'lucide-react';

interface WorkoutProgressCardProps {
  completed: number;
  total: number;
  elapsedMinutes: number;
  caloriesBurned: number;
  onCompleteWorkout: () => void;
}

export default function WorkoutProgressCard({
  completed,
  total,
  elapsedMinutes,
  caloriesBurned,
  onCompleteWorkout,
}: WorkoutProgressCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 lg:p-8">
      <h2 className="text-lg font-heading font-bold text-text mb-5">Workout Progress</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
            <circle cx="50" cy="50" r={radius} className="stroke-border" strokeWidth="8" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-primary"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-text">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-3 w-full">
          <div className="rounded-xl bg-bg border border-border px-4 py-3">
            <div className="flex items-center gap-1.5 text-text-muted mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Exercises</span>
            </div>
            <p className="text-sm font-semibold text-text">
              {completed}/{total}
            </p>
          </div>
          <div className="rounded-xl bg-bg border border-border px-4 py-3">
            <div className="flex items-center gap-1.5 text-text-muted mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Time</span>
            </div>
            <p className="text-sm font-semibold text-text">{elapsedMinutes} min</p>
          </div>
          <div className="rounded-xl bg-bg border border-border px-4 py-3">
            <div className="flex items-center gap-1.5 text-text-muted mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Calories</span>
            </div>
            <p className="text-sm font-semibold text-text">{caloriesBurned} kcal</p>
          </div>
        </div>
      </div>

      <button
        onClick={onCompleteWorkout}
        disabled={completed === 0}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-90 text-white font-semibold text-sm py-3 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <CheckCircle2 className="w-4 h-4" />
        Complete Workout
      </button>
    </section>
  );
}