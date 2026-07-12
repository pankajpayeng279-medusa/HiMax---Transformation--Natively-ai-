import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Flame, Clock, CheckCircle2 } from 'lucide-react';
import { WorkoutCompletionStats } from '../../types/coach';

interface WorkoutCompletionCardProps {
  stats: WorkoutCompletionStats;
}

export default function WorkoutCompletionCard({ stats }: WorkoutCompletionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border border-border bg-surface p-8 lg:p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
        className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5"
      >
        <Trophy className="w-8 h-8 text-emerald-500" />
      </motion.div>

      <h2 className="text-2xl font-heading font-bold text-text mb-1.5">Congratulations!</h2>
      <p className="text-sm text-text-muted mb-8">Workout Completed.</p>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
        <div className="rounded-xl bg-bg border border-border px-3 py-4">
          <Flame className="w-4 h-4 text-primary mx-auto mb-1.5" />
          <p className="text-sm font-semibold text-text">{stats.caloriesBurned}</p>
          <p className="text-xs text-text-muted">kcal burned</p>
        </div>
        <div className="rounded-xl bg-bg border border-border px-3 py-4">
          <Clock className="w-4 h-4 text-primary mx-auto mb-1.5" />
          <p className="text-sm font-semibold text-text">{stats.durationMinutes} min</p>
          <p className="text-xs text-text-muted">duration</p>
        </div>
        <div className="rounded-xl bg-bg border border-border px-3 py-4">
          <CheckCircle2 className="w-4 h-4 text-primary mx-auto mb-1.5" />
          <p className="text-sm font-semibold text-text">
            {stats.exercisesCompleted}/{stats.totalExercises}
          </p>
          <p className="text-xs text-text-muted">exercises</p>
        </div>
      </div>

      <Link
        to="/dashboard"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-90 text-white font-semibold text-sm px-8 py-3 transition-opacity"
      >
        Back to Dashboard
      </Link>
    </motion.section>
  );
}