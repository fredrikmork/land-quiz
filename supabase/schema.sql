-- ============================================
-- LAND QUIZ DATABASE SCHEMA
-- ============================================
-- Kjør dette i Supabase SQL Editor
-- Gå til: SQL Editor -> New query -> Lim inn -> Run

-- ============================================
-- 1. PROFILES (bruker Supabase Auth)
-- ============================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Trigger for å oppdatere updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

-- Automatisk opprett profil når bruker registrerer seg
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- 2. COUNTRIES (referansedata)
-- ============================================
create table if not exists countries (
  id serial primary key,
  name text not null unique,
  capital text not null,
  flag text not null,
  code text not null unique,
  continent text not null check (continent in ('Europa', 'Asia', 'Afrika', 'Nord-Amerika', 'Sor-Amerika', 'Oseania')),
  created_at timestamp with time zone default now()
);

create index if not exists idx_countries_code on countries(code);
create index if not exists idx_countries_continent on countries(continent);

-- ============================================
-- 3. QUIZ SESSIONS (hver quiz-runde)
-- ============================================
create table if not exists quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  quiz_mode text not null check (quiz_mode in ('capital-to-country', 'country-to-capital', 'flag-to-country', 'map-to-country')),
  total_questions int not null default 10,
  correct_answers int not null default 0,
  completed boolean not null default false,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

create index if not exists idx_quiz_sessions_user_id on quiz_sessions(user_id);
create index if not exists idx_quiz_sessions_quiz_mode on quiz_sessions(quiz_mode);
create index if not exists idx_quiz_sessions_completed_at on quiz_sessions(completed_at desc);

-- ============================================
-- 4. QUIZ ATTEMPTS (hvert svar)
-- ============================================
create table if not exists quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  session_id uuid references quiz_sessions(id) on delete cascade,
  country_code text not null,
  quiz_mode text not null check (quiz_mode in ('capital-to-country', 'country-to-capital', 'flag-to-country', 'map-to-country')),
  is_correct boolean not null,
  answered_at timestamp with time zone default now()
);

create index if not exists idx_quiz_attempts_user_id on quiz_attempts(user_id);
create index if not exists idx_quiz_attempts_country_code on quiz_attempts(country_code);
create index if not exists idx_quiz_attempts_quiz_mode on quiz_attempts(quiz_mode);
create index if not exists idx_quiz_attempts_user_country on quiz_attempts(user_id, country_code);

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================

-- Profiles
alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Countries
alter table countries enable row level security;

create policy "Countries are viewable by everyone"
  on countries for select using (true);

-- Quiz Sessions
alter table quiz_sessions enable row level security;

create policy "Users can view own sessions"
  on quiz_sessions for select using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on quiz_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on quiz_sessions for update using (auth.uid() = user_id);

-- Quiz Attempts
alter table quiz_attempts enable row level security;

create policy "Users can view own attempts"
  on quiz_attempts for select using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on quiz_attempts for insert with check (auth.uid() = user_id);

-- ============================================
-- 6. VIEWS FOR STATISTIKK
-- ============================================

-- Statistikk per land for en bruker
create or replace view user_country_stats as
select
  user_id,
  country_code,
  quiz_mode,
  count(*) as total_attempts,
  sum(case when is_correct then 1 else 0 end) as correct_count,
  round(100.0 * sum(case when is_correct then 1 else 0 end) / count(*), 1) as accuracy_percent
from quiz_attempts
group by user_id, country_code, quiz_mode;

-- Statistikk per kontinent for en bruker
create or replace view user_continent_stats as
select
  qa.user_id,
  c.continent,
  count(*) as total_attempts,
  sum(case when qa.is_correct then 1 else 0 end) as correct_count,
  round(100.0 * sum(case when qa.is_correct then 1 else 0 end) / count(*), 1) as accuracy_percent
from quiz_attempts qa
join countries c on c.code = qa.country_code
group by qa.user_id, c.continent;

