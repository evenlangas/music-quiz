-- Gehør: bokser, brett, økter, lag og buzzere.
--
-- Klientene leser rett fra tabellene (med RLS) og lytter på endringer via
-- Supabase Realtime. Alle skrivinger går gjennom funksjonene nederst, som
-- sjekker hvem som spør. Ingen klient kan skrive direkte i en tabell.

-- ---------------------------------------------------------------------------
-- Innhold: bokser og brett
-- ---------------------------------------------------------------------------

-- En fysisk boks. `code` er hemmelig og står i QR-koden inni boksen.
create table public.boxes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  created_at timestamptz not null default now()
);

-- Et fysisk brett. `id` står i QR-koden på brettet. Brettet selv er "dumt":
-- alt om sangene ligger her.
create table public.boards (
  id text primary key,
  name text not null,
  description text
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  board_id text not null references public.boards (id) on delete cascade,
  position smallint not null,
  name text not null,
  unique (board_id, position)
);

create table public.songs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  difficulty smallint not null check (difficulty between 1 and 5),
  title text not null,
  artist text not null default '',
  answer text not null,
  why text,
  spotify_uri text,
  start_ms integer not null default 0
);

create index songs_category_idx on public.songs (category_id);

-- ---------------------------------------------------------------------------
-- Spill: økter, spillere og spilte sanger
-- ---------------------------------------------------------------------------

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  box_id uuid not null references public.boxes (id),
  board_id text references public.boards (id),
  -- Sangen som spilles nå. Lagene kan ikke lese sangene, så kategori og
  -- vanskelighetsgrad står her også.
  current_song_id uuid references public.songs (id) on delete set null,
  current_category_id uuid references public.categories (id) on delete set null,
  current_difficulty smallint,
  current_started_at timestamptz,
  last_buzz_player_id uuid,
  last_buzz_at timestamptz,
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  ended_at timestamptz
);

-- Én åpen økt per boks.
create unique index sessions_one_open_per_box
  on public.sessions (box_id) where ended_at is null;

-- Én rad per enhet i en økt. Enheten er en anonym Supabase-bruker.
create table public.players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('gm', 'team')),
  name text not null,
  color text,
  score integer not null default 0,
  locked_until timestamptz not null default 'epoch',
  joined_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create unique index players_one_gm_per_session
  on public.players (session_id) where role = 'gm';
create unique index players_one_color_per_session
  on public.players (session_id, color) where role = 'team';

alter table public.sessions
  add constraint sessions_last_buzz_player_fk
  foreign key (last_buzz_player_id) references public.players (id) on delete set null;

-- Sanger som er ferdigspilt i en økt, og hvem som fikk poengene.
create table public.plays (
  session_id uuid not null references public.sessions (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  difficulty smallint not null,
  awarded_player_id uuid references public.players (id) on delete set null,
  played_at timestamptz not null default now(),
  primary key (session_id, song_id)
);

-- ---------------------------------------------------------------------------
-- Tilgang
-- ---------------------------------------------------------------------------

alter table public.boxes enable row level security;
alter table public.boards enable row level security;
alter table public.categories enable row level security;
alter table public.songs enable row level security;
alter table public.sessions enable row level security;
alter table public.players enable row level security;
alter table public.plays enable row level security;

-- Er innlogget bruker med i økten? security definer, så policyene under ikke
-- går i ring gjennom RLS på players.
create function public.is_member(p_session uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.players
    where session_id = p_session and user_id = auth.uid()
  );
$$;

-- Brettnavn og kategorier står uansett trykt på brettet.
create policy "alle leser brett" on public.boards for select using (true);
create policy "alle leser kategorier" on public.categories for select using (true);

-- Bokser og sanger har ingen select-policy: boksekoden er hemmelig, og lagene
-- skal ikke se fasiten. Game master får sangene gjennom gm_board().

create policy "medlemmer leser økten" on public.sessions
  for select using (public.is_member(id));
create policy "medlemmer leser spillerne" on public.players
  for select using (public.is_member(session_id));
create policy "medlemmer leser spilte sanger" on public.plays
  for select using (public.is_member(session_id));

-- Realtime sender endringer i disse tabellene til dem RLS slipper gjennom.
alter publication supabase_realtime add table public.sessions, public.players, public.plays;

-- ---------------------------------------------------------------------------
-- Funksjoner
-- ---------------------------------------------------------------------------

-- Økter uten aktivitet så lenge regnes som forlatt, så boksen kan brukes igjen.
create function public.stale_after()
returns interval
language sql
immutable
as $$ select interval '6 hours' $$;

-- Hjelper: spilleren som hører til innlogget bruker i økten, eller feil.
create function public.me_in(p_session uuid)
returns public.players
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v public.players;
begin
  select * into v from public.players
  where session_id = p_session and user_id = auth.uid();
  if not found then
    raise exception 'ikke_med' using errcode = 'P0001';
  end if;
  return v;
end;
$$;

create function public.require_gm(p_session uuid)
returns public.sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_me public.players;
  v_session public.sessions;
begin
  v_me := public.me_in(p_session);
  if v_me.role <> 'gm' then
    raise exception 'ikke_gm' using errcode = 'P0001';
  end if;
  select * into v_session from public.sessions where id = p_session for update;
  if v_session.ended_at is not null then
    raise exception 'okt_ferdig' using errcode = 'P0001';
  end if;
  update public.sessions set last_activity_at = now() where id = p_session;
  return v_session;
end;
$$;

-- Klientene bruker denne til å regne ut hvor langt unna serverklokka de er,
-- så nedtellingen på buzzeren blir lik på alle telefoner.
create function public.server_now()
returns timestamptz
language sql
stable
as $$ select clock_timestamp() $$;

-- Finner eller lager den åpne økten for en boks.
create function public.open_session_for(p_code text)
returns public.sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_box public.boxes;
  v_session public.sessions;
begin
  select * into v_box from public.boxes where code = p_code;
  if not found then
    raise exception 'ukjent_boks' using errcode = 'P0001';
  end if;

  -- Rydd bort en forlatt økt, så boksen blir ledig.
  update public.sessions set ended_at = now()
  where box_id = v_box.id and ended_at is null
    and last_activity_at < now() - public.stale_after();

  insert into public.sessions (box_id) values (v_box.id)
  on conflict (box_id) where ended_at is null do nothing;

  select * into v_session from public.sessions
  where box_id = v_box.id and ended_at is null;
  return v_session;
end;
$$;

-- Første steg etter at boksen er skannet: hva er ledig i økten?
-- Gir økten, meg (om jeg alt er med), om game master er tatt, og lagene.
create function public.peek_box(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.sessions;
begin
  if auth.uid() is null then
    raise exception 'ikke_innlogget' using errcode = 'P0001';
  end if;
  v_session := public.open_session_for(p_code);
  return jsonb_build_object(
    'session_id', v_session.id,
    'me', (select to_jsonb(p) from public.players p
           where p.session_id = v_session.id and p.user_id = auth.uid()),
    'gm_taken', exists (select 1 from public.players
                        where session_id = v_session.id and role = 'gm'),
    'teams', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'color', color) order by joined_at)
                       from public.players
                       where session_id = v_session.id and role = 'team'), '[]'::jsonb)
  );
