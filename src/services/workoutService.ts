import { supabase } from './supabase/client';
import type { Workout, WorkoutInsert, WorkoutUpdate } from '../types/supabase';

/**
 * Fetches workouts for a user, most recent first.
 * Pass `date` ('YYYY-MM-DD') to filter down to a single day.
 */
export async function getWorkouts(userId: string, date?: string): Promise<Workout[]> {
  let query = supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Logs a new workout. */
export async function saveWorkout(workout: WorkoutInsert): Promise<Workout> {
  const { data, error } = await supabase.from('workouts').insert(workout).select().single();
  if (error) throw error;
  return data;
}

/** Updates an existing workout by id (e.g. marking it completed). */
export async function updateWorkout(id: string, updates: WorkoutUpdate): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Deletes a workout by id. */
export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) throw error;
}

const workoutService = {
  get: getWorkouts,
  save: saveWorkout,
  update: updateWorkout,
  delete: deleteWorkout,
};

export default workoutService;