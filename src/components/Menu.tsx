import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Menu() {
  const { profile, signOut, isAuthenticated } = useAuth()

  return (
    <div className="app">
      <h1>Land Quiz</h1>
      <p className="subtitle">Test kunnskapen din om land, hovedsteder, flagg og geografi</p>

      <div className="menu">
        <Link to="/quiz/capital-to-country">
          <button>Hovedsteder</button>
        </Link>
        <Link to="/quiz/country-to-capital">
          <button>Land</button>
        </Link>
        <Link to="/quiz/flag-to-country">
          <button>Flagg</button>
        </Link>
        <Link to="/quiz/map-to-country">
          <button>Kart</button>
        </Link>
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
              <Link to="/stats">
                <button className="profile-button">Statistikk</button>
              </Link>
              <button className="profile-button secondary" onClick={signOut}>
                Logg ut
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-card logged-out">
            <p className="login-prompt">Logg inn for å lagre statistikk og følge fremgangen din!</p>
            <Link to="/auth">
              <button className="profile-button">Logg inn / Registrer</button>
            </Link>
          </div>
        )}
      </div>

      <p className="country-count">197 land fra hele verden</p>
    </div>
  )
}
