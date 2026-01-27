import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Landmark, Building2, Flag, Map, MapPin, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getUserStatistics } from '../lib/quizApi'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import { continentIcons } from '../data/constants'
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
]

const countryToMapMode = {
  key: 'country-to-map',
  title: 'Pek på kartet',
  description: 'Klikk på riktig land på verdenskartet',
  icon: MapPin,
  gradient: 'var(--gradient-card-3)',
  glowColor: 'var(--glow-card-3)',
}

const learnEverythingMode = {
  key: 'learn-everything',
  title: 'Lær deg alt',
  description: 'Utforsk verden med kart, flagg, hovedsteder og fakta om hvert land',
  icon: Sparkles,
}

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
  const getQuizUrl = useCallback((modeKey: string): string => {
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
  }, [scopeType, continent, practiceCountryCodes])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Laster" />
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

      <div className="text-center mb-12 relative">
        {/* Background glow */}
        <div className="absolute inset-0 -top-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-center gap-4">
          {scopeType === 'continent' && continent && (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
              <img
                src={continentIcons[continent as Continent]}
                alt={continent}
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(200deg) brightness(100%) contrast(98%)' }}
              />
            </div>
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-main bg-clip-text text-transparent mb-2">
              {scopeTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-sm font-medium">
                {countryCount} land
              </span>
              <span className="mx-2">·</span>
              velg quiz-type
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First row: Hovedsteder, Land */}
        {quizModes.slice(0, 2).map((mode) => {
          const Icon = mode.icon
          return (
            <Link key={mode.key} to={getQuizUrl(mode.key)}>
              <Card
                className={cn(
                  "relative overflow-hidden border-0 transition-all duration-normal h-full",
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
                onTouchStart={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${mode.glowColor}, 0 0 20px ${mode.glowColor}`
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <CardContent className="relative z-10 flex items-center gap-4 p-6 text-[var(--card-text)]">
                  <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">{mode.title}</h2>
                    <p className="text-sm opacity-90">{mode.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {/* Flagg - row 2, col 1 */}
        {(() => {
          const mode = quizModes[2]
          const Icon = mode.icon
          return (
            <Link key={mode.key} to={getQuizUrl(mode.key)} className="md:col-start-1 md:row-start-2">
              <Card
                className={cn(
                  "relative overflow-hidden border-0 transition-all duration-normal h-full",
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
                onTouchStart={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${mode.glowColor}, 0 0 20px ${mode.glowColor}`
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <CardContent className="relative z-10 flex items-center gap-4 p-6 text-[var(--card-text)]">
                  <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">{mode.title}</h2>
                    <p className="text-sm opacity-90">{mode.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })()}

        {/* Country-to-map mode - spans 2 rows on desktop, col 2, rows 2-3 */}
        <Link to={getQuizUrl(countryToMapMode.key)} className="md:col-start-2 md:row-start-2 md:row-span-2">
          <Card
            className={cn(
              "relative overflow-hidden border-0 transition-all duration-normal h-full",
              "hover:-translate-y-1 hover:scale-[1.02]"
            )}
            style={{
              background: countryToMapMode.gradient,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${countryToMapMode.glowColor}, 0 0 20px ${countryToMapMode.glowColor}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${countryToMapMode.glowColor}, 0 0 20px ${countryToMapMode.glowColor}`
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <CardContent className="relative z-10 flex flex-col items-center justify-center gap-4 p-6 text-[var(--card-text)] h-full text-center">
              <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                <countryToMapMode.icon size={48} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">{countryToMapMode.title}</h2>
                <p className="text-sm opacity-90">{countryToMapMode.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Kart - row 3, col 1 */}
        {(() => {
          const mode = quizModes[3]
          const Icon = mode.icon
          return (
            <Link key={mode.key} to={getQuizUrl(mode.key)} className="md:col-start-1 md:row-start-3">
              <Card
                className={cn(
                  "relative overflow-hidden border-0 transition-all duration-normal h-full",
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
                onTouchStart={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${mode.glowColor}, 0 0 20px ${mode.glowColor}`
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <CardContent className="relative z-10 flex items-center gap-4 p-6 text-[var(--card-text)]">
                  <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">{mode.title}</h2>
                    <p className="text-sm opacity-90">{mode.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })()}
      </div>

      {/* Premium "Lær deg alt" card */}
      <Link to={getQuizUrl(learnEverythingMode.key)} className="block mt-6">
        <Card
          className={cn(
            "relative overflow-hidden border-0 transition-all duration-normal",
            "hover:-translate-y-1 hover:scale-[1.01]"
          )}
          style={{
            background: 'linear-gradient(135deg, #5a6bff 0%, #4d8bff 35%, #45a8ff 70%, #3dc4fc 100%)',
            boxShadow: '0 4px 20px rgba(90, 107, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 40px rgba(90, 107, 255, 0.4), 0 0 30px rgba(69, 168, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(90, 107, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 40px rgba(90, 107, 255, 0.4), 0 0 30px rgba(69, 168, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(90, 107, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Decorative border */}
          <div className="absolute inset-0 rounded-xl border border-white/20" />

          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <CardContent className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 p-6 md:p-8">
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
              <learnEverythingMode.icon size={36} strokeWidth={1.5} className="text-[var(--card-text)]" />
            </div>
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--card-text)]">{learnEverythingMode.title}</h2>
              <p className="text-base text-[var(--card-text)] opacity-80">{learnEverythingMode.description}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
