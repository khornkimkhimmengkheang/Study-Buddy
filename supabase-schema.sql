-- StudyPlanner Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (Database -> SQL Editor)
-- Enable UUID extension (usually enabled by default)
create extension if not exists "uuid-ossp";
-- ============================================
-- COURSES TABLE
-- ============================================
create table if not exists public.courses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    color text not null default '#6366f1',
    created_at timestamptz default now() not null
);
-- Enable Row Level Security
alter table public.courses enable row level security;
-- Courses policies: Users can only see/modify their own courses
create policy "Users can view their own courses" on public.courses for
select using (auth.uid() = user_id);
create policy "Users can create their own courses" on public.courses for
insert with check (auth.uid() = user_id);
create policy "Users can update their own courses" on public.courses for
update using (auth.uid() = user_id);
create policy "Users can delete their own courses" on public.courses for delete using (auth.uid() = user_id);
-- ============================================
-- TASKS TABLE
-- ============================================
create table if not exists public.tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete
    set null,
        title text not null,
        description text,
        status text check (status in ('todo', 'doing', 'done')) default 'todo' not null,
        priority text check (priority in ('low', 'medium', 'high')) default 'medium' not null,
        due_date date,
        created_at timestamptz default now() not null,
        updated_at timestamptz default now() not null
);
-- Enable Row Level Security
alter table public.tasks enable row level security;
-- Tasks policies: Users can only see/modify their own tasks
create policy "Users can view their own tasks" on public.tasks for
select using (auth.uid() = user_id);
create policy "Users can create their own tasks" on public.tasks for
insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on public.tasks for
update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on public.tasks for delete using (auth.uid() = user_id);
-- ============================================
-- USER SETTINGS TABLE (Optional)
-- ============================================
create table if not exists public.user_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    settings jsonb default '{
    "theme": "system",
    "compactMode": false,
    "defaultPriority": "medium",
    "defaultStatus": "todo",
    "defaultSortBy": "dueDate",
    "weekStartsOn": "monday",
    "dateFormat": "MM/DD/YYYY"
  }'::jsonb not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);
-- Enable Row Level Security
alter table public.user_settings enable row level security;
-- Settings policies
create policy "Users can view their own settings" on public.user_settings for
select using (auth.uid() = user_id);
create policy "Users can create their own settings" on public.user_settings for
insert with check (auth.uid() = user_id);
create policy "Users can update their own settings" on public.user_settings for
update using (auth.uid() = user_id);
-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language plpgsql;
-- Trigger for tasks updated_at
create trigger tasks_updated_at before
update on public.tasks for each row execute function public.handle_updated_at();
-- Trigger for user_settings updated_at
create trigger user_settings_updated_at before
update on public.user_settings for each row execute function public.handle_updated_at();
-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_course_id_idx on public.tasks(course_id);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists courses_user_id_idx on public.courses(user_id);