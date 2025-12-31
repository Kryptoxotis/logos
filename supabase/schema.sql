-- Logos Greek Learning App - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- User Settings table
create table if not exists public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  dark_mode boolean default true,
  sound_enabled boolean default true,
  haptic_feedback boolean default true,
  show_phonetic_guide boolean default true,
  quiz_size integer default 10,
  mastery_min_reviews integer default 5,
  mastery_min_accuracy integer default 80,
  mastery_min_interval integer default 7,
  mastery_practice_weight numeric(3,2) default 0.5,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- User Progress table
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  alphabet_total integer default 24,
  alphabet_mastered integer default 0,
  alphabet_learning integer default 0,
  alphabet_not_started integer default 24,
  alphabet_accuracy numeric(5,2) default 0,
  current_streak integer default 0,
  best_streak integer default 0,
  last_practice_date timestamptz,
  nouns_unlocked boolean default false,
  verbs_unlocked boolean default false,
  noun_accuracy numeric(5,2) default 0,
  verb_accuracy numeric(5,2) default 0,
  nouns_mastered integer default 0,
  verbs_mastered integer default 0,
  total_quizzes integer default 0,
  total_time_ms bigint default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- SRS Items table (Spaced Repetition)
create table if not exists public.srs_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_id text not null,
  item_type text check (item_type in ('letter', 'noun-ending', 'verb-ending')) not null,
  ease_factor numeric(4,2) default 2.5,
  interval integer default 0,
  repetitions integer default 0,
  next_review_date timestamptz default now(),
  last_review_date timestamptz,
  total_reviews integer default 0,
  correct_reviews integer default 0,
  average_response_time integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, item_id)
);

-- Quiz History table
create table if not exists public.quiz_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  question_id text not null,
  item_id text not null,
  quiz_type text not null,
  correct boolean not null,
  response_time_ms integer not null,
  created_at timestamptz default now() not null
);

-- Create indexes for performance
create index if not exists idx_srs_items_user_id on public.srs_items(user_id);
create index if not exists idx_srs_items_next_review on public.srs_items(user_id, next_review_date);
create index if not exists idx_srs_items_type on public.srs_items(user_id, item_type);
create index if not exists idx_quiz_history_user_id on public.quiz_history(user_id);
create index if not exists idx_quiz_history_created on public.quiz_history(user_id, created_at desc);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_progress enable row level security;
alter table public.srs_items enable row level security;
alter table public.quiz_history enable row level security;

-- RLS Policies: Users can only access their own data

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User Settings policies
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

-- User Progress policies
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

-- SRS Items policies
create policy "Users can view own srs items"
  on public.srs_items for select
  using (auth.uid() = user_id);

create policy "Users can update own srs items"
  on public.srs_items for update
  using (auth.uid() = user_id);

create policy "Users can insert own srs items"
  on public.srs_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own srs items"
  on public.srs_items for delete
  using (auth.uid() = user_id);

-- Quiz History policies
create policy "Users can view own quiz history"
  on public.quiz_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz history"
  on public.quiz_history for insert
  with check (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.user_settings (user_id) values (new.id);
  insert into public.user_progress (user_id) values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update timestamps
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add update triggers
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();
create trigger update_user_settings_updated_at before update on public.user_settings
  for each row execute procedure public.update_updated_at();
create trigger update_user_progress_updated_at before update on public.user_progress
  for each row execute procedure public.update_updated_at();
create trigger update_srs_items_updated_at before update on public.srs_items
  for each row execute procedure public.update_updated_at();
