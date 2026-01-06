# Land Quiz App

En quiz-app for å lære om land, hovedsteder, flagg og geografi.

## Funksjonalitet

### Quiz-moduler

1. **Hovedstad → Land**: Vis en hovedstad, velg riktig land
2. **Land → Hovedstad**: Vis et land, velg riktig hovedstad
3. **Flagg → Land**: Vis et flagg, velg riktig land
4. **Kart → Land**: Vis et land markert på kartet, velg riktig land

### Scope-typer

- **Alle land**: Quiz med alle land i databasen
- **Kontinent**: Quiz begrenset til ett kontinent (Europa, Asia, Afrika, Nord-Amerika, Sør-Amerika, Oseania)
- **Øvingsmodus**: Quiz med kun land som ikke er mestret (krever innlogging)

## Technology Stack

- **Frontend**: React 19 with TypeScript 5.9
- **Build Tool**: Vite 7
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Validation**: Zod
- **Backend**: Supabase (database, auth, API)
- **Hosting**: Vercel

## Design System

### Theme System

Appen har 4 tema som brukeren kan velge mellom:
- **Solnedgang** (sunset): Rød/korall og gul
- **Hav** (ocean): Cyan og turkis
- **Skog** (forest): Grønn
- **Lilla** (purple): Lilla og rosa

Temaene styres via CSS-variabler (`--primary`, `--gradient-card-1`, etc.) og `data-theme` attributt på dokumentet.

### Gradienter

- **Electric Blues**: `#7b84ff → #68a5ff → #5fc6ff → #63e5fc` - Brukes i header og titler på tvers av alle temaer
- **Tema-spesifikke**: Hver tema har egne gradienter for knapper og kort (`--gradient-button`, `--gradient-card-1` til `--gradient-card-4`)

### shadcn/ui Komponenter

Følgende shadcn/ui komponenter er installert og konfigurert:
- `Tabs` - Tab-navigasjon (brukt i Statistics)
- `Card` - Kort-komponenter (brukt overalt)
- `Progress` - Fremdriftsindikatorer (quiz, statistikk)
- `Button` - Knapper (med variants: default, outline, ghost)
- `Input` / `Label` - Skjemaelementer (brukt i Auth)
- `DropdownMenu` - Nedtrekksmenyer (brukt i Header)
- `Avatar` - Profilbilder med fallback til initialer
- `Badge` - Merkelapper for statuser og antall

## Development Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

## Project Structure

```
src/
  components/
    ui/           # shadcn/ui components (Avatar, Badge, Button, Card, etc.)
    Auth.tsx      # Autentisering (innlogging/registrering)
    Header.tsx    # Toppmeny med logo, tema-velger, profil
    Menu.tsx      # Hovedmeny med kontinenter og utfordringer
    Quiz.tsx      # Quiz-interface
    QuizModeSelector.tsx  # Velg quiz-modus (hovedsteder, land, flagg, kart)
    Statistics.tsx        # Statistikk-dashboard med tabs
    MapDisplay.tsx        # SVG-kart for kart-quiz
  hooks/          # Custom hooks (useAuth, useQuiz, useTheme)
  lib/
    utils.ts      # Utility functions (cn helper for Tailwind)
    supabase.ts   # Supabase client
    quizApi.ts    # API calls for quiz data
  data/
    countries.ts  # Land-data med kontinenter
  types/          # TypeScript types and Zod schemas
tailwind.config.js  # Tailwind configuration
components.json     # shadcn/ui configuration
```

## Guidelines

### General

- Use Zod for all runtime validation and type inference
- Keep components small and focused
- Use Supabase client from `src/lib/supabase.ts`
- Environment variables prefixed with `VITE_` for client-side access

### Styling

- **Use Tailwind CSS** for all styling (no custom CSS files except MapDisplay.css)
- Use shadcn/ui components for UI elements (buttons, cards, inputs, etc.)
- Use `cn()` helper from `src/lib/utils.ts` for conditional class names
- Reference CSS variables for theme colors: `bg-primary`, `text-foreground`, `border-border`, etc.
- Use gradient classes: `bg-gradient-main`, `bg-gradient-button`, `bg-gradient-card-1` to `bg-gradient-card-4`
- Progress bars use `bg-muted/20` for subtle backgrounds and `bg-primary` for indicators

### Component Patterns

- Cards with hover effects: Use `onMouseEnter`/`onMouseLeave` to apply glow effects dynamically
- Use `h-full` on both Link wrapper and Card for equal height card grids
- Progress indicators: Use `<Progress value={percentage} className="h-1.5" />` where value is 0-100
- Buttons: Use `variant` prop (default, outline, ghost) and `size` prop (default, sm, lg, icon)

### Theme System

- Themes are switched via `data-theme` attribute on document root
- Theme hook: `const { theme, setTheme } = useTheme()`
- Available themes: 'sunset' | 'ocean' | 'forest' | 'purple'
- CSS variables automatically update when theme changes
