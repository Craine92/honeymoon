-- 1. Zuerst Philipp und Justine unter Authentication > Users anlegen.
-- 2. Dort jeweils die UUID aus der Spalte User UID kopieren.
-- 3. Die Platzhalter unten ersetzen und dieses Skript im SQL Editor ausführen.
-- Keine Passwörter und keine E-Mail-Adressen gehören in dieses Skript.

insert into public.profiles (id, display_name, role)
values
  ('PHILIPP_AUTH_USER_UUID'::uuid, 'Philipp', 'owner'),
  ('JUSTINE_AUTH_USER_UUID'::uuid, 'Justine', 'owner')
on conflict (id) do update
set display_name = excluded.display_name,
    role = 'owner';

-- Kontrolle: Es müssen danach genau die gewünschten Owner sichtbar sein.
select id, display_name, role, created_at from public.profiles order by display_name;
