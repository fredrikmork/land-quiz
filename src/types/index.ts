import { z } from 'zod'

// Database types (matches Supabase schema)
export const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  capital: z.string(),
  flag: z.string(),
  code: z.string(),
  created_at: z.string().optional(),
})

export type Country = z.infer<typeof CountrySchema>

export const HighscoreSchema = z.object({
  id: z.string().uuid(),
  player_name: z.string(),
  score: z.number().min(0),
  total_questions: z.number().default(10),
  quiz_mode: z.enum(['capital-to-country', 'country-to-capital', 'flag-to-country', 'map-to-country']),
  percentage: z.number().optional(),
  created_at: z.string(),
})

export type Highscore = z.infer<typeof HighscoreSchema>

export const NewHighscoreSchema = HighscoreSchema.omit({
  id: true,
  percentage: true,
  created_at: true,
})

export type NewHighscore = z.infer<typeof NewHighscoreSchema>

// Quiz types
export const QuizQuestionSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.string()).length(4),
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
