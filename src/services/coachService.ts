import {
  WorkoutPlan,
  CoachInsight,
  DailySummary,
  WorkoutCompletionStats,
  Exercise,
} from "../types/coach";

import { chatWithFireworks, type CoachContext } from "./ai/fireworks";
import type { ChatAction } from "../types/coach";
import { supabase } from "./supabase/client";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isWorkoutJson(text: string): boolean {
  try {
    const data = JSON.parse(text);
    return data.type === "workout";
  } catch {
    return false;
  }
}

async function saveWorkoutToDatabase(workout: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  // Delete today's unfinished workout
  await supabase
    .from("workouts")
    .delete()
    .eq("user_id", user.id)
    .eq("completed", false);

  // Save the new workout
  const { error } = await supabase.from("workouts").insert({
    user_id: user.id,
    workout_name: workout.goal,
    difficulty:
      workout.difficulty === "Beginner"
        ? "Easy"
        : workout.difficulty === "Intermediate"
          ? "Medium"
          : "Hard",
    duration_minutes: workout.estimatedDuration,
    calories_burned: workout.caloriesEstimate,
    exercise_list: workout.exercises,
    completed: false,
    date: today,
  });

  if (error) throw error;
}

const BASE_EXERCISES: Exercise[] = [
  {
    id: "push-ups",
    name: "Push Ups",
    targetMuscle: "Chest & Triceps",
    sets: 4,
    reps: 12,
    repLabel: "12 reps",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
  },

  {
    id: "squats",
    name: "Squats",
    targetMuscle: "Quadriceps & Glutes",
    sets: 4,
    reps: 15,
    repLabel: "15 reps",
    difficulty: "Beginner",
    estimatedMinutes: 6,
  },
];

const UPPER_BODY_EXERCISES = [
  BASE_EXERCISES[0], // Push Ups
];

const LOWER_BODY_EXERCISES = [
  BASE_EXERCISES[1], // Squats
];

const FULL_BODY_EXERCISES = [...UPPER_BODY_EXERCISES, ...LOWER_BODY_EXERCISES];

const MOCK_WORKOUT: WorkoutPlan = {
  id: "workout-upper-body-strength",
  goal: "Full Body Workout",
  estimatedDuration: 45,
  caloriesEstimate: 350,
  difficulty: "Intermediate",
  recoveryStatus: "Ready",
  exercises: BASE_EXERCISES,
};

const MOCK_INSIGHTS: CoachInsight[] = [
  {
    id: "insight-1",
    type: "improvement",
    message: "Your push strength has improved by 12% this week.",
  },
  {
    id: "insight-2",
    type: "tip",
    message:
      "Today, focus on slow, controlled repetitions for better muscle activation.",
  },
  {
    id: "insight-3",
    type: "reminder",
    message: "Increase water intake after your workout to support recovery.",
  },
  {
    id: "insight-4",
    type: "form",
    message:
      "Maintain proper shoulder posture throughout your pressing movements.",
  },
];

const MOCK_SUMMARY: DailySummary = {
  waterIntakeMl: 900,
  waterGoalMl: 3000,
  proteinGrams: 42,
  proteinGoalGrams: 140,
  steps: 3120,
  stepsGoal: 10000,
  currentStreakDays: 6,
  restDayInDays: 2,
  recoveryScore: 82,
};

/**
 * coachService
 *
 * Mock service layer for the AI Coach module. Every method returns
 * hardcoded/derived mock data behind an artificial network delay so the
 * UI can be built and tested against a realistic async contract.
 *
 * TODO: replace method bodies with real calls to the Google Gemma
 * inference backend once it's available. Signatures are designed to stay
 * stable when that integration happens.
 */

