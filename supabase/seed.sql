-- First member = first person allowed to sign in.
-- Replace the values below with YOUR Google account, run it once in the SQL editor,
-- then add the rest of the team from the Team page.
--
-- role: game_designer | developer | artist_3d | artist_2d | ui_ux_designer
--       | art_director | sound_designer | other

insert into public.members (first_name, last_name, email, role)
values ('First name', 'Last name', 'your.google.account@gmail.com', 'developer')
on conflict (email) do nothing;
