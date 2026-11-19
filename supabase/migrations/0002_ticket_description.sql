-- Ticket description (free text, editable from the ticket panel).
-- Run once in the Supabase SQL editor after 0001_init.sql.
alter table public.tickets
  add column if not exists description text
  check (description is null or char_length(description) <= 10000);