export const coachService = {
  async generateWorkout(): Promise<WorkoutPlan> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_WORKOUT;
    }

    const { data: workout } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed", false)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!workout) {
      return MOCK_WORKOUT;
    }

    return {
      id: workout.id,
      goal: workout.workout_name,
      estimatedDuration: workout.duration_minutes ?? 0,
      caloriesEstimate: workout.calories_burned ?? 0,
      difficulty:
        workout.difficulty === "Easy"
          ? "Beginner"
          : workout.difficulty === "Medium"
            ? "Intermediate"
            : workout.difficulty === "Hard"
              ? "Advanced"
              : "Beginner",
      recoveryStatus: "Ready",

      exercises: Array.isArray(workout.exercise_list)
        ? workout.exercise_list.map((exercise: any, index: number) => ({
            id: exercise.id ?? `exercise-${index}`,
            name: exercise.name ?? "Exercise",
            targetMuscle: exercise.targetMuscle ?? "Unknown",
            sets: exercise.sets ?? 3,
            reps: exercise.reps ?? 10,
            repLabel: exercise.repLabel ?? `${exercise.reps ?? 10} reps`,
            difficulty:
              exercise.difficulty === "Easy"
                ? "Beginner"
                : exercise.difficulty === "Medium"
                  ? "Intermediate"
                  : exercise.difficulty === "Hard"
                    ? "Advanced"
                    : "Beginner",
            estimatedMinutes: exercise.estimatedMinutes ?? 5,
          }))
        : [],
    };
  },

  async askCoach(
    message: string,
    context?: CoachContext,
  ): Promise<{ content: string; actions: ChatAction[] }> {
    const content = await chatWithFireworks(message, context);

    return {
      content,
      actions: [],
    };
  },

  async regenerateWorkout(): Promise<WorkoutPlan> {
    await delay(1100);
    // Simulate the AI proposing a freshly reordered plan.
    return {
      ...MOCK_WORKOUT,
      id: `workout-${Date.now()}`,
      exercises: [...MOCK_WORKOUT.exercises].sort(() => Math.random() - 0.5),
    };
  },

  async completeWorkout(
    exercisesCompleted: number,
    totalExercises: number,
    elapsedMinutes: number,
  ): Promise<WorkoutCompletionStats> {
    await delay(600);
    return {
      caloriesBurned: Math.round(
        (MOCK_WORKOUT.caloriesEstimate * exercisesCompleted) /
          Math.max(1, totalExercises),
      ),
      durationMinutes: elapsedMinutes,
      exercisesCompleted,
      totalExercises,
    };
  },

  async adjustWorkout(adjustmentId: string): Promise<WorkoutPlan> {
    await delay(800);
    switch (adjustmentId) {
      case "time-20":
        return {
          ...MOCK_WORKOUT,
          estimatedDuration: 20,
          exercises: MOCK_WORKOUT.exercises.slice(0, 4),
        };
      case "feeling-tired":
        return {
          ...MOCK_WORKOUT,
          difficulty: "Beginner",
          recoveryStatus: "Moderate",
        };
      case "increase-intensity":
        return { ...MOCK_WORKOUT, difficulty: "Advanced" };
      case "home-workout":
        return { ...MOCK_WORKOUT, goal: "Home Bodyweight Strength" };
      case "gym-workout":
        return { ...MOCK_WORKOUT, goal: "Gym Upper Body Strength" };
      case "skip-workout":
      default:
        return MOCK_WORKOUT;
    }
  },

  async getInsights(): Promise<CoachInsight[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_INSIGHTS;
    }

    const today = new Date().toISOString().split("T")[0];

    const [profileResult, dailyResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("protein_goal")
        .eq("id", user.id)
        .single(),

      supabase
        .from("daily_logs")
        .select("protein, water_ml, steps")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle(),
    ]);

    const proteinGoal = Number(profileResult.data?.protein_goal ?? 0);
    const proteinToday = Number(dailyResult.data?.protein ?? 0);
    const waterToday = Number(dailyResult.data?.water_ml ?? 0);
    const stepsToday = Number(dailyResult.data?.steps ?? 0);

    const insights: CoachInsight[] = [];

    if (proteinGoal > 0 && proteinToday < proteinGoal) {
      insights.push({
        id: "protein",
        type: "tip",
        message: `Protein: ${proteinToday}g / ${proteinGoal}g today.`,
      });
    }

    if (waterToday < 2000) {
      insights.push({
        id: "water",
        type: "reminder",
        message: "Drink more water today.",
      });
    }

    if (stepsToday < 5000) {
      insights.push({
        id: "steps",
        type: "improvement",
        message: `Only ${stepsToday} steps today. Try reaching 5,000.`,
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: "good",
        type: "improvement",
        message: "Excellent! You're on track today.",
      });
    }

    return insights;
  },

  async getDailySummary(): Promise<DailySummary> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_SUMMARY;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: dailyLog } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      waterIntakeMl: dailyLog?.water_ml ?? 0,
      waterGoalMl: 3000,

      proteinGrams: dailyLog?.protein ?? 0,
      proteinGoalGrams: profile?.protein_goal ?? 0,

      steps: dailyLog?.steps ?? 0,
      stepsGoal: 10000,

      currentStreakDays: 0,

      restDayInDays: 2,

      recoveryScore: 80,
    };
  },
};
