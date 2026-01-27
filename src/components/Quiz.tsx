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
  const handleAnswer = (selected: string) => {
    const isCorrect = selected === quiz.currentQuestion.correctAnswer

    // Show feedback immediately
    quiz.answer(selected)

    // Save to database in the background (skip for learn-everything mode)
    if (user && quizMode !== 'learn-everything') {
      saveQuizAttempt(
        user.id,
        sessionId,
        quiz.currentQuestion.country.code,
        quizMode,
        isCorrect
      )
    }

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
    const getEmoji = () => {
      if (percentage === 100) return '🏆'
      if (percentage >= 80) return '🌟'
      if (percentage >= 60) return '💪'
      if (percentage >= 40) return '📚'
      return '🎯'
    }
    return (
      <div className="max-w-4xl mx-auto w-full p-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center relative">
          {/* Background celebration effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

          {/* Trophy with ring */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-progress rounded-full blur-xl opacity-50 scale-125" />
            <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-progress rounded-full text-white shadow-lg">
              <Trophy size={52} />
            </div>
            <span className="absolute -bottom-2 -right-2 text-4xl">{getEmoji()}</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Quiz fullført!</h2>

          {/* Score display */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl px-8 py-6">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl md:text-7xl font-black bg-gradient-main bg-clip-text text-transparent">{quiz.score}</span>
              <span className="text-3xl text-muted-foreground">/</span>
              <span className="text-4xl text-muted-foreground">{quiz.totalQuestions}</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-progress rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-2xl font-bold bg-gradient-main bg-clip-text text-transparent">{percentage}% riktig</p>
          </div>

          <p className="text-lg text-muted-foreground max-w-sm">
            {percentage === 100 && 'Perfekt! Du er en mester!'}
            {percentage >= 80 && percentage < 100 && 'Veldig bra!'}
            {percentage >= 60 && percentage < 80 && 'Bra jobbet!'}
            {percentage >= 40 && percentage < 60 && 'Ikke verst, fortsett å øve!'}
            {percentage < 40 && 'Øv mer, du blir bedre!'}
          </p>

          {user && (
            <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-sm text-green-500 border border-green-500/20">
              <Check size={14} /> Resultatet er lagret
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <Button onClick={quiz.restart} className="bg-gradient-button hover:shadow-lg hover:-translate-y-0.5 transition-all px-6">
              <RotateCcw size={18} />
              Spill igjen
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="hover:-translate-y-0.5 transition-all">
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
          <span className="text-xs md:text-sm text-muted-foreground block mb-1.5 text-center font-medium">
            <span className="text-foreground font-bold">{quiz.questionNumber}</span> / {quiz.totalQuestions}
          </span>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-progress rounded-full transition-all duration-300"
              style={{ width: `${(quiz.questionNumber / quiz.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="justify-self-end flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Trophy size={16} className="text-primary" />
          <span className="text-lg font-bold bg-gradient-main bg-clip-text text-transparent">{quiz.score}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 md:space-y-8">
        <div className="text-center">
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            {currentQuestion.prompt}
          </p>
        </div>

        {isLearnEverything ? (
          <LearnEverythingMap countryCode={currentQuestion.country.code} />
        ) : isCountryToMap ? (
          <>
            <div className="flex justify-center items-center p-5 md:p-7 bg-card/50 backdrop-blur rounded-xl border border-border/50 shadow-sm">
              <span className="text-2xl md:text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
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
          <div className="flex justify-center items-center p-4 md:p-6 bg-card/50 backdrop-blur rounded-xl border border-border/50 shadow-sm">
            <img
              src={getFlagUrl(currentQuestion.country.code, 'large')}
              alt={`Flagget til ${currentQuestion.country.name}`}
              className="max-w-full max-h-[140px] md:max-h-[180px] object-contain rounded-lg shadow-xl"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center p-5 md:p-7 bg-card/50 backdrop-blur rounded-xl border border-border/50 shadow-sm">
            <span className="text-2xl md:text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
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
              const optionLetters = ['A', 'B', 'C', 'D']

              return (
                <button
                  key={index}
                  className={cn(
                    "relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                    "bg-card/50 backdrop-blur border-border/50",
                    "[@media(hover:hover)]:hover:-translate-y-0.5",
                    !showFeedback && "[@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:shadow-lg",
                    !showFeedback && "active:scale-[0.98]",
                    showFeedback && isCorrect && "bg-green-500/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
                    showFeedback && isSelected && !isCorrect && "bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
                    showFeedback && !isCorrect && !isSelected && "opacity-50",
                    quiz.answered && "cursor-default"
                  )}
                  onClick={() => !quiz.answered && handleAnswer(option)}
                  disabled={quiz.answered}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors",
                    !showFeedback && "bg-muted text-muted-foreground",
                    showFeedback && isCorrect && "bg-green-500 text-white",
                    showFeedback && isSelected && !isCorrect && "bg-red-500 text-white"
                  )}>
                    {optionLetters[index]}
                  </span>
                  <span className={cn(
                    "text-base font-medium transition-colors",
                    showFeedback && isCorrect && "text-green-600",
                    showFeedback && isSelected && !isCorrect && "text-red-600"
                  )}>
                    {option}
                  </span>
                  {showFeedback && isCorrect && (
                    <Check className="ml-auto text-green-500" size={20} />
                  )}
                </button>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
