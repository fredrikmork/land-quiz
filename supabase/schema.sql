-- Land Quiz Database Schema
-- Kjør dette i Supabase SQL Editor

-- ============================================
-- COUNTRIES TABLE
-- ============================================
create table if not exists countries (
  id serial primary key,
  name text not null unique,
  capital text not null,
  flag text not null,
  code text not null unique,
  created_at timestamp with time zone default now()
);

-- ============================================
-- HIGHSCORES TABLE
-- ============================================
create table if not exists highscores (
  id uuid default gen_random_uuid() primary key,
  player_name text not null,
  score int not null check (score >= 0),
  total_questions int not null default 10,
  quiz_mode text not null check (quiz_mode in ('capital-to-country', 'country-to-capital', 'flag-to-country', 'map-to-country')),
  percentage int generated always as (round((score::numeric / total_questions) * 100)) stored,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
alter table countries enable row level security;
alter table highscores enable row level security;

-- Countries: Everyone can read
create policy "Countries are viewable by everyone"
  on countries for select
  using (true);

-- Highscores: Everyone can read
create policy "Highscores are viewable by everyone"
  on highscores for select
  using (true);

-- Highscores: Everyone can insert
create policy "Anyone can insert highscores"
  on highscores for insert
  with check (true);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_highscores_score on highscores(score desc);
create index if not exists idx_highscores_quiz_mode on highscores(quiz_mode);
create index if not exists idx_highscores_created_at on highscores(created_at desc);
create index if not exists idx_countries_code on countries(code);

-- ============================================
-- INSERT COUNTRIES DATA
-- ============================================
insert into countries (name, capital, flag, code) values
  ('Norge', 'Oslo', '🇳🇴', 'NO'),
  ('Sverige', 'Stockholm', '🇸🇪', 'SE'),
  ('Danmark', 'København', '🇩🇰', 'DK'),
  ('Finland', 'Helsinki', '🇫🇮', 'FI'),
  ('Island', 'Reykjavik', '🇮🇸', 'IS'),
  ('Tyskland', 'Berlin', '🇩🇪', 'DE'),
  ('Frankrike', 'Paris', '🇫🇷', 'FR'),
  ('Spania', 'Madrid', '🇪🇸', 'ES'),
  ('Italia', 'Roma', '🇮🇹', 'IT'),
  ('Portugal', 'Lisboa', '🇵🇹', 'PT'),
  ('Storbritannia', 'London', '🇬🇧', 'GB'),
  ('Irland', 'Dublin', '🇮🇪', 'IE'),
  ('Nederland', 'Amsterdam', '🇳🇱', 'NL'),
  ('Belgia', 'Brussel', '🇧🇪', 'BE'),
  ('Sveits', 'Bern', '🇨🇭', 'CH'),
  ('Østerrike', 'Wien', '🇦🇹', 'AT'),
  ('Polen', 'Warszawa', '🇵🇱', 'PL'),
  ('Tsjekkia', 'Praha', '🇨🇿', 'CZ'),
  ('Ungarn', 'Budapest', '🇭🇺', 'HU'),
  ('Romania', 'Bucuresti', '🇷🇴', 'RO'),
  ('Bulgaria', 'Sofia', '🇧🇬', 'BG'),
  ('Hellas', 'Athen', '🇬🇷', 'GR'),
  ('Tyrkia', 'Ankara', '🇹🇷', 'TR'),
  ('Russland', 'Moskva', '🇷🇺', 'RU'),
  ('Ukraina', 'Kyiv', '🇺🇦', 'UA'),
  ('USA', 'Washington D.C.', '🇺🇸', 'US'),
  ('Canada', 'Ottawa', '🇨🇦', 'CA'),
  ('Mexico', 'Mexico City', '🇲🇽', 'MX'),
  ('Brasil', 'Brasília', '🇧🇷', 'BR'),
  ('Argentina', 'Buenos Aires', '🇦🇷', 'AR'),
  ('Chile', 'Santiago', '🇨🇱', 'CL'),
  ('Colombia', 'Bogotá', '🇨🇴', 'CO'),
  ('Peru', 'Lima', '🇵🇪', 'PE'),
  ('Japan', 'Tokyo', '🇯🇵', 'JP'),
  ('Kina', 'Beijing', '🇨🇳', 'CN'),
  ('Sør-Korea', 'Seoul', '🇰🇷', 'KR'),
  ('India', 'New Delhi', '🇮🇳', 'IN'),
  ('Indonesia', 'Jakarta', '🇮🇩', 'ID'),
  ('Thailand', 'Bangkok', '🇹🇭', 'TH'),
  ('Vietnam', 'Hanoi', '🇻🇳', 'VN'),
  ('Australia', 'Canberra', '🇦🇺', 'AU'),
  ('New Zealand', 'Wellington', '🇳🇿', 'NZ'),
  ('Egypt', 'Kairo', '🇪🇬', 'EG'),
  ('Sør-Afrika', 'Pretoria', '🇿🇦', 'ZA'),
  ('Nigeria', 'Abuja', '🇳🇬', 'NG'),
  ('Kenya', 'Nairobi', '🇰🇪', 'KE'),
  ('Marokko', 'Rabat', '🇲🇦', 'MA'),
  ('Saudi-Arabia', 'Riyadh', '🇸🇦', 'SA'),
  ('Israel', 'Jerusalem', '🇮🇱', 'IL'),
  ('Iran', 'Teheran', '🇮🇷', 'IR')
on conflict (code) do nothing;
