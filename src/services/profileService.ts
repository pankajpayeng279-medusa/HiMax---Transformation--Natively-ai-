import { supabase } from './supabase/client';
import type { Profile, ProfileInsert, ProfileUpdate } from '../types/supabase';

/**
 * Fetches the profile row for a given user id.
 * Returns `null` if no profile exists yet (e.g. before onboarding finishes).
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Creates or fully upserts a profile row. Safe to call whether or not a row
 * already exists for this user (e.g. from a sign-up trigger) — matching
 * columns are overwritten, everything else is left untouched.
 */
export async function saveProfile(profile: ProfileInsert): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Patches specific fields on an existing profile row. */
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Deletes a user's profile row. */
export async function deleteProfile(userId: string): Promise<void> {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) throw error;
}

const profileService = {
  get: getProfile,
  save: saveProfile,
  update: updateProfile,
  delete: deleteProfile,
};

export default profileService;