import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Home, Trophy, Check, X } from 'lucide-react'
import { useQuiz, QuizMode, QuizScope } from '../hooks/useQuiz'
import { useAuth } from '../hooks/useAuth'
import { MapDisplay } from './MapDisplay'
import { getFlagUrl, type Continent } from '../data/countries'
import { createQuizSession, saveQuizAttempt, completeQuizSession } from '../lib/quizApi'
import './Quiz.css'

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

  // Create session when quiz starts
  useEffect(() => {
    if (user && !sessionCreated.current) {
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

    // Save to database if logged in
    if (user) {
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

  // Complete session when quiz is done
  useEffect(() => {
    if (quiz.isComplete && sessionId && user) {
      completeQuizSession(sessionId, quiz.score)
    }
  }, [quiz.isComplete, sessionId, quiz.score, user])

  // Handle empty practice mode
  if (scope.type === 'practice' && scope.countryCodes.length === 0) {
    return (
      <div className="quiz">
        <div className="quiz-complete">
          <div className="complete-icon">
            <Trophy size={48} />
          </div>
          <h2>Ingen land å øve på!</h2>
          <p className="score-message">Du har mestret alle landene. Bra jobba!</p>
          <div className="quiz-actions">
            <button className="btn-action primary" onClick={() => navigate('/')}>
              <Home size={18} />
              Til meny
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (quiz.isComplete) {
    const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
    return (
      <div className="quiz">
        <div className="quiz-complete">
          <div className="complete-icon">
            <Trophy size={48} />
          </div>
          <h2>Quiz fullført!</h2>
          <div className="final-score">
            <span className="score-number">{quiz.score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{quiz.totalQuestions}</span>
          </div>
          <p className="score-percentage">{percentage}% riktig</p>
          <p className="score-message">
            {percentage === 100 && 'Perfekt! Du er en mester!'}
            {percentage >= 80 && percentage < 100 && 'Veldig bra!'}
            {percentage >= 60 && percentage < 80 && 'Bra jobbet!'}
            {percentage >= 40 && percentage < 60 && 'Ikke verst, fortsett å øve!'}
            {percentage < 40 && 'Øv mer, du blir bedre!'}
          </p>
          {user && <p className="score-saved"><Check size={16} /> Resultatet er lagret</p>}
          <div className="quiz-actions">
            <button className="btn-action primary" onClick={quiz.restart}>
              <RotateCcw size={18} />
              Spill igjen
            </button>
            <button className="btn-action secondary" onClick={() => navigate('/')}>
              <Home size={18} />
              Til meny
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { currentQuestion } = quiz
  const isFlag = quizMode === 'flag-to-country'
  const isMap = quizMode === 'map-to-country'

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button className="back-button" onClick={() => navigate(backUrl)}>
          <ArrowLeft size={18} />
          Tilbake
        </button>
        <div className="progress">
          <span className="progress-text">
            {quiz.questionNumber} / {quiz.totalQuestions}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(quiz.questionNumber / quiz.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="score">
          <Trophy size={16} />
          {quiz.score}
        </div>
      </div>

      <div className="quiz-content">
        <p className="quiz-prompt">{currentQuestion.prompt}</p>
        {isMap ? (
          <MapDisplay countryCode={currentQuestion.country.code} />
        ) : isFlag ? (
          <div className="quiz-display flag">
            <img
              src={getFlagUrl(currentQuestion.country.code, 'large')}
              alt="Flagg"
              className="flag-image"
            />
          </div>
        ) : (
          <div className="quiz-display">
            {currentQuestion.displayValue}
          </div>
        )}

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => {
            let className = 'option'
            if (quiz.answered) {
              if (option === currentQuestion.correctAnswer) {
                className += ' correct'
              } else if (option === quiz.selectedAnswer) {
                className += ' wrong'
              }
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswer(option)}
                disabled={quiz.answered}
              >
                {option}
              </button>
            )
          })}
        </div>

        {quiz.answered && (
          <div className={`quiz-feedback-toast ${quiz.isCorrect ? 'correct' : 'wrong'}`}>
            {quiz.isCorrect ? (
              <><Check size={24} /> Riktig!</>
            ) : (
              <><X size={24} /> {currentQuestion.correctAnswer}</>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