-- Overordnet statistikk for en bruker
create or replace view user_overall_stats as
select
  user_id,
  count(*) as total_attempts,
  sum(case when is_correct then 1 else 0 end) as total_correct,
  round(100.0 * sum(case when is_correct then 1 else 0 end) / count(*), 1) as overall_accuracy,
  count(distinct country_code) as countries_attempted,
  count(distinct case when is_correct then country_code end) as countries_correct
from quiz_attempts
group by user_id;

-- Land som er "mestret" (riktig i alle 4 moduser minst én gang)
create or replace view user_mastered_countries as
select
  user_id,
  country_code,
  count(distinct quiz_mode) as modes_mastered
from quiz_attempts
where is_correct = true
group by user_id, country_code
having count(distinct quiz_mode) = 4;

-- Beste og verste land per bruker
create or replace view user_best_worst_countries as
with country_accuracy as (
  select
    user_id,
    country_code,
    count(*) as attempts,
    sum(case when is_correct then 1 else 0 end) as correct,
    round(100.0 * sum(case when is_correct then 1 else 0 end) / count(*), 1) as accuracy
  from quiz_attempts
  group by user_id, country_code
  having count(*) >= 3  -- Minimum 3 forsøk for å være relevant
)
select
  user_id,
  country_code,
  attempts,
  correct,
  accuracy,
  case
    when accuracy >= 80 then 'best'
    when accuracy <= 40 then 'worst'
    else 'average'
  end as category
from country_accuracy;

-- Historisk score (totalt antall riktige gjennom tidene)
create or replace view user_historical_score as
select
  user_id,
  sum(case when is_correct then 1 else 0 end) as lifetime_correct,
  count(*) as lifetime_attempts,
  count(distinct date_trunc('day', answered_at)) as days_played,
  min(answered_at) as first_played,
  max(answered_at) as last_played
from quiz_attempts
group by user_id;

-- Leaderboard
create or replace view leaderboard as
select
  p.id as user_id,
  p.display_name,
  p.username,
  coalesce(s.lifetime_correct, 0) as lifetime_correct,
  coalesce(s.lifetime_attempts, 0) as lifetime_attempts,
  coalesce(m.mastered_count, 0) as countries_mastered
from profiles p
left join user_historical_score s on s.user_id = p.id
left join (
  select user_id, count(*) as mastered_count
  from user_mastered_countries
  group by user_id
) m on m.user_id = p.id
order by lifetime_correct desc;

-- ============================================
-- 7. FUNCTIONS FOR APP
-- ============================================

-- Hent detaljert statistikk for en bruker
create or replace function get_user_statistics(p_user_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'overall', (
      select row_to_json(t) from (
        select * from user_overall_stats where user_id = p_user_id
      ) t
    ),
    'historical', (
      select row_to_json(t) from (
        select * from user_historical_score where user_id = p_user_id
      ) t
    ),
    'continents', (
      select json_agg(row_to_json(t)) from (
        select * from user_continent_stats where user_id = p_user_id order by accuracy_percent desc
      ) t
    ),
    'best_countries', (
      select json_agg(row_to_json(t)) from (
        select bw.*, c.name as country_name, c.flag
        from user_best_worst_countries bw
        join countries c on c.code = bw.country_code
        where bw.user_id = p_user_id and bw.category = 'best'
        order by bw.accuracy desc
        limit 5
      ) t
    ),
    'worst_countries', (
      select json_agg(row_to_json(t)) from (
        select bw.*, c.name as country_name, c.flag
        from user_best_worst_countries bw
        join countries c on c.code = bw.country_code
        where bw.user_id = p_user_id and bw.category = 'worst'
        order by bw.accuracy asc
        limit 5
      ) t
    ),
    'mastered_countries', (
      select json_agg(row_to_json(t)) from (
        select mc.*, c.name as country_name, c.flag
        from user_mastered_countries mc
        join countries c on c.code = mc.country_code
        where mc.user_id = p_user_id
      ) t
    ),
    'country_progress', (
      select json_agg(row_to_json(t)) from (
        select
          c.code,
          c.name,
          c.flag,
          c.continent,
          coalesce(modes.modes_correct, 0) as modes_correct,
          case when coalesce(modes.modes_correct, 0) = 4 then true else false end as is_mastered
        from countries c
        left join (
          select country_code, count(distinct quiz_mode) as modes_correct
          from quiz_attempts
          where user_id = p_user_id and is_correct = true
          group by country_code
        ) modes on modes.country_code = c.code
        order by c.continent, c.name
      ) t
    )
  ) into result;

  return result;
