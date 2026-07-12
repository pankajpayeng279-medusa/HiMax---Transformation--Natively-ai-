import { motion } from "framer-motion";
import { Dumbbell, Play, CheckCircle2 } from "lucide-react";
import { Exercise } from "../../types/coach";
import { cn } from "../../utils/cn";

interface WorkoutCardProps {
  exercise: Exercise;
  completed?: boolean;

  currentSet?: number;
  completedSets?: number;
  completedReps?: number;

  onStartTracking: (exercise: Exercise) => void;
}

const difficultyStyles: Record<Exercise["difficulty"], string> = {
  Beginner: "bg-emerald-500/15 text-emerald-400",
  Intermediate: "bg-amber-500/15 text-amber-400",
  Advanced: "bg-red-500/15 text-red-400",
};

const borderStyles: Record<Exercise["difficulty"], string> = {
  Beginner: "border-l-emerald-500",
  Intermediate: "border-l-amber-500",
  Advanced: "border-l-red-500",
};

export default function WorkoutCard({
  exercise,
  completed,
  currentSet = 0,
  completedSets = 0,
  completedReps = 0,
  onStartTracking,
}: WorkoutCardProps) {
  const progress = (completedSets / Math.max(1, exercise.sets)) * 100;

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.015,
      }}
      transition={{ duration: 0.18 }}
      className={cn(
        "rounded-2xl bg-surface border border-border border-l-4 p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-xl",
        borderStyles[exercise.difficulty],
        completed && "opacity-60 ring-2 ring-emerald-500/40 saturate-75",
      )}
    >
      {/* Header */}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>

          <span
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full",
              difficultyStyles[exercise.difficulty],
            )}
          >
            {exercise.difficulty}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-text leading-tight line-clamp-2 min-h-[56px]">
            {exercise.name}
          </h3>

          <p className="text-text-muted mt-1">{exercise.targetMuscle}</p>
        </div>
      </div>

      {/* Workout Progress */}

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Sets</span>

          <span className="font-semibold">
            {completedSets} / {exercise.sets}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Reps</span>

          <span className="font-semibold">
            {completedReps} / {exercise.reps}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Duration</span>

          <span className="font-semibold">{exercise.estimatedMinutes} min</span>
        </div>
      </div>

      {/* Progress */}

      <div className="mt-5">
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.5,
            }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>

      {/* Button */}

      <button
        onClick={() => onStartTracking(exercise)}
        className={cn(
          "mt-5 w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-all",
          completed
            ? "bg-emerald-500 text-white"
            : "bg-primary hover:brightness-110 text-white",
        )}
      >
        {completed ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Exercise Completed
          </>
        ) : completedReps >= exercise.reps ? (
          <>
            <Play className="w-4 h-4 fill-current" />
            Next Set
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Start Tracking
          </>
        )}
      </button>
    </motion.div>
  );
}
