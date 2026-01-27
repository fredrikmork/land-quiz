import { supabase, isSupabaseConfigured } from './supabase'
import type { QuizMode } from '../hooks/useQuiz'

export interface QuizSession {
  id: string
  user_id: string
  quiz_mode: QuizMode
  total_questions: number
  correct_answers: number
  completed: boolean
  started_at: string
  completed_at: string | null
}

export interface QuizAttempt {
  id: string
  user_id: string
  session_id: string | null
  country_code: string
  quiz_mode: QuizMode
  is_correct: boolean
  answered_at: string
}

export async function createQuizSession(userId: string, quizMode: QuizMode, totalQuestions: number = 10) {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: userId,
      quiz_mode: quizMode,
      total_questions: totalQuestions,
    })
    .select()
    .single()

  if (error) {
    // Suppress logging in production to avoid Lighthouse warnings
    if (import.meta.env.DEV) {
      console.error('Error creating quiz session:', error.message, error.details)
    }
    return null
  }

  return data as QuizSession
}

export async function saveQuizAttempt(
  userId: string,
  sessionId: string | null,
  countryCode: string,
  quizMode: QuizMode,
  isCorrect: boolean
) {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      session_id: sessionId,
      country_code: countryCode,
      quiz_mode: quizMode,
      is_correct: isCorrect,
    })
    .select()
    .single()

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving quiz attempt:', error.message, error.details)
    }
    return null
  }

  return data as QuizAttempt
}

export async function completeQuizSession(sessionId: string, correctAnswers: number) {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await supabase
    .from('quiz_sessions')
    .update({
      completed: true,
      correct_answers: correctAnswers,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Error completing quiz session:', error.message, error.details)
    }
    return null
  }

  return data as QuizSession
}

export interface UserStatistics {
  overall: {
    total_attempts: number
    total_correct: number
    overall_accuracy: number
    countries_attempted: number
    countries_correct: number
  } | null
  historical: {
    lifetime_correct: number
    lifetime_attempts: number
    days_played: number
    first_played: string
    last_played: string
  } | null
  continents: Array<{
    continent: string
    total_attempts: number
    correct_count: number
    accuracy_percent: number
  }> | null
  best_countries: Array<{
    country_code: string
    country_name: string
    flag_url: string
    attempts: number
    correct: number
    accuracy: number
  }> | null
  worst_countries: Array<{
    country_code: string
    country_name: string
    flag_url: string
    attempts: number
    correct: number
    accuracy: number
  }> | null
  mastered_countries: Array<{
    country_code: string
    country_name: string
    flag_url: string
    modes_mastered: number
  }> | null
  country_progress: Array<{
    code: string
    name: string
    flag_url: string
    continent: string
    modes_correct: number
    is_mastered: boolean
  }> | null
}

export async function getUserStatistics(userId: string): Promise<UserStatistics | null> {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await supabase.rpc('get_user_statistics', {
    p_user_id: userId,
  })

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching user statistics:', error.message, error.details)
    }
    return null
  }

  return data as UserStatistics
}