end;
$$ language plpgsql security definer;

-- ============================================
-- 8. INSERT COUNTRIES DATA
-- ============================================
-- Europa
insert into countries (name, capital, flag, code, continent) values
('Albania', 'Tirana', '🇦🇱', 'AL', 'Europa'),
('Andorra', 'Andorra la Vella', '🇦🇩', 'AD', 'Europa'),
('Belgia', 'Brussel', '🇧🇪', 'BE', 'Europa'),
('Bosnia-Hercegovina', 'Sarajevo', '🇧🇦', 'BA', 'Europa'),
('Bulgaria', 'Sofia', '🇧🇬', 'BG', 'Europa'),
('Danmark', 'København', '🇩🇰', 'DK', 'Europa'),
('Estland', 'Tallinn', '🇪🇪', 'EE', 'Europa'),
('Finland', 'Helsinki', '🇫🇮', 'FI', 'Europa'),
('Frankrike', 'Paris', '🇫🇷', 'FR', 'Europa'),
('Hellas', 'Athen', '🇬🇷', 'GR', 'Europa'),
('Hviterussland', 'Minsk', '🇧🇾', 'BY', 'Europa'),
('Irland', 'Dublin', '🇮🇪', 'IE', 'Europa'),
('Island', 'Reykjavik', '🇮🇸', 'IS', 'Europa'),
('Italia', 'Roma', '🇮🇹', 'IT', 'Europa'),
('Kosovo', 'Pristina', '🇽🇰', 'XK', 'Europa'),
('Kroatia', 'Zagreb', '🇭🇷', 'HR', 'Europa'),
('Kypros', 'Nikosia', '🇨🇾', 'CY', 'Europa'),
('Latvia', 'Riga', '🇱🇻', 'LV', 'Europa'),
('Liechtenstein', 'Vaduz', '🇱🇮', 'LI', 'Europa'),
('Litauen', 'Vilnius', '🇱🇹', 'LT', 'Europa'),
('Luxembourg', 'Luxembourg', '🇱🇺', 'LU', 'Europa'),
('Malta', 'Valletta', '🇲🇹', 'MT', 'Europa'),
('Moldova', 'Chisinau', '🇲🇩', 'MD', 'Europa'),
('Monaco', 'Monaco', '🇲🇨', 'MC', 'Europa'),
('Montenegro', 'Podgorica', '🇲🇪', 'ME', 'Europa'),
('Nederland', 'Amsterdam', '🇳🇱', 'NL', 'Europa'),
('Nord-Makedonia', 'Skopje', '🇲🇰', 'MK', 'Europa'),
('Norge', 'Oslo', '🇳🇴', 'NO', 'Europa'),
('Polen', 'Warszawa', '🇵🇱', 'PL', 'Europa'),
('Portugal', 'Lisboa', '🇵🇹', 'PT', 'Europa'),
('Romania', 'Bucuresti', '🇷🇴', 'RO', 'Europa'),
('Russland', 'Moskva', '🇷🇺', 'RU', 'Europa'),
('San Marino', 'San Marino', '🇸🇲', 'SM', 'Europa'),
('Serbia', 'Beograd', '🇷🇸', 'RS', 'Europa'),
('Slovakia', 'Bratislava', '🇸🇰', 'SK', 'Europa'),
('Slovenia', 'Ljubljana', '🇸🇮', 'SI', 'Europa'),
('Spania', 'Madrid', '🇪🇸', 'ES', 'Europa'),
('Storbritannia', 'London', '🇬🇧', 'GB', 'Europa'),
('Sverige', 'Stockholm', '🇸🇪', 'SE', 'Europa'),
('Sveits', 'Bern', '🇨🇭', 'CH', 'Europa'),
('Tsjekkia', 'Praha', '🇨🇿', 'CZ', 'Europa'),
('Tyskland', 'Berlin', '🇩🇪', 'DE', 'Europa'),
('Ukraina', 'Kyiv', '🇺🇦', 'UA', 'Europa'),
('Ungarn', 'Budapest', '🇭🇺', 'HU', 'Europa'),
('Vatikanstaten', 'Vatikanstaten', '🇻🇦', 'VA', 'Europa'),
('Østerrike', 'Wien', '🇦🇹', 'AT', 'Europa')
on conflict (code) do nothing;

