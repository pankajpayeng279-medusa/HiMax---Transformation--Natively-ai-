import { supabase } from './supabase/client';
import type { DailyLogInsert } from '../types/supabase';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_ml: number;
  budget_spent: number;
}

export const EMPTY_NUTRITION: NutritionData = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  water_ml: 0,
  budget_spent: 0,
};

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getTodayNutrition(): Promise<NutritionData> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = getTodayDate();

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return EMPTY_NUTRITION;
  }

  return {
    calories: data.calories ?? 0,
    protein: data.protein ?? 0,
    carbs: data.carbs ?? 0,
    fat: data.fat ?? 0,
    water_ml: data.water_ml ?? 0,
    budget_spent: data.budget_spent ?? 0,
  };
}

export async function saveTodayNutrition(nutrition: NutritionData): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = getTodayDate();

  const payload: DailyLogInsert = {
    user_id: user.id,
    date: today,
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    water_ml: nutrition.water_ml,
    budget_spent: nutrition.budget_spent,
  };

  const { error } = await supabase
    .from('daily_logs')
    .upsert(payload, { onConflict: 'user_id,date' });

  if (error) throw error;
}