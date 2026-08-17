-- v0.4: Bild-/Video-Erinnerungen und serverseitiger Flugstatus-Cache.
-- Bestehende Bildpfade bleiben erhalten und werden in das neue Medienmodell übernommen.

alter table public.memories add column if not exists media_type text;
alter table public.memories add column if not exists media_url text;
alter table public.memories add column if not exists media_path text;
alter table public.memories add column if not exists thumbnail_url text;

update public.memories
set media_type = coalesce(media_type, 'image'),
    media_url = coalesce(media_url, image_url),
    media_path = coalesce(media_path, image_url)
where media_type is null or media_url is null or media_path is null;

alter table public.memories alter column media_type set default 'image';
alter table public.memories alter column media_type set not null;
alter table public.memories drop constraint if exists memories_media_type_check;
alter table public.memories add constraint memories_media_type_check check (media_type in ('image', 'video'));

-- Der private Bucket akzeptiert weiterhin Bilder und zusätzlich iPhone-/Web-Videos.
update storage.buckets
set public = false,
    file_size_limit = 157286400,
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp','image/heic','image/heif',
      'video/mp4','video/quicktime','video/webm'
    ]
where id = 'memories';

-- Gäste können ausschließlich Dateien lesen, die zu einer öffentlichen Erinnerung gehören.
drop policy if exists "all memory images readable" on storage.objects;
drop policy if exists "public memory images readable" on storage.objects;
create policy "public memory media readable" on storage.objects for select to anon, authenticated
using (
  bucket_id = 'memories' and (
    public.is_owner() or exists (
      select 1 from public.memories m
      where m.is_public and name in (m.image_url, m.media_url, m.media_path, m.thumbnail_url)
    )
  )
);

create table if not exists public.flight_status_cache (
  flight_number text not null,
  flight_date date not null,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  refresh_started_at timestamptz,
  primary key (flight_number, flight_date)
);

alter table public.flight_status_cache add column if not exists refresh_started_at timestamptz;

alter table public.flight_status_cache enable row level security;
-- Kein direkter Browserzugriff: nur die Edge Function verwaltet diesen Cache.
revoke all on public.flight_status_cache from anon, authenticated;
create index if not exists flight_status_cache_fetched_idx on public.flight_status_cache(fetched_at);

create or replace function public.claim_flight_status_refresh(
  p_flight_number text,
  p_flight_date date,
  p_stale_before timestamptz
) returns boolean
language plpgsql security definer set search_path = public
as $$
declare claimed boolean;
begin
  insert into public.flight_status_cache(flight_number, flight_date, payload, fetched_at, refresh_started_at)
  values (p_flight_number, p_flight_date, '{}'::jsonb, '1970-01-01'::timestamptz, now())
  on conflict (flight_number, flight_date) do update
    set refresh_started_at = now()
    where public.flight_status_cache.fetched_at < p_stale_before
      and (public.flight_status_cache.refresh_started_at is null or public.flight_status_cache.refresh_started_at < now() - interval '2 minutes')
  returning true into claimed;
  return coalesce(claimed, false);
end;
$$;
revoke all on function public.claim_flight_status_refresh(text,date,timestamptz) from public;
grant execute on function public.claim_flight_status_refresh(text,date,timestamptz) to service_role;
