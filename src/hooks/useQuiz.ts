import { useState, useCallback, useMemo } from 'react'
import { countries, shuffleArray, getRandomCountries, Country } from '../data/countries'

export type QuizMode = 'capital-to-country' | 'country-to-capital' | 'flag-to-country' | 'map-to-country'

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

function generateQuestions(mode: QuizMode, count: number = 10): QuizQuestion[] {
  const shuffledCountries = shuffleArray(countries).slice(0, count)

  return shuffledCountries.map(country => {
    const wrongAnswers = getRandomCountries(3, country)

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
        displayValue = country.code // Brukes til å generere flagg-URL
        correctAnswer = country.name
        options = shuffleArray([country.name, ...wrongAnswers.map(c => c.name)])
        break

      case 'map-to-country':
        prompt = 'Hvilket land er dette?'
        displayValue = country.code // Brukes til kart-visning
        correctAnswer = country.name
        options = shuffleArray([country.name, ...wrongAnswers.map(c => c.name)])
        break
    }

    return { prompt, displayValue, correctAnswer, options, country }
  })
}

export function useQuiz(mode: QuizMode) {
  const [state, setState] = useState<QuizState>(() => ({
    currentQuestion: 0,
    score: 0,
    answered: false,
    selectedAnswer: null,
    isCorrect: null,
    questions: generateQuestions(mode),
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
      questions: generateQuestions(mode),
      isComplete: false,
    })
  }, [mode])

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
