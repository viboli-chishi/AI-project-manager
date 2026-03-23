-- ============================================================
-- AI Group Project Manager — Supabase Schema
-- Run this in your Supabase project → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Teams table — one team per project
create table if not exists teams (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  project_id   text unique not null,   -- used as Hindsight bank_id
  owner_id     uuid references auth.users(id) on delete cascade,
  created_at   timestamptz default now()
);

-- Members table — students in a team
create table if not exists members (
  id               uuid primary key default gen_random_uuid(),
  team_id          uuid references teams(id) on delete cascade,
  name             text not null,
  role             text not null default 'Member',
  monthly_activity int  default 0,
  in_progress      int  default 0,
  overtime         int  default 0,
  plan_completion  int  default 0,
  extra_goals      int  default 0,
  projects_done    int  default 0,
  kpi_progress     int  default 0,
  created_at       timestamptz default now()
);

-- Tasks table — project tasks with progress tracking
create table if not exists tasks (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid references teams(id) on delete cascade,
  title        text not null,
  assigned_to  text,                          -- member name (string for simplicity)
  status       text default 'todo',           -- 'todo' | 'in_progress' | 'done'
  priority     text default 'low',            -- 'high' | 'low'
  progress     int  default 0,               -- 0-100
  deadline     date,
  total_time   text default '0h',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Meetings table — logs AI-summarised meetings
create table if not exists meetings (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid references teams(id) on delete cascade,
  transcript   text,
  summary      text,
  attendees    text[],
  created_at   timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- Users can only see rows belonging to their own team

alter table teams   enable row level security;
alter table members enable row level security;
alter table tasks   enable row level security;
alter table meetings enable row level security;

-- Teams: owner can manage everything they own, and authenticated users can create teams
drop policy if exists "owner can manage team" on teams;
drop policy if exists "users can create teams" on teams;

create policy "owner can manage team" on teams
  for all using (auth.uid() = owner_id);

create policy "users can create teams" on teams
  for insert with check (auth.uid() = owner_id);


-- Members: team owner can manage
drop policy if exists "team owner manages members" on members;
create policy "team owner manages members" on members
  for all using (
    exists (select 1 from teams where teams.id = members.team_id and teams.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from teams where teams.id = members.team_id and teams.owner_id = auth.uid())
  );

-- Tasks: team owner can manage
drop policy if exists "team owner manages tasks" on tasks;
create policy "team owner manages tasks" on tasks
  for all using (
    exists (select 1 from teams where teams.id = tasks.team_id and teams.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from teams where teams.id = tasks.team_id and teams.owner_id = auth.uid())
  );

-- Meetings: team owner can manage
drop policy if exists "team owner manages meetings" on meetings;
create policy "team owner manages meetings" on meetings
  for all using (
    exists (select 1 from teams where teams.id = meetings.team_id and teams.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from teams where teams.id = meetings.team_id and teams.owner_id = auth.uid())
  );

