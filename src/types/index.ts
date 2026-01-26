import { z } from 'zod'

// Database types (matches Supabase schema)
// Flagg-URL genereres fra landkode: https://flagcdn.com/w{size}/{code}.png
export const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  capital: z.string(),
  code: z.string(),
  continent: z.string(),
  created_at: z.string().optional(),
})

export type Country = z.infer<typeof CountrySchema>

// Quiz types
export const QuizQuestionSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.string()).length(4),
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
