import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, LogIn, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

export function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    } else {
      if (!username.trim()) {
        setError('Brukernavn er påkrevd')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, username)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Sjekk e-posten din for å bekrefte kontoen!')
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        Tilbake
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            {mode === 'login' ? <LogIn size={28} /> : <UserPlus size={28} />}
          </div>
          <h2>{mode === 'login' ? 'Velkommen tilbake' : 'Opprett konto'}</h2>
          <p>{mode === 'login' ? 'Logg inn for å fortsette' : 'Registrer deg for å lagre fremgangen'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="username">Brukernavn</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ditt brukernavn"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-post</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Passord</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6 tegn"
                minLength={6}
                required
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <><Loader2 size={18} className="spinning" /> Vennligst vent...</>
            ) : mode === 'login' ? (
              <><LogIn size={18} /> Logg inn</>
            ) : (
              <><UserPlus size={18} /> Opprett konto</>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>eller</span>
        </div>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>
              Har du ikke konto?{' '}
              <button type="button" onClick={() => setMode('signup')}>
                Opprett konto
              </button>
            </>
          ) : (
            <>
              Har du allerede konto?{' '}
              <button type="button" onClick={() => setMode('login')}>
                Logg inn
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