-- Asia
insert into countries (name, capital, flag, code, continent) values
('Afghanistan', 'Kabul', '🇦🇫', 'AF', 'Asia'),
('Armenia', 'Jerevan', '🇦🇲', 'AM', 'Asia'),
('Aserbajdsjan', 'Baku', '🇦🇿', 'AZ', 'Asia'),
('Bahrain', 'Manama', '🇧🇭', 'BH', 'Asia'),
('Bangladesh', 'Dhaka', '🇧🇩', 'BD', 'Asia'),
('Bhutan', 'Thimphu', '🇧🇹', 'BT', 'Asia'),
('Brunei', 'Bandar Seri Begawan', '🇧🇳', 'BN', 'Asia'),
('Filippinene', 'Manila', '🇵🇭', 'PH', 'Asia'),
('De forente arabiske emirater', 'Abu Dhabi', '🇦🇪', 'AE', 'Asia'),
('Georgia', 'Tbilisi', '🇬🇪', 'GE', 'Asia'),
('India', 'New Delhi', '🇮🇳', 'IN', 'Asia'),
('Indonesia', 'Jakarta', '🇮🇩', 'ID', 'Asia'),
('Irak', 'Bagdad', '🇮🇶', 'IQ', 'Asia'),
('Iran', 'Teheran', '🇮🇷', 'IR', 'Asia'),
('Israel', 'Jerusalem', '🇮🇱', 'IL', 'Asia'),
('Japan', 'Tokyo', '🇯🇵', 'JP', 'Asia'),
('Jemen', 'Sanaa', '🇾🇪', 'YE', 'Asia'),
('Jordan', 'Amman', '🇯🇴', 'JO', 'Asia'),
('Kambodsja', 'Phnom Penh', '🇰🇭', 'KH', 'Asia'),
('Kasakhstan', 'Astana', '🇰🇿', 'KZ', 'Asia'),
('Kina', 'Beijing', '🇨🇳', 'CN', 'Asia'),
('Kirgisistan', 'Bisjkek', '🇰🇬', 'KG', 'Asia'),
('Kuwait', 'Kuwait by', '🇰🇼', 'KW', 'Asia'),
('Laos', 'Vientiane', '🇱🇦', 'LA', 'Asia'),
('Libanon', 'Beirut', '🇱🇧', 'LB', 'Asia'),
('Malaysia', 'Kuala Lumpur', '🇲🇾', 'MY', 'Asia'),
('Maldivene', 'Malé', '🇲🇻', 'MV', 'Asia'),
('Mongolia', 'Ulaanbaatar', '🇲🇳', 'MN', 'Asia'),
('Myanmar', 'Naypyidaw', '🇲🇲', 'MM', 'Asia'),
('Nepal', 'Katmandu', '🇳🇵', 'NP', 'Asia'),
('Nord-Korea', 'Pyongyang', '🇰🇵', 'KP', 'Asia'),
('Oman', 'Muskat', '🇴🇲', 'OM', 'Asia'),
('Pakistan', 'Islamabad', '🇵🇰', 'PK', 'Asia'),
('Palestina', 'Ramallah', '🇵🇸', 'PS', 'Asia'),
('Qatar', 'Doha', '🇶🇦', 'QA', 'Asia'),
('Saudi-Arabia', 'Riyadh', '🇸🇦', 'SA', 'Asia'),
('Singapore', 'Singapore', '🇸🇬', 'SG', 'Asia'),
('Sri Lanka', 'Colombo', '🇱🇰', 'LK', 'Asia'),
('Syria', 'Damaskus', '🇸🇾', 'SY', 'Asia'),
('Sør-Korea', 'Seoul', '🇰🇷', 'KR', 'Asia'),
('Tadsjikistan', 'Dusjanbe', '🇹🇯', 'TJ', 'Asia'),
('Taiwan', 'Taipei', '🇹🇼', 'TW', 'Asia'),
('Thailand', 'Bangkok', '🇹🇭', 'TH', 'Asia'),
('Timor-Leste', 'Dili', '🇹🇱', 'TL', 'Asia'),
('Turkmenistan', 'Asjkhabad', '🇹🇲', 'TM', 'Asia'),
('Tyrkia', 'Ankara', '🇹🇷', 'TR', 'Asia'),
('Usbekistan', 'Tasjkent', '🇺🇿', 'UZ', 'Asia'),
('Vietnam', 'Hanoi', '🇻🇳', 'VN', 'Asia')
on conflict (code) do nothing;

