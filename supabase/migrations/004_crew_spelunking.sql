-- Add spelunking message type for negative streak notifications
-- Run in Supabase SQL Editor

alter table public.crew_messages drop constraint if exists crew_messages_type_check;
alter table public.crew_messages add constraint crew_messages_type_check
  check (type in ('message', 'level_up', 'spelunking'));
