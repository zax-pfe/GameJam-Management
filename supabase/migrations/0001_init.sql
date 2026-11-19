-- Game Project Manager — initial schema
-- Run once in the Supabase SQL editor (or `supabase db push`).
-- Access rule: a Google account can use the app only if its email belongs to a Team member.

-- ---------------------------------------------------------------------------
-- Members (Team) — also the access whitelist
-- ---------------------------------------------------------------------------
create table public.members (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null check (char_length(btrim(first_name)) between 1 and 80),
  last_name   text not null check (char_length(btrim(last_name)) between 1 and 80),
  email       text not null unique check (email = lower(btrim(email)) and email like '%@%'),
  role        text not null default 'other' check (role in (
                'game_designer', 'developer', 'artist_3d', 'artist_2d',
                'ui_ux_designer', 'art_director', 'sound_designer', 'other')),
  avatar_path text,
  created_at  timestamptz not null default now()
);

-- Helpers used by RLS and defaults. SECURITY DEFINER avoids RLS recursion on members.
create function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.id from public.members m
  where m.email = lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_member_id() is not null
$$;

revoke all on function public.current_member_id() from public, anon;
revoke all on function public.is_member() from public, anon;
grant execute on function public.current_member_id() to authenticated;
grant execute on function public.is_member() to authenticated;

-- ---------------------------------------------------------------------------
-- Tickets
-- ---------------------------------------------------------------------------
create table public.tickets (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(btrim(title)) between 1 and 200),
  type           text not null default 'other' check (type in (
                   'design', 'development', '3d', '2d_art', 'ui_ux', 'audio', 'other')),
  status         text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  position       double precision not null default 0,
  estimate_hours numeric(6, 2) check (estimate_hours is null or estimate_hours >= 0),
  complexity     text check (complexity is null or complexity in ('simple', 'medium', 'complex')),
  due_date       ²date,
  image_path     text,
  created_by     uuid references public.members (id) on delete set null default public.current_member_id(),
  updated_by     uuid references public.members (id) on delete set null default public.current_member_id(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index tickets_status_position_idx on public.tickets (status, position);
create index tickets_due_date_idx on public.tickets (due_date);

-- Every change is attributed to the signed-in member.
create function public.tickets_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := public.current_member_id();
  return new;
end;
$$;

create trigger tickets_touch
before update on public.tickets
for each row execute function public.tickets_touch();

create table public.ticket_assignees (
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  primary key (ticket_id, member_id)
);

create index ticket_assignees_member_idx on public.ticket_assignees (member_id);

-- ---------------------------------------------------------------------------
-- Comments (read + create only)
-- ---------------------------------------------------------------------------
create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.tickets (id) on delete cascade,
  author_id  uuid references public.members (id) on delete set null default public.current_member_id(),
  body       text not null check (char_length(btrim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index comments_ticket_idx on public.comments (ticket_id, created_at);

-- ---------------------------------------------------------------------------
-- Project Hub resources
-- ---------------------------------------------------------------------------
create table public.resources (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(btrim(name)) between 1 and 120),
  url            text not null check (url ~* '^https?://'),
  category       text not null default 'other' check (category in (
                   'design', 'drive', 'development', 'documentation', 'references', 'assets', 'other')),
  description    text check (description is null or char_length(description) <= 500),
  thumbnail_path text,
  created_by     uuid references public.members (id) on delete set null default public.current_member_id(),
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: every whitelisted member has the same rights.
-- ---------------------------------------------------------------------------
alter table public.members enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_assignees enable row level security;
alter table public.comments enable row level security;
alter table public.resources enable row level security;

create policy "members: full access for members" on public.members
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "tickets: full access for members" on public.tickets
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "ticket_assignees: full access for members" on public.ticket_assignees
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "resources: full access for members" on public.resources
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "comments: read for members" on public.comments
  for select to authenticated using (public.is_member());

-- A comment is always attributed to the signed-in member.
create policy "comments: create as yourself" on public.comments
  for insert to authenticated
  with check (public.is_member() and author_id = public.current_member_id());

-- ---------------------------------------------------------------------------
-- Realtime: every view stays in sync across tabs and teammates.
-- ---------------------------------------------------------------------------
alter table public.ticket_assignees replica identity full;
alter table public.comments replica identity full;

alter publication supabase_realtime add table
  public.members, public.tickets, public.ticket_assignees, public.comments, public.resources;

-- ---------------------------------------------------------------------------
-- Storage: one bucket for avatars, ticket images and resource thumbnails.
-- Public read (random file names), write restricted to members.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880, array['image/webp', 'image/png', 'image/jpeg', 'image/gif'])
on conflict (id) do nothing;

create policy "images: members read" on storage.objects
  for select to authenticated using (bucket_id = 'images' and public.is_member());

create policy "images: members upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_member());

create policy "images: members update" on storage.objects
  for update to authenticated using (bucket_id = 'images' and public.is_member());

create policy "images: members delete" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_member());
