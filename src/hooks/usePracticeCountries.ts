import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { getUserStatistics } from '../lib/quizApi'

export function usePracticeCountries(user: User | null) {
  const [practiceCountryCodes, setPracticeCountryCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPracticeCountries() {
      if (user) {
        const stats = await getUserStatistics(user.id)
        if (stats?.country_progress) {
          const notMastered = stats.country_progress
            .filter(c => !c.is_mastered)
            .map(c => c.code)
          setPracticeCountryCodes(notMastered)
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    loadPracticeCountries()
  }, [user])

  return {
    practiceCountryCodes,
    practiceCount: practiceCountryCodes.length,
    loading
  }
}
