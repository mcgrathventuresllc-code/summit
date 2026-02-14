-- Allow authenticated users to read crews by invite code (needed for join flow).
-- Without this, only existing members can read crews; joiners can't look up by code.

create policy "Authenticated users can read crews for join"
  on public.crews for select
  to authenticated
  using (true);
