import { Link } from 'react-router-dom'
import { Landmark, Building2, Flag, Map, ChevronRight } from 'lucide-react'
import './Menu.css'

const quizModes = [
  {
    path: '/quiz/capital-to-country',
    title: 'Hovedsteder',
    description: 'Gjett landet fra hovedstaden',
    icon: Landmark,
    gradient: 'var(--gradient-card-1)',
  },
  {
    path: '/quiz/country-to-capital',
    title: 'Land',
    description: 'Gjett hovedstaden fra landet',
    icon: Building2,
    gradient: 'var(--gradient-card-2)',
  },
  {
    path: '/quiz/flag-to-country',
    title: 'Flagg',
    description: 'Gjett landet fra flagget',
    icon: Flag,
    gradient: 'var(--gradient-card-3)',
  },
  {
    path: '/quiz/map-to-country',
    title: 'Kart',
    description: 'Gjett landet på kartet',
    icon: Map,
    gradient: 'var(--gradient-card-4)',
  },
]

export function Menu() {
  return (
    <div className="menu-page">
      <div className="menu-hero">
        <h1 className="menu-title">
          Lær verdens land
        </h1>
        <p className="menu-subtitle">
          Test kunnskapen din om hovedsteder, flagg og geografi
        </p>
      </div>

      <div className="quiz-grid">
        {quizModes.map((mode) => {
          const Icon = mode.icon
          return (
            <Link key={mode.path} to={mode.path} className="quiz-card">
              <div className="quiz-card-bg" style={{ background: mode.gradient }} />
              <div className="quiz-card-content">
                <div className="quiz-card-icon">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <div className="quiz-card-text">
                  <h3>{mode.title}</h3>
                  <p>{mode.description}</p>
                </div>
                <div className="quiz-card-arrow">
                  <ChevronRight size={24} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="menu-footer">
        <div className="country-badge">
          <span className="country-count">197</span>
          <span className="country-label">land fra hele verden</span>
        </div>
      </div>
    </div>
  )
}