-- Afrika
insert into countries (name, capital, flag, code, continent) values
('Algeria', 'Alger', '🇩🇿', 'DZ', 'Afrika'),
('Angola', 'Luanda', '🇦🇴', 'AO', 'Afrika'),
('Benin', 'Porto-Novo', '🇧🇯', 'BJ', 'Afrika'),
('Botswana', 'Gaborone', '🇧🇼', 'BW', 'Afrika'),
('Burkina Faso', 'Ouagadougou', '🇧🇫', 'BF', 'Afrika'),
('Burundi', 'Gitega', '🇧🇮', 'BI', 'Afrika'),
('Kamerun', 'Yaoundé', '🇨🇲', 'CM', 'Afrika'),
('Kapp Verde', 'Praia', '🇨🇻', 'CV', 'Afrika'),
('Den sentralafrikanske republikk', 'Bangui', '🇨🇫', 'CF', 'Afrika'),
('Tsjad', 'N''Djamena', '🇹🇩', 'TD', 'Afrika'),
('Komorene', 'Moroni', '🇰🇲', 'KM', 'Afrika'),
('Kongo-Brazzaville', 'Brazzaville', '🇨🇬', 'CG', 'Afrika'),
('Kongo-Kinshasa', 'Kinshasa', '🇨🇩', 'CD', 'Afrika'),
('Elfenbenskysten', 'Yamoussoukro', '🇨🇮', 'CI', 'Afrika'),
('Djibouti', 'Djibouti', '🇩🇯', 'DJ', 'Afrika'),
('Egypt', 'Kairo', '🇪🇬', 'EG', 'Afrika'),
('Ekvatorial-Guinea', 'Malabo', '🇬🇶', 'GQ', 'Afrika'),
('Eritrea', 'Asmara', '🇪🇷', 'ER', 'Afrika'),
('Eswatini', 'Mbabane', '🇸🇿', 'SZ', 'Afrika'),
('Etiopia', 'Addis Abeba', '🇪🇹', 'ET', 'Afrika'),
('Gabon', 'Libreville', '🇬🇦', 'GA', 'Afrika'),
('Gambia', 'Banjul', '🇬🇲', 'GM', 'Afrika'),
('Ghana', 'Accra', '🇬🇭', 'GH', 'Afrika'),
('Guinea', 'Conakry', '🇬🇳', 'GN', 'Afrika'),
('Guinea-Bissau', 'Bissau', '🇬🇼', 'GW', 'Afrika'),
('Kenya', 'Nairobi', '🇰🇪', 'KE', 'Afrika'),
('Lesotho', 'Maseru', '🇱🇸', 'LS', 'Afrika'),
('Liberia', 'Monrovia', '🇱🇷', 'LR', 'Afrika'),
('Libya', 'Tripoli', '🇱🇾', 'LY', 'Afrika'),
('Madagaskar', 'Antananarivo', '🇲🇬', 'MG', 'Afrika'),
('Malawi', 'Lilongwe', '🇲🇼', 'MW', 'Afrika'),
('Mali', 'Bamako', '🇲🇱', 'ML', 'Afrika'),
('Mauritania', 'Nouakchott', '🇲🇷', 'MR', 'Afrika'),
('Mauritius', 'Port Louis', '🇲🇺', 'MU', 'Afrika'),
('Marokko', 'Rabat', '🇲🇦', 'MA', 'Afrika'),
('Mosambik', 'Maputo', '🇲🇿', 'MZ', 'Afrika'),
('Namibia', 'Windhoek', '🇳🇦', 'NA', 'Afrika'),
('Niger', 'Niamey', '🇳🇪', 'NE', 'Afrika'),
('Nigeria', 'Abuja', '🇳🇬', 'NG', 'Afrika'),
('Rwanda', 'Kigali', '🇷🇼', 'RW', 'Afrika'),
('São Tomé og Príncipe', 'São Tomé', '🇸🇹', 'ST', 'Afrika'),
('Senegal', 'Dakar', '🇸🇳', 'SN', 'Afrika'),
('Seychellene', 'Victoria', '🇸🇨', 'SC', 'Afrika'),
('Sierra Leone', 'Freetown', '🇸🇱', 'SL', 'Afrika'),
('Somalia', 'Mogadishu', '🇸🇴', 'SO', 'Afrika'),
('Sør-Afrika', 'Pretoria', '🇿🇦', 'ZA', 'Afrika'),
('Sør-Sudan', 'Juba', '🇸🇸', 'SS', 'Afrika'),
('Sudan', 'Khartoum', '🇸🇩', 'SD', 'Afrika'),
('Tanzania', 'Dodoma', '🇹🇿', 'TZ', 'Afrika'),
('Togo', 'Lomé', '🇹🇬', 'TG', 'Afrika'),
('Tunisia', 'Tunis', '🇹🇳', 'TN', 'Afrika'),
('Uganda', 'Kampala', '🇺🇬', 'UG', 'Afrika'),
('Zambia', 'Lusaka', '🇿🇲', 'ZM', 'Afrika'),
('Zimbabwe', 'Harare', '🇿🇼', 'ZW', 'Afrika')
on conflict (code) do nothing;

