-- v0.5: Externen Provider-Cache entfernen und manuelle öffentliche Flugupdates einführen.

drop function if exists public.claim_flight_status_refresh(text,date,timestamptz);
drop table if exists public.flight_status_cache;

create table if not exists public.flight_updates (
  id uuid primary key default gen_random_uuid(),
  flight_number text not null,
  flight_date date not null,
  status text not null default 'scheduled' check (status in ('scheduled','checkin','boarding','delayed','departed','enroute','landed','cancelled')),
  gate text check (char_length(gate) <= 10),
  estimated_departure time,
  estimated_arrival time,
  note text check (char_length(note) <= 240),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint flight_updates_flight_unique unique (flight_number, flight_date),
  constraint flight_updates_known_flight check ((flight_number, flight_date) in (
    ('EK060', '2026-08-30'::date),
    ('EK658', '2026-08-31'::date),
    ('EK657', '2026-09-10'::date),
    ('EK061', '2026-09-10'::date)
  ))
);

alter table public.flight_updates enable row level security;

grant select on public.flight_updates to anon, authenticated;
grant insert, update, delete on public.flight_updates to authenticated;
revoke insert, update, delete on public.flight_updates from anon;

drop policy if exists "public flight updates readable" on public.flight_updates;
drop policy if exists "owner manages flight updates" on public.flight_updates;
create policy "public flight updates readable" on public.flight_updates for select to anon, authenticated using (true);
create policy "owner manages flight updates" on public.flight_updates for all to authenticated
using (public.is_owner()) with check (public.is_owner() and updated_by = auth.uid());

drop trigger if exists flight_updates_updated on public.flight_updates;
create trigger flight_updates_updated before update on public.flight_updates
for each row execute function public.set_updated_at();

alter table public.flight_updates replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'flight_updates'
  ) then
    alter publication supabase_realtime add table public.flight_updates;
  end if;
end $$;
