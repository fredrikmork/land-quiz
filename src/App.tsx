import { useState } from 'react'
import { Quiz } from './components/Quiz'
import type { QuizMode } from './hooks/useQuiz'
import './App.css'

type AppMode = 'menu' | QuizMode

function App() {
  const [mode, setMode] = useState<AppMode>('menu')

  if (mode === 'menu') {
    return (
      <div className="app">
        <h1>Land Quiz</h1>
        <p className="subtitle">Test kunnskapen din om land, hovedsteder, flagg og geografi</p>

        <div className="menu">
          <button onClick={() => setMode('capital-to-country')}>
            Hovedstad → Land
          </button>
          <button onClick={() => setMode('country-to-capital')}>
            Land → Hovedstad
          </button>
          <button onClick={() => setMode('flag-to-country')}>
            Flagg → Land
          </button>
          <button onClick={() => setMode('map-to-country')}>
            Kart → Land
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Quiz mode={mode} onBack={() => setMode('menu')} />
    </div>
  )
}

export default App
