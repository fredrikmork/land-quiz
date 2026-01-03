# Land Quiz

En interaktiv quiz-app for å lære om land, hovedsteder, flagg og geografi.

## Funksjoner

Appen har fire quiz-moduler:

| Modus | Beskrivelse |
|-------|-------------|
| **Hovedstad → Land** | Se en hovedstad, gjett hvilket land den tilhører |
| **Land → Hovedstad** | Se et land, gjett hovedstaden |
| **Flagg → Land** | Se et flagg, gjett hvilket land det tilhører |
| **Kart → Land** | Se et land markert på kartet, gjett hvilket land det er |

### Spillfunksjoner
- 10 spørsmål per runde med 4 svaralternativer
- Umiddelbar feedback etter hvert svar
- Poengberegning og progresjonsbar
- Sluttskjerm med resultat og prosent
- Responsivt design med dark mode-støtte

## Kom i gang

### Forutsetninger
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Installasjon

```bash
# Klon repoet
git clone https://github.com/fredrikmork/land-quiz.git
cd land-quiz

# Installer avhengigheter
pnpm install

# Start utviklingsserver
pnpm dev
```

Åpne http://localhost:5173 i nettleseren.

### Bygg for produksjon

```bash
pnpm build
```

Output havner i `dist/`-mappen.

## Hosting (Vercel)

Appen er konfigurert for hosting på [Vercel](https://vercel.com/).

### Deploy til Vercel

1. **Opprett Vercel-konto** på https://vercel.com
2. **Importer prosjektet:**
   - Gå til https://vercel.com/new
   - Velg "Import Git Repository"
   - Koble til GitHub og velg `fredrikmork/land-quiz`
3. **Konfigurer prosjektet:**
   - Framework Preset: `Vite`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
4. **Legg til environment variables** (se Database-seksjonen under)
5. **Deploy!**

Vercel deployer automatisk ved hver push til `main`-branchen.

## Database (Supabase)

Appen bruker [Supabase](https://supabase.com/) som backend. Foreløpig bruker appen hardkodede data for land, men Supabase er satt opp for fremtidig bruk (highscores, brukerdata, etc.).

### Sett opp Supabase

1. **Opprett Supabase-prosjekt:**
   - Gå til https://supabase.com
   - Klikk "Start your project"
   - Opprett nytt prosjekt og velg region nær deg

2. **Finn API-nøkler:**
   - Gå til Project Settings → API
   - Kopier `Project URL` og `anon/public` key

3. **Konfigurer miljøvariabler:**

   **Lokalt:** Opprett `.env`-fil i prosjektmappen:
   ```env
   VITE_SUPABASE_URL=https://ditt-prosjekt.supabase.co
   VITE_SUPABASE_ANON_KEY=din-anon-key
   ```

   **På Vercel:** Gå til prosjektinnstillinger → Environment Variables og legg til:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Database-skjema (fremtidig)

For å legge til highscores eller brukerdata, kan du opprette tabeller i Supabase SQL Editor:

```sql
-- Eksempel: Highscores-tabell
create table highscores (
  id uuid default gen_random_uuid() primary key,
  player_name text not null,
  score int not null,
  quiz_mode text not null,
  created_at timestamp with time zone default now()
);

-- Aktiver Row Level Security
alter table highscores enable row level security;

-- Tillat alle å lese highscores
create policy "Highscores are viewable by everyone"
  on highscores for select
  using (true);

-- Tillat alle å legge til highscores
create policy "Anyone can insert highscores"
  on highscores for insert
  with check (true);
```

## Teknologistack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite
- **Pakkebehandler:** pnpm
- **Validering:** Zod
- **Kart:** react-simple-maps
- **Backend:** Supabase
- **Hosting:** Vercel

## Prosjektstruktur

```
land-quiz/
├── src/
│   ├── components/     # React-komponenter
│   │   ├── Quiz.tsx
│   │   ├── Quiz.css
│   │   ├── MapDisplay.tsx
│   │   └── MapDisplay.css
│   ├── data/
│   │   └── countries.ts  # Land, hovedsteder, flagg
│   ├── hooks/
│   │   └── useQuiz.ts    # Quiz-logikk
│   ├── lib/
│   │   └── supabase.ts   # Supabase-klient
│   ├── types/
│   │   └── index.ts      # TypeScript/Zod-typer
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Kommandoer

| Kommando | Beskrivelse |
|----------|-------------|
| `pnpm install` | Installer avhengigheter |
| `pnpm dev` | Start utviklingsserver |
| `pnpm build` | Bygg for produksjon |
| `pnpm preview` | Forhåndsvis produksjonsbygg |

## Lisens

MIT