end;
$$;

-- Bli med i økten som game master eller lag. Krever boksekoden igjen, så bare
-- den som har skannet boksen kan bli med.
create function public.join_box(p_code text, p_role text, p_name text default null, p_color text default null)
returns public.players
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.sessions;
  v_me public.players;
  v_name text := nullif(btrim(coalesce(p_name, '')), '');
begin
  if auth.uid() is null then
    raise exception 'ikke_innlogget' using errcode = 'P0001';
  end if;
  v_session := public.open_session_for(p_code);

  select * into v_me from public.players
  where session_id = v_session.id and user_id = auth.uid();
  if found then
    return v_me;
  end if;

  if p_role = 'gm' then
    if exists (select 1 from public.players where session_id = v_session.id and role = 'gm') then
      raise exception 'gm_opptatt' using errcode = 'P0001';
    end if;
    insert into public.players (session_id, user_id, role, name)
    values (v_session.id, auth.uid(), 'gm', 'Game master')
    returning * into v_me;
  elsif p_role = 'team' then
    if v_name is null or char_length(v_name) > 24 then
      raise exception 'ugyldig_navn' using errcode = 'P0001';
    end if;
    if p_color is null or p_color not in ('rod', 'oransje', 'gul', 'gronn', 'bla', 'lilla') then
      raise exception 'ugyldig_farge' using errcode = 'P0001';
    end if;
    if exists (select 1 from public.players
               where session_id = v_session.id and role = 'team' and color = p_color) then
      raise exception 'farge_opptatt' using errcode = 'P0001';
    end if;
    insert into public.players (session_id, user_id, role, name, color)
    values (v_session.id, auth.uid(), 'team', v_name, p_color)
    returning * into v_me;
  else
    raise exception 'ugyldig_rolle' using errcode = 'P0001';
  end if;

  update public.sessions set last_activity_at = now() where id = v_session.id;
  return v_me;
end;
$$;

-- Game master har skannet et brett.
create function public.set_board(p_session uuid, p_board text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.require_gm(p_session);
  if not exists (select 1 from public.boards where id = p_board) then
    raise exception 'ukjent_brett' using errcode = 'P0001';
  end if;
  update public.sessions
  set board_id = p_board, current_song_id = null, current_category_id = null,
      current_difficulty = null, current_started_at = null
  where id = p_session;
end;
$$;

-- Hele brettet med sanger og fasit. Bare for game master.
create function public.gm_board(p_session uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_me public.players;
  v_board_id text;
begin
  v_me := public.me_in(p_session);
  if v_me.role <> 'gm' then
    raise exception 'ikke_gm' using errcode = 'P0001';
  end if;
  select board_id into v_board_id from public.sessions where id = p_session;
  if v_board_id is null then
    return null;
  end if;
  return (
    select jsonb_build_object(
      'id', b.id,
      'name', b.name,
      'categories', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'position', c.position,
          'songs', coalesce((
            select jsonb_agg(to_jsonb(s) order by s.difficulty)
            from public.songs s where s.category_id = c.id
          ), '[]'::jsonb)
        ) order by c.position)
        from public.categories c where c.board_id = b.id
      ), '[]'::jsonb)
    )
    from public.boards b where b.id = v_board_id
  );
