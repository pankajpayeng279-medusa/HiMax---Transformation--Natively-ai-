import { supabase } from "../supabase/client";
import type {
  DashboardData,
  WorkoutSummary,
  ProgressEntry,
  NutritionSummary,
  AIRecommendation,
} from "../../types/dashboard";

export async function fetchDashboardData(): Promise<DashboardData> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: dailyLog } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  const { data: workouts } = await supabase
  .from("workouts")
  .select("*")
  .eq("user_id", user.id)
  .order("date", { ascending: false });

  const { data: progress } = await supabase
  .from("progress_logs")
  .select("*")
  .eq("user_id", user.id)
  .order("date", { ascending: true });

  const nutritionToday: NutritionSummary = {
  calories: dailyLog?.calories ?? 0,
  protein: dailyLog?.protein ?? 0,
  carbs: dailyLog?.carbs ?? 0,
  fat: dailyLog?.fat ?? 0,
  goal: profile?.calorie_goal ?? 0,
};

  const stats = {
  workoutsCompleted: workouts?.filter((w) => w.completed).length ?? 0,

  currentStreak: 0,

  caloriesBurned:
    workouts?.reduce(
      (sum, workout) => sum + (workout.calories_burned ?? 0),
      0
    ) ?? 0,

  activeMinutes:
    workouts?.reduce(
      (sum, workout) => sum + (workout.duration_minutes ?? 0),
      0
    ) ?? 0,
};

  const recentWorkouts: WorkoutSummary[] =
  workouts?.slice(0, 5).map((workout) => ({
    id: workout.id,
    name: workout.workout_name,
    date: workout.date,
    duration: workout.duration_minutes ?? 0,
    exercises: Array.isArray(workout.exercise_list)
  ? workout.exercise_list.length
  : 0,
    completed: workout.completed,
  })) ?? [];

  const weeklyProgress: ProgressEntry[] =
  progress?.map((entry) => ({
    date: entry.date,
    weight: entry.weight ?? 0,
    bodyFat: entry.body_fat ?? 0,
  })) ?? [];

  const recommendation: AIRecommendation = {
  title: "Ready for today's workout?",
  description:
    "Complete today's workout and nutrition goals to continue your progress.",
  actionLabel: "Open AI Coach",
  actionType: "coach",
};

return {
  stats,
  recentWorkouts,
  nutritionToday,
  weeklyProgress,
  recommendation,
};
}