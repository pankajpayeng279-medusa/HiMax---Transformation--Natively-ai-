-- =============================================================================
-- HiMax AI Fitness App — Database Schema
-- Run this in the Supabase SQL editor, or check it in as a migration.
-- Requires the `pgcrypto` extension for gen_random_uuid(), which is enabled
-- by default on Supabase projects.
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. profiles
-- One row per authenticated user. `id` mirrors auth.users.id (1:1 relationship).
-- =============================================================================

create table if not exists public.profiles (
  id                          uuid primary key references auth.users (id) on delete cascade,
  email                       text not null unique,
  name                        text,
  age                         integer check (age is null or (age > 0 and age < 130)),
  gender                      text check (gender is null or gender in ('Male', 'Female', 'Other')),
  height_cm                   numeric(5, 2) check (height_cm is null or height_cm > 0),
  weight_kg                   numeric(5, 2) check (weight_kg is null or weight_kg > 0),
  target_weight_kg            numeric(5, 2) check (target_weight_kg is null or target_weight_kg > 0),
  goal                        text check (
                                goal is null or goal in (
                                  'Muscle Gain', 'Fat Loss', 'Weight Gain',
                                  'Maintenance', 'Strength', 'Endurance'
                                )
                              ),
  activity_level              text check (
                                activity_level is null or activity_level in (
                                  'Sedentary', 'Lightly Active', 'Moderately Active',
                                  'Very Active', 'Extremely Active'
                                )
                              ),
  experience_level             text check (
                                experience_level is null or experience_level in ('Beginner', 'Intermediate', 'Advanced')
                              ),
  workout_location             text check (
                                workout_location is null or workout_location in ('Home', 'Gym', 'Both')
                              ),
  daily_budget                 numeric(10, 2) check (daily_budget is null or daily_budget >= 0),
  monthly_income               numeric(10, 2) check (monthly_income is null or monthly_income >= 0),
  monthly_disposable_income    numeric(10, 2) check (monthly_disposable_income is null or monthly_disposable_income >= 0),
  diet_type                    text check (
                                diet_type is null or diet_type in ('Vegetarian', 'Non-Vegetarian', 'Vegan')
                              ),
  protein_goal                 numeric(6, 2) check (protein_goal is null or protein_goal >= 0),
  calorie_goal                 numeric(7, 2) check (calorie_goal is null or calorie_goal >= 0),
  medical_conditions           text,
  allergies                    text,
  blood_report_url             text,
  profile_photo_url            text,
  completed_onboarding         boolean not null default false,
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);

comment on table public.profiles is 'One row per user; extends auth.users with fitness/onboarding data.';

-- =============================================================================
-- 2. daily_logs — one row per user per day (nutrition, hydration, budget, steps)
-- =============================================================================

create table if not exists public.daily_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  date           date not null,
  protein        numeric(6, 2) check (protein is null or protein >= 0),
  calories       numeric(7, 2) check (calories is null or calories >= 0),
  carbs          numeric(6, 2) check (carbs is null or carbs >= 0),
  fat            numeric(6, 2) check (fat is null or fat >= 0),
  water_ml       integer check (water_ml is null or water_ml >= 0),
  budget_spent   numeric(10, 2) check (budget_spent is null or budget_spent >= 0),
  steps          integer check (steps is null or steps >= 0),
  created_at     timestamptz not null default now(),
  constraint daily_logs_user_date_unique unique (user_id, date)
);

comment on table public.daily_logs is 'Per-day nutrition, hydration, budget and step tracking for a user.';

-- =============================================================================
-- 3. workouts
-- =============================================================================

create table if not exists public.workouts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  date               date not null,
  workout_name       text not null,
  duration_minutes   integer check (duration_minutes is null or duration_minutes >= 0),
  calories_burned    numeric(7, 2) check (calories_burned is null or calories_burned >= 0),
  completed          boolean not null default false,
  difficulty         text check (difficulty is null or difficulty in ('Easy', 'Medium', 'Hard')),
  exercise_list      jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now()
);

