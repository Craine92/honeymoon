create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now()
);
create table public.trip_days (
  id uuid primary key default gen_random_uuid(), date date not null unique,
  day_number integer not null unique check (day_number between 1 and 12), title text,
  description text, highlight text, is_public boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.activities (
  id uuid primary key default gen_random_uuid(), trip_day_id uuid not null references public.trip_days(id) on delete cascade,
  title text not null, description text, start_time time, location text, category text not null default 'Allgemein',
  is_public boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.reef_sightings (
  id uuid primary key default gen_random_uuid(), animal_type text not null check (animal_type in ('Hai','Schildkröte','Rochen','Delfin','Muräne','Oktopus','Rifffisch','Sonstiges')),
  species text, sighting_date date not null, sighting_time time, location text, count integer not null default 1 check (count > 0), notes text,
  is_public boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.memories (
  id uuid primary key default gen_random_uuid(), memory_date date not null, title text not null, description text, location text, image_url text,
  favorite boolean not null default false, is_public boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.highlights (
  id uuid primary key default gen_random_uuid(), title text not null, description text, highlight_date date, category text not null,
  status text not null default 'planned' check (status in ('planned','completed')), image_url text, is_public boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.expenses (
  id uuid primary key default gen_random_uuid(), expense_date date not null, description text not null, amount numeric(12,2) not null check (amount >= 0),
  currency text not null check (currency in ('EUR','USD','MVR')), category text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.packing_items (
  id uuid primary key default gen_random_uuid(), title text not null, category text not null, packed boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger trip_days_updated before update on public.trip_days for each row execute function public.set_updated_at();
create trigger activities_updated before update on public.activities for each row execute function public.set_updated_at();
create trigger reef_updated before update on public.reef_sightings for each row execute function public.set_updated_at();
create trigger memories_updated before update on public.memories for each row execute function public.set_updated_at();
create trigger highlights_updated before update on public.highlights for each row execute function public.set_updated_at();
create trigger expenses_updated before update on public.expenses for each row execute function public.set_updated_at();
create trigger packing_updated before update on public.packing_items for each row execute function public.set_updated_at();

insert into public.trip_days(date,day_number,title,description,is_public) values
('2026-08-30',1,'Unsere Reise beginnt','Abflug um 15:30 Uhr ab Hamburg.',true),
('2026-08-31',2,'Willkommen auf den Malediven','Ankunft in Malé und Transfer per Wasserflugzeug zum Resort.',true),
('2026-09-01',3,'Reisetag 3','',true),('2026-09-02',4,'Reisetag 4','',true),('2026-09-03',5,'Reisetag 5','',true),
('2026-09-04',6,'Reisetag 6','',true),('2026-09-05',7,'Reisetag 7','',true),('2026-09-06',8,'Reisetag 8','',true),
('2026-09-07',9,'Reisetag 9','',true),('2026-09-08',10,'Reisetag 10','',true),('2026-09-09',11,'Reisetag 11','',true),
('2026-09-10',12,'Rückreise','Unser letzter Reisetag.',true);

alter table public.profiles enable row level security;
alter table public.trip_days enable row level security; alter table public.activities enable row level security;
alter table public.reef_sightings enable row level security; alter table public.memories enable row level security;
alter table public.highlights enable row level security; alter table public.expenses enable row level security; alter table public.packing_items enable row level security;

create or replace function public.is_owner() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'owner');
$$;
revoke all on function public.is_owner() from public; grant execute on function public.is_owner() to anon, authenticated;

create policy "own profile readable" on public.profiles for select to authenticated using (id = auth.uid() or public.is_owner());
create policy "public trip days readable" on public.trip_days for select to anon, authenticated using (is_public or public.is_owner());
create policy "public activities readable" on public.activities for select to anon, authenticated using (public.is_owner() or (is_public and exists(select 1 from public.trip_days d where d.id=trip_day_id and d.is_public)));
create policy "public sightings readable" on public.reef_sightings for select to anon, authenticated using (is_public or public.is_owner());
create policy "public memories readable" on public.memories for select to anon, authenticated using (is_public or public.is_owner());
create policy "public highlights readable" on public.highlights for select to anon, authenticated using (is_public or public.is_owner());
create policy "owner expenses readable" on public.expenses for select to authenticated using (public.is_owner());
create policy "owner packing readable" on public.packing_items for select to authenticated using (public.is_owner());

create policy "owner manages trip days" on public.trip_days for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner manages activities" on public.activities for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner manages sightings" on public.reef_sightings for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner manages memories" on public.memories for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner manages highlights" on public.highlights for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner manages expenses" on public.expenses for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner manages packing" on public.packing_items for all to authenticated using (public.is_owner()) with check (public.is_owner());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('memories','memories',false,8388608,array['image/jpeg','image/png','image/webp','image/heic','image/heif']) on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=excluded.allowed_mime_types;
create policy "public memory images readable" on storage.objects for select to anon, authenticated using (bucket_id='memories' and (public.is_owner() or exists(select 1 from public.memories m where m.image_url=name and m.is_public)));
create policy "owner uploads memory images" on storage.objects for insert to authenticated with check (bucket_id='memories' and public.is_owner() and (storage.foldername(name))[1]=auth.uid()::text);
create policy "owner updates memory images" on storage.objects for update to authenticated using (bucket_id='memories' and public.is_owner()) with check (bucket_id='memories' and public.is_owner());
create policy "owner deletes memory images" on storage.objects for delete to authenticated using (bucket_id='memories' and public.is_owner());

create index activities_day_idx on public.activities(trip_day_id); create index reef_public_date_idx on public.reef_sightings(is_public,sighting_date desc);
create index memories_public_date_idx on public.memories(is_public,memory_date desc); create index highlights_public_date_idx on public.highlights(is_public,highlight_date);
