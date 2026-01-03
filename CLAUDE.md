# Land Quiz App

En quiz-app for å lære om land, hovedsteder, flagg og geografi.

## Funksjonalitet

### Quiz-moduler

1. **Hovedstad → Land**: Vis en hovedstad, velg riktig land
2. **Land → Hovedstad**: Vis et land, velg riktig hovedstad
3. **Flagg → Land**: Vis et flagg, velg riktig land
4. **Kart → Land**: Vis et land markert på kartet, velg riktig land

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Validation**: Zod
- **Backend**: Supabase (database, auth, API)
- **Hosting**: Vercel

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
  components/     # React components
  hooks/          # Custom hooks
  lib/            # Utilities and Supabase client
  types/          # TypeScript types and Zod schemas
  pages/          # Page components
```

## Guidelines

- Use Zod for all runtime validation and type inference
- Keep components small and focused
- Use Supabase client from `src/lib/supabase.ts`
- Environment variables prefixed with `VITE_` for client-side access
