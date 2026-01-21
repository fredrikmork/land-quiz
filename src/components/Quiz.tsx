import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Home, Trophy, Check } from 'lucide-react'
import { useQuiz, QuizMode, QuizScope } from '../hooks/useQuiz'
import { useAuth } from '../hooks/useAuth'
import { MapDisplay, InteractiveMapDisplay } from './MapDisplay'
import { LearnEverythingMap } from './LearnEverythingMap'
import { getFlagUrl, type Continent } from '../data/countries'
import { createQuizSession, saveQuizAttempt, completeQuizSession } from '../lib/quizApi'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function Quiz() {
  const navigate = useNavigate()
  const location = useLocation()
  const { scopeValue, mode } = useParams<{
    scopeValue?: string
    mode: QuizMode
  }>()

  const quizMode = mode as QuizMode

  // Determine scope type from URL path
  const scopeType = useMemo(() => {
    if (location.pathname.startsWith('/quiz/continent/')) return 'continent'
    if (location.pathname.startsWith('/quiz/practice/')) return 'practice'
    return 'all'
  }, [location.pathname])

  // Build scope from URL parameters
  const scope: QuizScope = useMemo(() => {
    if (scopeType === 'continent' && scopeValue) {
      return { type: 'continent', continent: scopeValue as Continent }
    } else if (scopeType === 'practice') {
      // Get practice country codes from sessionStorage
      const stored = sessionStorage.getItem('practiceCountryCodes')
      const countryCodes = stored ? JSON.parse(stored) : []
      return { type: 'practice', countryCodes }
    }
    return { type: 'all' }
  }, [scopeType, scopeValue])

  const quiz = useQuiz(quizMode, scope)
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const sessionCreated = useRef(false)

  // Build back URL based on scope
  const backUrl = useMemo(() => {
    if (scopeType === 'continent' && scopeValue) {
      return `/quiz/continent/${scopeValue}`
    } else if (scopeType === 'all') {
      return '/quiz/all'
    } else if (scopeType === 'practice') {
      return '/quiz/practice'
    }
    return '/'
  }, [scopeType, scopeValue])

  // Create session when quiz starts (skip for learn-everything mode)
  useEffect(() => {
    if (user && !sessionCreated.current && quizMode !== 'learn-everything') {
      sessionCreated.current = true
      createQuizSession(user.id, quizMode, quiz.totalQuestions).then((session) => {
        if (session) {
          setSessionId(session.id)
        }
      })
    }
  }, [user, quizMode, quiz.totalQuestions])

  // Save attempt when user answers and auto-advance
  const handleAnswer = async (selected: string) => {
    const isCorrect = selected === quiz.currentQuestion.correctAnswer

    // Save to database if logged in (skip for learn-everything mode)
    if (user && quizMode !== 'learn-everything') {
      await saveQuizAttempt(
        user.id,
        sessionId,
        quiz.currentQuestion.country.code,
        quizMode,
        isCorrect
      )
    }

    quiz.answer(selected)

    // Auto-advance after a short delay
    setTimeout(() => {
      quiz.nextQuestion()
    }, 1200)
  }

  // Complete session when quiz is done (skip for learn-everything mode)
  useEffect(() => {
    if (quiz.isComplete && sessionId && user && quizMode !== 'learn-everything') {
      completeQuizSession(sessionId, quiz.score)
    }
  }, [quiz.isComplete, sessionId, quiz.score, user, quizMode])

  // Handle empty practice mode
  if (scope.type === 'practice' && scope.countryCodes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full p-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gradient-main rounded-full text-white">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Ingen land å øve på!</h2>
          <p className="text-muted-foreground">Du har mestret alle landene. Bra jobba!</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} className="bg-gradient-button hover:shadow-md hover:-translate-y-0.5 transition-all">
              <Home size={18} />
              Til meny
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (quiz.isComplete) {
    const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
    return (
      <div className="max-w-4xl mx-auto w-full p-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gradient-main rounded-full text-white">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Quiz fullført!</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black bg-gradient-main bg-clip-text text-transparent">{quiz.score}</span>
            <span className="text-3xl text-muted-foreground">/</span>
            <span className="text-4xl text-muted-foreground">{quiz.totalQuestions}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{percentage}% riktig</p>
          <p className="text-lg text-muted-foreground">
            {percentage === 100 && 'Perfekt! Du er en mester!'}
            {percentage >= 80 && percentage < 100 && 'Veldig bra!'}
            {percentage >= 60 && percentage < 80 && 'Bra jobbet!'}
            {percentage >= 40 && percentage < 60 && 'Ikke verst, fortsett å øve!'}
            {percentage < 40 && 'Øv mer, du blir bedre!'}
          </p>
          {user && (
            <p className="flex items-center gap-2 text-sm text-green-500">
              <Check size={16} /> Resultatet er lagret
            </p>
          )}
          <div className="flex gap-3">
            <Button onClick={quiz.restart} className="bg-gradient-button hover:shadow-md hover:-translate-y-0.5 transition-all">
              <RotateCcw size={18} />
              Spill igjen
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home size={18} />
              Til meny
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { currentQuestion } = quiz
  const isFlag = quizMode === 'flag-to-country'
  const isMap = quizMode === 'map-to-country'
  const isCountryToMap = quizMode === 'country-to-map'
  const isLearnEverything = quizMode === 'learn-everything'

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
      {/* Header */}
      <div className="grid grid-cols-3 items-center gap-3 mb-6 md:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(backUrl)}
          className="justify-self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Tilbake</span>
        </Button>
        <div className="justify-self-center w-full max-w-[200px] md:max-w-[300px]">
          <span className="text-xs md:text-sm text-muted-foreground block mb-1 md:mb-2 text-center font-medium">
            {quiz.questionNumber} / {quiz.totalQuestions}
          </span>
          <Progress
            value={(quiz.questionNumber / quiz.totalQuestions) * 100}
            className="h-1.5"
          />
        </div>
        <div className="justify-self-end flex items-center gap-2">
          <Trophy size={20} className="text-primary" />
          <span className="text-xl font-bold bg-gradient-main bg-clip-text text-transparent">{quiz.score}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 md:space-y-8">
        <p className="text-xl md:text-2xl font-semibold text-center text-foreground mb-6 md:mb-8">
          {currentQuestion.prompt}
        </p>

        {isLearnEverything ? (
          <LearnEverythingMap countryCode={currentQuestion.country.code} />
        ) : isCountryToMap ? (
          <>
            <div className="flex justify-center items-center p-6 md:p-8 bg-card rounded-lg border border-border">
              <span className="text-2xl md:text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
                {currentQuestion.displayValue}
              </span>
            </div>
            <InteractiveMapDisplay
              selectedAnswer={quiz.selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer}
              answered={quiz.answered}
              onSelect={handleAnswer}
            />
          </>
        ) : isMap ? (
          <MapDisplay countryCode={currentQuestion.country.code} />
        ) : isFlag ? (
          <div className="flex justify-center items-center p-4 md:p-8 bg-card rounded-lg border border-border min-h-[200px] md:min-h-[300px]">
            <img
              src={getFlagUrl(currentQuestion.country.code, 'large')}
              alt="Flagg"
              className="max-w-full max-h-[180px] md:max-h-[250px] object-contain rounded shadow-lg"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center p-6 md:p-12 bg-card rounded-lg border border-border min-h-[150px] md:min-h-[200px]">
            <span className="text-2xl md:text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
              {currentQuestion.displayValue}
            </span>
          </div>
        )}

        {/* Options - not shown for country-to-map mode */}
        {!isCountryToMap && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correctAnswer
              const isSelected = option === quiz.selectedAnswer
              const showFeedback = quiz.answered

              return (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "p-4 text-base font-medium transition-all h-auto",
                    !showFeedback && "[@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:-translate-y-0.5",
                    showFeedback && isCorrect && "bg-green-500 text-white border-green-500 disabled:opacity-100",
                    showFeedback && isSelected && !isCorrect && "bg-red-500 text-white border-red-500 disabled:opacity-100"
                  )}
                  onClick={() => handleAnswer(option)}
                  disabled={quiz.answered}
                >
                  {option}
                </Button>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
