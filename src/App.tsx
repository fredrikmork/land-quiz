import { useState } from 'react'
import { Quiz } from './components/Quiz'
import { Auth } from './components/Auth'
import { Statistics } from './components/Statistics'
import { useAuth } from './hooks/useAuth'
import type { QuizMode } from './hooks/useQuiz'
import './App.css'

type AppMode = 'menu' | 'auth' | 'stats' | QuizMode

function App() {
  const [mode, setMode] = useState<AppMode>('menu')
  const { profile, loading, signOut, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="app">
        <p className="loading">Laster...</p>
      </div>
    )
  }

  // Auth page
  if (mode === 'auth') {
    return (
      <div className="app">
        <button className="back-button" onClick={() => setMode('menu')}>
          ← Tilbake
        </button>
        <Auth onSuccess={() => setMode('menu')} />
      </div>
    )
  }

  // Statistics page
  if (mode === 'stats') {
    return (
      <div className="app">
        <Statistics onBack={() => setMode('menu')} />
      </div>
    )
  }

  // Quiz modes
  if (mode !== 'menu') {
    return (
      <div className="app">
        <Quiz mode={mode} onBack={() => setMode('menu')} />
      </div>
    )
  }

  // Main menu
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

      <div className="profile-section">
        {isAuthenticated ? (
          <div className="profile-card">
            <div className="profile-info">
              <span className="profile-name">
                {profile?.display_name || profile?.username || 'Bruker'}
              </span>
              <span className="profile-email">{profile?.username}</span>
            </div>
            <div className="profile-actions">
              <button className="profile-button" onClick={() => setMode('stats')}>
                Statistikk
              </button>
              <button className="profile-button secondary" onClick={signOut}>
                Logg ut
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-card logged-out">
            <p className="login-prompt">Logg inn for å lagre statistikk og følge fremgangen din!</p>
            <button className="profile-button" onClick={() => setMode('auth')}>
              Logg inn / Registrer
            </button>
          </div>
        )}
      </div>

      <p className="country-count">197 land fra hele verden</p>
    </div>
  )
}

export default App
