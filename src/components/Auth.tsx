import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

interface AuthProps {
  onSuccess?: () => void
}

export function Auth({ onSuccess }: AuthProps) {
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
        onSuccess?.()
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
    <div className="auth">
      <h2>{mode === 'login' ? 'Logg inn' : 'Opprett konto'}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'signup' && (
          <div className="form-group">
            <label htmlFor="username">Brukernavn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ditt brukernavn"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">E-post</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Passord</label>
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

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Vennligst vent...' : mode === 'login' ? 'Logg inn' : 'Opprett konto'}
        </button>
      </form>

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
  )
}
