-- Fix: Users cannot join crews because RLS blocks reading crews they're not in yet.
-- Add join_crew RPC (like create_crew) so lookup + insert happen server-side, bypassing RLS.

create or replace function public.join_crew(p_invite_code text, p_display_name text)
returns json as $$
declare
  v_crew_id uuid;
  v_crew json;
  v_user_id uuid;
  v_display text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Look up crew by invite code (bypasses RLS)
  select id into v_crew_id
  from public.crews
  where upper(trim(invite_code)) = upper(trim(p_invite_code));

  if v_crew_id is null then
    raise exception 'Invalid invite code';
  end if;

  -- Prevent duplicate membership
  if exists (select 1 from public.crew_members where crew_id = v_crew_id and user_id = v_user_id) then
    raise exception 'You''re already in this crew';
  end if;

  v_display := nullif(trim(p_display_name), '');
  if v_display is null then
    select coalesce(
      raw_user_meta_data->>'display_name',
      split_part(email, '@', 1),
      'Climber'
    ) into v_display
    from auth.users where id = v_user_id;
  end if;

  insert into public.crew_members (crew_id, user_id, display_name)
  values (v_crew_id, v_user_id, coalesce(v_display, 'Climber'));

  select to_json(c) into v_crew
  from public.crews c
  where c.id = v_crew_id;

  return v_crew;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.join_crew(text, text) to authenticated;

-- Reload PostgREST schema cache so the RPC is immediately callable
notify pgrst, 'reload schema';
