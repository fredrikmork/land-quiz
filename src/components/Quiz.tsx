import { useQuiz, QuizMode } from '../hooks/useQuiz'
import { MapDisplay } from './MapDisplay'
import { getFlagUrl } from '../data/countries'
import './Quiz.css'

interface QuizProps {
  mode: QuizMode
  onBack: () => void
}

export function Quiz({ mode, onBack }: QuizProps) {
  const quiz = useQuiz(mode)

  if (quiz.isComplete) {
    const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
    return (
      <div className="quiz">
        <div className="quiz-complete">
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
          <div className="quiz-actions">
            <button onClick={quiz.restart}>Spill igjen</button>
            <button onClick={onBack} className="secondary">Tilbake til meny</button>
          </div>
        </div>
      </div>
    )
  }

  const { currentQuestion } = quiz
  const isFlag = mode === 'flag-to-country'
  const isMap = mode === 'map-to-country'

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button className="back-button" onClick={onBack}>
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
                onClick={() => quiz.answer(option)}
                disabled={quiz.answered}
              >
                {option}
              </button>
            )
          })}
        </div>

        {quiz.answered && (
          <div className="quiz-feedback">
            {quiz.isCorrect ? (
              <p className="feedback correct">Riktig!</p>
            ) : (
              <p className="feedback wrong">
                Feil! Riktig svar: {currentQuestion.correctAnswer}
              </p>
            )}
            <button className="next-button" onClick={quiz.nextQuestion}>
              {quiz.questionNumber === quiz.totalQuestions ? 'Se resultat' : 'Neste spørsmål'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
