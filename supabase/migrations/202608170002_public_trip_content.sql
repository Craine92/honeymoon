-- v0.3: Reisejournal-Inhalte sind bewusst öffentlich lesbar.
-- Schreibrechte bleiben unverändert ausschließlich bei profiles.role = 'owner'.

update public.trip_days set is_public = true where is_public is distinct from true;
update public.activities set is_public = true where is_public is distinct from true;
update public.reef_sightings set is_public = true where is_public is distinct from true;
update public.memories set is_public = true where is_public is distinct from true;
update public.highlights set is_public = true where is_public is distinct from true;

alter table public.trip_days alter column is_public set default true;
alter table public.activities alter column is_public set default true;
alter table public.reef_sightings alter column is_public set default true;
alter table public.memories alter column is_public set default true;
alter table public.highlights alter column is_public set default true;

drop policy if exists "public trip days readable" on public.trip_days;
drop policy if exists "public activities readable" on public.activities;
drop policy if exists "public sightings readable" on public.reef_sightings;
drop policy if exists "public memories readable" on public.memories;
drop policy if exists "public highlights readable" on public.highlights;

create policy "all trip days readable" on public.trip_days for select to anon, authenticated using (true);
create policy "all activities readable" on public.activities for select to anon, authenticated using (true);
create policy "all sightings readable" on public.reef_sightings for select to anon, authenticated using (true);
create policy "all memories readable" on public.memories for select to anon, authenticated using (true);
create policy "all highlights readable" on public.highlights for select to anon, authenticated using (true);

-- Der Bucket bleibt privat. Objektzugriff wird weiterhin über RLS und Signed URLs gewährt.
drop policy if exists "public memory images readable" on storage.objects;
create policy "all memory images readable" on storage.objects for select to anon, authenticated using (bucket_id = 'memories');

-- Sicherheits-Audit: Für anon werden bewusst keine INSERT/UPDATE/DELETE-Policies angelegt.
-- packing_items, expenses und profiles bleiben durch ihre vorhandenen Policies privat.
