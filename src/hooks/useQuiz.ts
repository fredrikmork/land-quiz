import { useState, useCallback, useMemo } from 'react'
import { countries, shuffleArray, Country, Continent, getCountriesByContinent } from '../data/countries'

export type QuizMode = 'capital-to-country' | 'country-to-capital' | 'flag-to-country' | 'map-to-country' | 'learn-everything'

export type QuizScope =
  | { type: 'continent'; continent: Continent }
  | { type: 'all' }
  | { type: 'practice'; countryCodes: string[] }

export interface QuizQuestion {
  prompt: string
  displayValue: string
  correctAnswer: string
  options: string[]
  country: Country
}

export interface QuizState {
  currentQuestion: number
  score: number
  answered: boolean
  selectedAnswer: string | null
  isCorrect: boolean | null
  questions: QuizQuestion[]
  isComplete: boolean
}

function getCountriesForScope(scope: QuizScope): Country[] {
  switch (scope.type) {
    case 'continent':
      return getCountriesByContinent(scope.continent)
    case 'all':
      return countries
    case 'practice':
      return countries.filter(c => scope.countryCodes.includes(c.code))
  }
}

// Haversine-formel for å beregne avstand mellom to koordinater (i km)
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2
  const R = 6371 // Jordens radius i km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Finn nærliggende land basert på geografisk avstand
function getNearbyCountries(pool: Country[], target: Country, count: number): Country[] {
  if (!target.capitalCoordinates) {
    // Fallback til tilfeldig hvis koordinater mangler
    const available = pool.filter(c => c.code !== target.code)
    return shuffleArray(available).slice(0, count)
  }

  // Beregn avstand til alle andre land
  const withDistance = pool
    .filter(c => c.code !== target.code && c.capitalCoordinates)
    .map(c => ({
      country: c,
      distance: calculateDistance(target.capitalCoordinates!, c.capitalCoordinates!)
    }))
    .sort((a, b) => a.distance - b.distance)

  // Velg fra de 10 nærmeste for variasjon
  const nearestPool = withDistance.slice(0, Math.min(10, withDistance.length))
  return shuffleArray(nearestPool).slice(0, count).map(c => c.country)
}

function generateQuestions(mode: QuizMode, scope: QuizScope): QuizQuestion[] {
  const scopeCountries = getCountriesForScope(scope)
  const shuffledCountries = shuffleArray(scopeCountries)

  return shuffledCountries.map(country => {
    // Get wrong answers from nearby countries for increased difficulty
    const wrongAnswers = getNearbyCountries(scopeCountries, country, 3)

    let prompt: string
    let displayValue: string
    let correctAnswer: string
    let options: string[]

    switch (mode) {
      case 'capital-to-country':
        prompt = 'Hvilket land har denne hovedstaden?'
        displayValue = country.capital
        correctAnswer = country.name
        options = shuffleArray([country.name, ...wrongAnswers.map(c => c.name)])
        break

      case 'country-to-capital':
        prompt = 'Hva er hovedstaden i dette landet?'
        displayValue = country.name
        correctAnswer = country.capital
        options = shuffleArray([country.capital, ...wrongAnswers.map(c => c.capital)])
        break

      case 'flag-to-country':
        prompt = 'Hvilket land har dette flagget?'
        displayValue = country.code
        correctAnswer = country.name
        options = shuffleArray([country.name, ...wrongAnswers.map(c => c.name)])
        break

      case 'map-to-country':
        prompt = 'Hvilket land er dette?'
        displayValue = country.code
        correctAnswer = country.name
        options = shuffleArray([country.name, ...wrongAnswers.map(c => c.name)])
        break

      case 'learn-everything':
        prompt = 'Hvilket land er dette?'
        displayValue = country.code
        correctAnswer = country.name
        options = shuffleArray([country.name, ...wrongAnswers.map(c => c.name)])
        break
    }

    return { prompt, displayValue, correctAnswer, options, country }
  })
}

export function useQuiz(mode: QuizMode, scope: QuizScope) {
  const [state, setState] = useState<QuizState>(() => ({
    currentQuestion: 0,
    score: 0,
    answered: false,
    selectedAnswer: null,
    isCorrect: null,
    questions: generateQuestions(mode, scope),
    isComplete: false,
  }))

  const currentQ = useMemo(
    () => state.questions[state.currentQuestion],
    [state.questions, state.currentQuestion]
  )

  const answer = useCallback((selected: string) => {
    if (state.answered) return

    const isCorrect = selected === currentQ.correctAnswer

    setState(prev => ({
      ...prev,
      answered: true,
      selectedAnswer: selected,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }))
  }, [state.answered, currentQ])

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentQuestion + 1
      if (nextIndex >= prev.questions.length) {
        return { ...prev, isComplete: true }
      }
      return {
        ...prev,
        currentQuestion: nextIndex,
        answered: false,
        selectedAnswer: null,
        isCorrect: null,
      }
    })
  }, [])

  const restart = useCallback(() => {
    setState({
      currentQuestion: 0,
      score: 0,
      answered: false,
      selectedAnswer: null,
      isCorrect: null,
      questions: generateQuestions(mode, scope),
      isComplete: false,
    })
  }, [mode, scope])

  return {
    ...state,
    currentQuestion: currentQ,
    questionNumber: state.currentQuestion + 1,
    totalQuestions: state.questions.length,
    answer,
    nextQuestion,
    restart,
  }
}