end;
$$;

-- Game master starter en sang. Alle buzzere låses opp.
create function public.play_song(p_session uuid, p_song uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.sessions;
  v_song public.songs;
begin
  v_session := public.require_gm(p_session);
  select s.* into v_song from public.songs s join public.categories c on c.id = s.category_id
  where s.id = p_song and c.board_id = v_session.board_id;
  if not found then
    raise exception 'sang_ikke_paa_brettet' using errcode = 'P0001';
  end if;
  update public.sessions
  set current_song_id = p_song, current_category_id = v_song.category_id,
      current_difficulty = v_song.difficulty, current_started_at = now(),
      last_buzz_player_id = null, last_buzz_at = null
  where id = p_session;
  update public.players set locked_until = 'epoch'
  where session_id = p_session and role = 'team' and locked_until > now();
end;
$$;

-- Buzzeren. Laget som trykker må vente 8 sekunder, alle andre lag 4.
-- Radene låses, så to lag som trykker samtidig blir behandlet ett om gangen:
-- den andre finner seg selv sperret og får nei.
create function public.buzz(p_session uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_me public.players;
  v_now timestamptz;
  v_own_lock constant interval := interval '8 seconds';
  v_other_lock constant interval := interval '4 seconds';
begin
  v_me := public.me_in(p_session);
  if v_me.role <> 'team' then
    raise exception 'ikke_lag' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.sessions where id = p_session and ended_at is not null) then
    raise exception 'okt_ferdig' using errcode = 'P0001';
  end if;

  perform 1 from public.players
  where session_id = p_session and role = 'team'
  order by id
  for update;

  v_now := clock_timestamp();
  select * into v_me from public.players where id = v_me.id;
  if v_me.locked_until > v_now then
    return jsonb_build_object('ok', false, 'locked_until', v_me.locked_until, 'now', v_now);
  end if;

  update public.players set locked_until = v_now + v_own_lock where id = v_me.id;
  update public.players
  set locked_until = greatest(locked_until, v_now + v_other_lock)
  where session_id = p_session and role = 'team' and id <> v_me.id;
  update public.sessions
  set last_buzz_player_id = v_me.id, last_buzz_at = v_now, last_activity_at = v_now
  where id = p_session;

  return jsonb_build_object('ok', true, 'locked_until', v_now + v_own_lock, 'now', v_now);
end;
$$;

-- Game master avslutter sangen som spilles, og gir poengene til et lag
-- (eller ingen, med p_player = null). Poengene er vanskelighetsgraden.
create function public.finish_song(p_session uuid, p_player uuid default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.sessions;
  v_song public.songs;
begin
  v_session := public.require_gm(p_session);
  if v_session.current_song_id is null then
    raise exception 'ingen_sang' using errcode = 'P0001';
  end if;
  select * into v_song from public.songs where id = v_session.current_song_id;

  if p_player is not null and not exists (
    select 1 from public.players where id = p_player and session_id = p_session and role = 'team'
  ) then
    raise exception 'ukjent_lag' using errcode = 'P0001';
  end if;

  insert into public.plays (session_id, song_id, category_id, difficulty, awarded_player_id)
  values (p_session, v_song.id, v_song.category_id, v_song.difficulty, p_player)
  on conflict (session_id, song_id) do nothing;

  if found and p_player is not null then
    update public.players set score = score + v_song.difficulty where id = p_player;
  end if;

  update public.sessions
  set current_song_id = null, current_category_id = null,
      current_difficulty = null, current_started_at = null
  where id = p_session;
end;
$$;

create function public.end_session(p_session uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.require_gm(p_session);
  update public.sessions
  set ended_at = now(), current_song_id = null, current_category_id = null, current_difficulty = null
  where id = p_session;
end;
$$;

-- Mangler en sang Spotify-spor, kan game master lime inn en lenke mens de spiller.
-- Bare sanger på brettet i egen økt.
create function public.set_song_uri(p_session uuid, p_song uuid, p_uri text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.sessions;
begin
  v_session := public.require_gm(p_session);
  if p_uri !~ '^spotify:track:[A-Za-z0-9]{22}$' then
    raise exception 'ugyldig_uri' using errcode = 'P0001';
  end if;
  update public.songs s set spotify_uri = p_uri
  from public.categories c
  where s.id = p_song and c.id = s.category_id and c.board_id = v_session.board_id;
  if not found then
    raise exception 'sang_ikke_paa_brettet' using errcode = 'P0001';
  end if;
end;
$$;

-- Hjelperne skal ikke kalles direkte fra klienten.
revoke execute on function public.me_in(uuid) from public, anon, authenticated;
revoke execute on function public.require_gm(uuid) from public, anon, authenticated;
revoke execute on function public.open_session_for(text) from public, anon, authenticated;
