import { useEffect, useState, useMemo } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Landmark, Building2, Flag, Map } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getUserStatistics } from '../lib/quizApi'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import './QuizModeSelector.css'

const quizModes = [
  {
    key: 'capital-to-country',
    title: 'Hovedsteder',
    description: 'Gjett landet fra hovedstaden',
    icon: Landmark,
    gradient: 'var(--gradient-card-1)',
  },
  {
    key: 'country-to-capital',
    title: 'Land',
    description: 'Gjett hovedstaden fra landet',
    icon: Building2,
    gradient: 'var(--gradient-card-2)',
  },
  {
    key: 'flag-to-country',
    title: 'Flagg',
    description: 'Gjett landet fra flagget',
    icon: Flag,
    gradient: 'var(--gradient-card-3)',
  },
  {
    key: 'map-to-country',
    title: 'Kart',
    description: 'Finn landet på kartet',
    icon: Map,
    gradient: 'var(--gradient-card-4)',
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
      <div className="quiz-mode-selector">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Laster...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-mode-selector">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        Tilbake
      </button>

      <div className="selector-header">
        <h1 className="selector-title">{scopeTitle}</h1>
        <p className="selector-subtitle">{countryCount} land - velg quiz-type</p>
      </div>

      <div className="mode-grid">
        {quizModes.map((mode) => {
          const Icon = mode.icon
          return (
            <Link
              key={mode.key}
              to={getQuizUrl(mode.key)}
              className="mode-card"
            >
              <div className="mode-card-bg" style={{ background: mode.gradient }} />
              <div className="mode-card-content">
                <div className="mode-icon">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <div className="mode-text">
                  <h3>{mode.title}</h3>
                  <p>{mode.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
