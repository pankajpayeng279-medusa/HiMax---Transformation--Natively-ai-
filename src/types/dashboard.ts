export interface DashboardStats {
  workoutsCompleted: number;
  currentStreak: number;
  caloriesBurned: number;
  activeMinutes: number;
}

export interface WorkoutSummary {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: number;
  completed: boolean;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}

export interface ProgressEntry {
  date: string;
  weight: number;
  bodyFat: number;
}

export interface AIRecommendation {
  title: string;
  description: string;
  actionLabel: string;
  actionType: 'coach' | 'nutrition' | 'progress';
}

export interface DashboardData {
  stats: DashboardStats;
  recentWorkouts: WorkoutSummary[];
  nutritionToday: NutritionSummary;
  weeklyProgress: ProgressEntry[];
  recommendation: AIRecommendation;
}