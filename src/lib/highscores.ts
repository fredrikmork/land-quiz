import { supabase } from './supabase'
import type { Highscore, NewHighscore } from '../types'

export async function getHighscores(quizMode?: string, limit = 10): Promise<Highscore[]> {
  let query = supabase
    .from('highscores')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit)

  if (quizMode) {
    query = query.eq('quiz_mode', quizMode)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching highscores:', error)
    return []
  }

  return data || []
}

export async function saveHighscore(highscore: NewHighscore): Promise<Highscore | null> {
  const { data, error } = await supabase
    .from('highscores')
    .insert(highscore)
    .select()
    .single()

  if (error) {
    console.error('Error saving highscore:', error)
    return null
  }

  return data
}

export async function getTopScoreForMode(quizMode: string): Promise<Highscore | null> {
  const { data, error } = await supabase
    .from('highscores')
    .select('*')
    .eq('quiz_mode', quizMode)
    .order('score', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null
    }
    console.error('Error fetching top score:', error)
    return null
  }

  return data
}
