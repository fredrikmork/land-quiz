import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuiz, QuizMode } from '../hooks/useQuiz'
import { useAuth } from '../hooks/useAuth'
import { MapDisplay } from './MapDisplay'
import { getFlagUrl } from '../data/countries'
import { createQuizSession, saveQuizAttempt, completeQuizSession } from '../lib/quizApi'
import './Quiz.css'

export function Quiz() {
  const navigate = useNavigate()
  const { mode } = useParams<{ mode: QuizMode }>()
  const quizMode = mode as QuizMode
  const quiz = useQuiz(quizMode)
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const sessionCreated = useRef(false)

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

  if (quiz.isComplete) {
    const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
    return (
      <div className="quiz">
        <div className="quiz-complete">
          <h2>Quiz fullfort!</h2>
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
            {percentage >= 40 && percentage < 60 && 'Ikke verst, fortsett a ove!'}
            {percentage < 40 && 'Ov mer, du blir bedre!'}
          </p>
          {user && <p className="score-saved">Resultatet er lagret!</p>}
          <div className="quiz-actions">
            <button onClick={quiz.restart}>Spill igjen</button>
            <button onClick={() => navigate('/')} className="secondary">Tilbake til meny</button>
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
        <button className="back-button" onClick={() => navigate('/')}>
          ← Tilbake
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
          Poeng: {quiz.score}
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
            {quiz.isCorrect ? 'Riktig!' : `Feil! ${currentQuestion.correctAnswer}`}
          </div>
        )}
      </div>
    </div>
  )
}