-- Nord-Amerika
insert into countries (name, capital, flag, code, continent) values
('Antigua og Barbuda', 'Saint John''s', '🇦🇬', 'AG', 'Nord-Amerika'),
('Bahamas', 'Nassau', '🇧🇸', 'BS', 'Nord-Amerika'),
('Barbados', 'Bridgetown', '🇧🇧', 'BB', 'Nord-Amerika'),
('Belize', 'Belmopan', '🇧🇿', 'BZ', 'Nord-Amerika'),
('Canada', 'Ottawa', '🇨🇦', 'CA', 'Nord-Amerika'),
('Costa Rica', 'San José', '🇨🇷', 'CR', 'Nord-Amerika'),
('Cuba', 'Havana', '🇨🇺', 'CU', 'Nord-Amerika'),
('Dominica', 'Roseau', '🇩🇲', 'DM', 'Nord-Amerika'),
('Den dominikanske republikk', 'Santo Domingo', '🇩🇴', 'DO', 'Nord-Amerika'),
('El Salvador', 'San Salvador', '🇸🇻', 'SV', 'Nord-Amerika'),
('Grenada', 'Saint George''s', '🇬🇩', 'GD', 'Nord-Amerika'),
('Guatemala', 'Guatemala by', '🇬🇹', 'GT', 'Nord-Amerika'),
('Haiti', 'Port-au-Prince', '🇭🇹', 'HT', 'Nord-Amerika'),
('Honduras', 'Tegucigalpa', '🇭🇳', 'HN', 'Nord-Amerika'),
('Jamaica', 'Kingston', '🇯🇲', 'JM', 'Nord-Amerika'),
('Mexico', 'Mexico by', '🇲🇽', 'MX', 'Nord-Amerika'),
('Nicaragua', 'Managua', '🇳🇮', 'NI', 'Nord-Amerika'),
('Panama', 'Panama by', '🇵🇦', 'PA', 'Nord-Amerika'),
('Saint Kitts og Nevis', 'Basseterre', '🇰🇳', 'KN', 'Nord-Amerika'),
('Saint Lucia', 'Castries', '🇱🇨', 'LC', 'Nord-Amerika'),
('Saint Vincent og Grenadinene', 'Kingstown', '🇻🇨', 'VC', 'Nord-Amerika'),
('Trinidad og Tobago', 'Port of Spain', '🇹🇹', 'TT', 'Nord-Amerika'),
('USA', 'Washington D.C.', '🇺🇸', 'US', 'Nord-Amerika')
on conflict (code) do nothing;

