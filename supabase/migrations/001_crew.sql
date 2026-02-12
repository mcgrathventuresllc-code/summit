-- Accountability Crew: crews, members, messages
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Crews
create table public.crews (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text not null unique,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Crew members (who's in each crew)
create table public.crew_members (
  id uuid primary key default uuid_generate_v4(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz not null default now(),
  unique(crew_id, user_id)
);

-- Crew messages (chat + system events like level-up)
create table public.crew_messages (
  id uuid primary key default uuid_generate_v4(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('message', 'level_up')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index crew_messages_crew_id_created_at on public.crew_messages(crew_id, created_at desc);
create index crew_members_crew_id on public.crew_members(crew_id);
create index crew_members_user_id on public.crew_members(user_id);

-- Row Level Security
alter table public.crews enable row level security;
alter table public.crew_members enable row level security;
alter table public.crew_messages enable row level security;

-- Helper: check if current user is in a crew (bypasses RLS, avoids recursion)
create or replace function public.is_crew_member(p_crew_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.crew_members
    where crew_id = p_crew_id and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Crews: members can read
create policy "Crew members can read crews"
  on public.crews for select
  using (public.is_crew_member(crews.id));

-- Anyone can insert crew (creator joins automatically)
create policy "Authenticated users can create crews"
  on public.crews for insert
  with check (auth.uid() = created_by);

-- Crew members: members can read
create policy "Crew members can read members"
  on public.crew_members for select
  using (public.is_crew_member(crew_members.crew_id));

-- Users can insert themselves as members (join)
create policy "Users can join crews"
  on public.crew_members for insert
  with check (auth.uid() = user_id);

-- Users can update their own display name
create policy "Users can update own member"
  on public.crew_members for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Crew creator is auto-added via trigger
create or replace function public.add_creator_to_crew()
returns trigger as $$
begin
  insert into public.crew_members (crew_id, user_id, display_name)
  values (new.id, new.created_by, coalesce(
    (select raw_user_meta_data->>'display_name' from auth.users where id = new.created_by),
    (select split_part(email, '@', 1) from auth.users where id = new.created_by),
    'Climber'
  ));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_crew_created
  after insert on public.crews
  for each row execute function public.add_creator_to_crew();

-- Crew messages: members can read and insert
create policy "Crew members can read messages"
  on public.crew_messages for select
  using (public.is_crew_member(crew_messages.crew_id));

create policy "Crew members can send messages"
  on public.crew_messages for insert
  with check (
    (auth.uid() = user_id or user_id is null)
    and public.is_crew_member(crew_messages.crew_id)
  );

-- Enable Realtime for live chat
alter publication supabase_realtime add table public.crew_messages;
