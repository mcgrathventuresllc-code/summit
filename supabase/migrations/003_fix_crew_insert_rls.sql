-- Fix "new row violates row-level security" on crews insert
-- Run in Supabase SQL Editor

-- RPC: create crew as current user (bypasses RLS, validates auth)
-- Param order must match schema cache (alphabetical: p_invite_code, p_name)
create or replace function public.create_crew(p_invite_code text, p_name text)
returns json as $$
declare
  v_crew_id uuid;
  v_crew json;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.crews (name, invite_code, created_by)
  values (p_name, p_invite_code, auth.uid())
  returning id into v_crew_id;

  select to_json(c) into v_crew
  from public.crews c
  where c.id = v_crew_id;

  return v_crew;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.create_crew(text, text) to anon;
grant execute on function public.create_crew(text, text) to authenticated;
