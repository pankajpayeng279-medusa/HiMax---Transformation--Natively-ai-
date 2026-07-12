import { supabase } from './supabase/client';
import type { ProgressLogInsert } from '../types/supabase';

export interface ProgressData {
  weight: number;
  body_fat: number;
  muscle_mass: number;
  chest_cm: number;
  waist_cm: number;
  hips_cm: number;
  arms_cm: number;
  thighs_cm: number;
  notes: string;
}

export const EMPTY_PROGRESS: ProgressData = {
  weight: 0,
  body_fat: 0,
  muscle_mass: 0,
  chest_cm: 0,
  waist_cm: 0,
  hips_cm: 0,
  arms_cm: 0,
  thighs_cm: 0,
  notes: '',
};

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getLatestProgress(): Promise<ProgressData> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return EMPTY_PROGRESS;
  }

  return {
    weight: data.weight ?? 0,
    body_fat: data.body_fat ?? 0,
    muscle_mass: data.muscle_mass ?? 0,
    chest_cm: data.chest_cm ?? 0,
    waist_cm: data.waist_cm ?? 0,
    hips_cm: data.hips_cm ?? 0,
    arms_cm: data.arms_cm ?? 0,
    thighs_cm: data.thighs_cm ?? 0,
    notes: data.notes ?? '',
  };
}

export async function saveProgress(progress: ProgressData): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = getTodayDate();
  const trimmedNotes = progress.notes.trim();

  const payload: ProgressLogInsert = {
    user_id: user.id,
    date: today,
    weight: progress.weight,
    body_fat: progress.body_fat,
    muscle_mass: progress.muscle_mass,
    chest_cm: progress.chest_cm,
    waist_cm: progress.waist_cm,
    hips_cm: progress.hips_cm,
    arms_cm: progress.arms_cm,
    thighs_cm: progress.thighs_cm,
    notes: trimmedNotes === '' ? null : trimmedNotes,
  };

  const { error } = await supabase
    .from('progress_logs')
    .upsert(payload, { onConflict: 'user_id,date' });

  if (error) throw error;
}