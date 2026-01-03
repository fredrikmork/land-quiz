import { z } from 'zod'

export const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  capital: z.string(),
  flag_url: z.string().url(),
  map_highlight_url: z.string().url().optional(),
})

export type Country = z.infer<typeof CountrySchema>

export const QuizQuestionSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.string()).length(4),
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
