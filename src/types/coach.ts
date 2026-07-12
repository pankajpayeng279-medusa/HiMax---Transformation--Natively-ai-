export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type RecoveryStatus = "Ready" | "Moderate" | "Needs Rest";
export type TrackingStatus = "idle" | "tracking" | "paused" | "stopped";

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;

  // Workout prescription
  sets: number;
  reps: number;

  /** Human readable label */
  repLabel: string;

  isTimeBased?: boolean;
  durationSeconds?: number;

  difficulty: DifficultyLevel;
  estimatedMinutes: number;

  // -----------------------
  // Workout Progress
  // -----------------------

  /** Current set user is on */
  currentSet?: number;

  /** Reps completed in current set */
  completedReps?: number;

  /** Total completed sets */
  completedSets?: number;

  /** Exercise fully completed */
  completed?: boolean;

  /** ISO date when completed */
  completedAt?: string;
}

export interface WorkoutPlan {
  id: string;
  goal: string;
  estimatedDuration: number;
  caloriesEstimate: number;
  difficulty: DifficultyLevel;
  recoveryStatus: RecoveryStatus;
  exercises: Exercise[];
}

export interface CoachInsight {
  id: string;
  type: "improvement" | "tip" | "reminder" | "form";
  message: string;
}

export interface QuickAdjustment {
  id: string;
  label: string;
}

export interface DailySummary {
  waterIntakeMl: number;
  waterGoalMl: number;
  proteinGrams: number;
  proteinGoalGrams: number;
  steps: number;
  stepsGoal: number;
  currentStreakDays: number;
  restDayInDays: number;
  recoveryScore: number;
}

export interface WorkoutCompletionStats {
  caloriesBurned: number;
  durationMinutes: number;
  exercisesCompleted: number;
  totalExercises: number;
}

export interface ChatAction {
  type:
    | "apply-workout"
    | "regenerate-workout"
    | "shorten-workout";

  label: string;
}