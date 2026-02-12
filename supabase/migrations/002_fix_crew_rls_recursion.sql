-- Fix infinite recursion in crew_members RLS
-- Run this in Supabase SQL Editor (after 001_crew.sql)

-- Helper: check if current user is in a crew (bypasses RLS, breaks recursion)
create or replace function public.is_crew_member(p_crew_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.crew_members
    where crew_id = p_crew_id and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Drop recursive policies
drop policy if exists "Crew members can read crews" on public.crews;
drop policy if exists "Crew members can read members" on public.crew_members;
drop policy if exists "Crew members can read messages" on public.crew_messages;
drop policy if exists "Crew members can send messages" on public.crew_messages;

-- Recreate using the helper (no recursion)
create policy "Crew members can read crews"
  on public.crews for select
  using (public.is_crew_member(crews.id));

create policy "Crew members can read members"
  on public.crew_members for select
  using (public.is_crew_member(crew_members.crew_id));

create policy "Crew members can read messages"
  on public.crew_messages for select
  using (public.is_crew_member(crew_messages.crew_id));

create policy "Crew members can send messages"
  on public.crew_messages for insert
  with check (
    (auth.uid() = user_id or user_id is null)
    and public.is_crew_member(crew_messages.crew_id)
  );
