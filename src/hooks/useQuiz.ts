import { useState, useCallback, useMemo } from 'react'
import { countries, shuffleArray, Country, Continent, getCountriesByContinent } from '../data/countries'

export type QuizMode = 'capital-to-country' | 'country-to-capital' | 'flag-to-country' | 'map-to-country'

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

function getRandomFromPool(pool: Country[], count: number, exclude: Country): Country[] {
  const available = pool.filter(c => c.code !== exclude.code)
  return shuffleArray(available).slice(0, count)
}

function generateQuestions(mode: QuizMode, scope: QuizScope): QuizQuestion[] {
  const scopeCountries = getCountriesForScope(scope)
  const shuffledCountries = shuffleArray(scopeCountries)

  return shuffledCountries.map(country => {
    // Get wrong answers from the same scope (same continent/pool)
    const wrongAnswers = getRandomFromPool(scopeCountries, 3, country)

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
