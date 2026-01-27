import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, LogIn, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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
    <div className="max-w-md mx-auto w-full p-8 min-h-screen flex flex-col justify-center">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm text-muted-foreground hover:text-foreground w-fit"
      >
        <ArrowLeft size={18} />
        Tilbake
      </Button>

      <Card className="border-border shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-main rounded-full text-white">
            {mode === 'login' ? <LogIn size={28} /> : <UserPlus size={28} />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Velkommen tilbake' : 'Opprett konto'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Logg inn for å fortsette' : 'Registrer deg for å lagre fremgangen'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="username" className="font-medium text-sm">
                  Brukernavn
                </Label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ditt brukernavn"
                    className="pl-11 bg-secondary border-border focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-sm">
                E-post
              </Label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="pl-11 bg-secondary border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-sm">
                Passord
              </Label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 6 tegn"
                  minLength={6}
                  className="pl-11 bg-secondary border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <p role="alert" aria-live="polite" className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                {error}
              </p>
            )}
            {message && (
              <p role="status" aria-live="polite" className="text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md p-3">
                {message}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-button hover:shadow-md hover:-translate-y-0.5 transition-all mt-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Vennligst vent...
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn size={18} />
                  Logg inn
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Opprett konto
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">eller</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Har du ikke konto?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Opprett konto
                </button>
              </>
            ) : (
              <>
                Har du allerede konto?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Logg inn
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