comment on table public.workouts is 'Logged / planned workouts for a user; exercise_list holds per-exercise sets/reps as JSON.';

-- =============================================================================
-- 4. progress_logs
-- =============================================================================

create table if not exists public.progress_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  weight        numeric(5, 2) check (weight is null or weight > 0),
  body_fat      numeric(4, 2) check (body_fat is null or (body_fat >= 0 and body_fat <= 100)),
  muscle_mass   numeric(5, 2) check (muscle_mass is null or muscle_mass >= 0),
  date          date not null,
  created_at    timestamptz not null default now()
);

comment on table public.progress_logs is 'Body measurement check-ins (weight, body fat %, muscle mass) over time.';

-- =============================================================================
-- 5. chat_history
-- =============================================================================

create table if not exists public.chat_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         text not null check (role in ('user', 'assistant', 'system')),
  message      text not null,
  created_at   timestamptz not null default now()
);

comment on table public.chat_history is 'AI coach chat transcript per user.';

-- =============================================================================
-- Indexes
-- =============================================================================

create index if not exists idx_daily_logs_user_date on public.daily_logs (user_id, date desc);
create index if not exists idx_workouts_user_date on public.workouts (user_id, date desc);
create index if not exists idx_progress_logs_user_date on public.progress_logs (user_id, date desc);
create index if not exists idx_chat_history_user_created on public.chat_history (user_id, created_at desc);

-- =============================================================================
-- updated_at auto-maintenance for profiles
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security — every table is locked down to "your own rows only"
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.progress_logs enable row level security;
alter table public.chat_history enable row level security;

-- profiles: a user can only see/edit their own row (id = auth.uid())
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- daily_logs
create policy "daily_logs_select_own" on public.daily_logs
  for select using (auth.uid() = user_id);

create policy "daily_logs_insert_own" on public.daily_logs
  for insert with check (auth.uid() = user_id);

create policy "daily_logs_update_own" on public.daily_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "daily_logs_delete_own" on public.daily_logs
  for delete using (auth.uid() = user_id);

-- workouts
create policy "workouts_select_own" on public.workouts
  for select using (auth.uid() = user_id);

create policy "workouts_insert_own" on public.workouts
  for insert with check (auth.uid() = user_id);

create policy "workouts_update_own" on public.workouts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workouts_delete_own" on public.workouts
  for delete using (auth.uid() = user_id);

-- progress_logs
create policy "progress_logs_select_own" on public.progress_logs
  for select using (auth.uid() = user_id);

create policy "progress_logs_insert_own" on public.progress_logs
  for insert with check (auth.uid() = user_id);

create policy "progress_logs_update_own" on public.progress_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "progress_logs_delete_own" on public.progress_logs
  for delete using (auth.uid() = user_id);

-- chat_history
create policy "chat_history_select_own" on public.chat_history
  for select using (auth.uid() = user_id);

create policy "chat_history_insert_own" on public.chat_history
  for insert with check (auth.uid() = user_id);

create policy "chat_history_update_own" on public.chat_history
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "chat_history_delete_own" on public.chat_history
  for delete using (auth.uid() = user_id);

-- =============================================================================
-- OPTIONAL — auto-create a bare profile row the moment a new auth user signs up.
-- Not required: profileService.save() below uses upsert, so it works whether
-- or not this trigger exists. Uncomment if you'd rather have the row created
-- immediately at sign-up time instead of at the end of onboarding.
-- =============================================================================

-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- as $$
-- begin
--   insert into public.profiles (id, email)
--   values (new.id, new.email)
--   on conflict (id) do nothing;
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists trg_on_auth_user_created on auth.users;
-- create trigger trg_on_auth_user_created
--   after insert on auth.users
--   for each row
--   execute function public.handle_new_user();