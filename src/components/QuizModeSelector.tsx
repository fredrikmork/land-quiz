import { useEffect, useState, useMemo } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Landmark, Building2, Flag, Map, BookOpen } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getUserStatistics } from '../lib/quizApi'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const quizModes = [
  {
    key: 'capital-to-country',
    title: 'Hovedsteder',
    description: 'Gjett landet fra hovedstaden',
    icon: Landmark,
    gradient: 'var(--gradient-card-1)',
    glowColor: 'var(--glow-card-1)',
  },
  {
    key: 'country-to-capital',
    title: 'Land',
    description: 'Gjett hovedstaden fra landet',
    icon: Building2,
    gradient: 'var(--gradient-card-2)',
    glowColor: 'var(--glow-card-2)',
  },
  {
    key: 'flag-to-country',
    title: 'Flagg',
    description: 'Gjett landet fra flagget',
    icon: Flag,
    gradient: 'var(--gradient-card-3)',
    glowColor: 'var(--glow-card-3)',
  },
  {
    key: 'map-to-country',
    title: 'Kart',
    description: 'Finn landet på kartet',
    icon: Map,
    gradient: 'var(--gradient-card-4)',
    glowColor: 'var(--glow-card-4)',
  },
  {
    key: 'learn-everything',
    title: 'Lær deg alt',
    description: 'Se kart, flagg og hovedstad',
    icon: BookOpen,
    gradient: 'var(--gradient-card-1)',
    glowColor: 'var(--glow-card-1)',
  },
]

type ScopeType = 'continent' | 'all' | 'practice'

export function QuizModeSelector() {
  const navigate = useNavigate()
  const location = useLocation()
  const { continent } = useParams<{ continent?: string }>()
  const { user } = useAuth()
  const [practiceCountryCodes, setPracticeCountryCodes] = useState<string[]>([])

  // Determine scope type from URL path
  const scopeType: ScopeType = useMemo(() => {
    if (location.pathname.startsWith('/quiz/continent/')) return 'continent'
    if (location.pathname.startsWith('/quiz/practice')) return 'practice'
    return 'all'
  }, [location.pathname])

  const [loading, setLoading] = useState(scopeType === 'practice')

  useEffect(() => {
    async function loadPracticeCountries() {
      if (scopeType === 'practice' && user) {
        const stats = await getUserStatistics(user.id)
        if (stats?.country_progress) {
          const notMastered = stats.country_progress
            .filter(c => !c.is_mastered)
            .map(c => c.code)
          setPracticeCountryCodes(notMastered)
        }
        setLoading(false)
      }
    }
    loadPracticeCountries()
  }, [scopeType, user])

  // Determine scope info for display
  let scopeTitle = ''
  let countryCount = 0

  if (scopeType === 'continent' && continent) {
    scopeTitle = continent
    countryCount = getCountriesByContinent(continent as Continent).length
  } else if (scopeType === 'all') {
    scopeTitle = 'Alle land'
    countryCount = countries.length
  } else if (scopeType === 'practice') {
    scopeTitle = 'Øvingsmodus'
    countryCount = practiceCountryCodes.length
  }

  // Build the quiz URL based on scope
  function getQuizUrl(modeKey: string): string {
    if (scopeType === 'continent' && continent) {
      return `/quiz/continent/${continent}/${modeKey}`
    } else if (scopeType === 'all') {
      return `/quiz/all/${modeKey}`
    } else if (scopeType === 'practice') {
      // Store practice country codes in sessionStorage to avoid long URLs
      sessionStorage.setItem('practiceCountryCodes', JSON.stringify(practiceCountryCodes))
      return `/quiz/practice/${modeKey}`
    }
    return '/'
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Laster...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={18} />
        Tilbake
      </Button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-main bg-clip-text text-transparent mb-2">
          {scopeTitle}
        </h1>
        <p className="text-lg text-muted-foreground">
          {countryCount} land - velg quiz-type
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizModes.map((mode) => {
          const Icon = mode.icon
          return (
            <Link key={mode.key} to={getQuizUrl(mode.key)}>
              <Card
                className={cn(
                  "relative overflow-hidden border-0 transition-all duration-normal",
                  "hover:-translate-y-1 hover:scale-[1.02]"
                )}
                style={{
                  background: mode.gradient,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${mode.glowColor}, 0 0 20px ${mode.glowColor}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <CardContent className="relative z-10 flex items-center gap-4 p-6 text-white">
                  <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold">{mode.title}</h3>
                    <p className="text-sm opacity-90">{mode.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