-- Sør-Amerika
insert into countries (name, capital, flag, code, continent) values
('Argentina', 'Buenos Aires', '🇦🇷', 'AR', 'Sor-Amerika'),
('Bolivia', 'Sucre', '🇧🇴', 'BO', 'Sor-Amerika'),
('Brasil', 'Brasília', '🇧🇷', 'BR', 'Sor-Amerika'),
('Chile', 'Santiago', '🇨🇱', 'CL', 'Sor-Amerika'),
('Colombia', 'Bogotá', '🇨🇴', 'CO', 'Sor-Amerika'),
('Ecuador', 'Quito', '🇪🇨', 'EC', 'Sor-Amerika'),
('Guyana', 'Georgetown', '🇬🇾', 'GY', 'Sor-Amerika'),
('Paraguay', 'Asunción', '🇵🇾', 'PY', 'Sor-Amerika'),
('Peru', 'Lima', '🇵🇪', 'PE', 'Sor-Amerika'),
('Surinam', 'Paramaribo', '🇸🇷', 'SR', 'Sor-Amerika'),
('Uruguay', 'Montevideo', '🇺🇾', 'UY', 'Sor-Amerika'),
('Venezuela', 'Caracas', '🇻🇪', 'VE', 'Sor-Amerika')
on conflict (code) do nothing;

-- Oseania
insert into countries (name, capital, flag, code, continent) values
('Australia', 'Canberra', '🇦🇺', 'AU', 'Oseania'),
('Fiji', 'Suva', '🇫🇯', 'FJ', 'Oseania'),
('Kiribati', 'Tarawa', '🇰🇮', 'KI', 'Oseania'),
('Marshalløyene', 'Majuro', '🇲🇭', 'MH', 'Oseania'),
('Mikronesia', 'Palikir', '🇫🇲', 'FM', 'Oseania'),
('Nauru', 'Yaren', '🇳🇷', 'NR', 'Oseania'),
('New Zealand', 'Wellington', '🇳🇿', 'NZ', 'Oseania'),
('Palau', 'Ngerulmud', '🇵🇼', 'PW', 'Oseania'),
('Papua Ny-Guinea', 'Port Moresby', '🇵🇬', 'PG', 'Oseania'),
('Samoa', 'Apia', '🇼🇸', 'WS', 'Oseania'),
('Salomonøyene', 'Honiara', '🇸🇧', 'SB', 'Oseania'),
('Tonga', 'Nukualofa', '🇹🇴', 'TO', 'Oseania'),
('Tuvalu', 'Funafuti', '🇹🇻', 'TV', 'Oseania'),
('Vanuatu', 'Port Vila', '🇻🇺', 'VU', 'Oseania')
on conflict (code) do nothing;
