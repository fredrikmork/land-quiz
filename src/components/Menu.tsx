import { Link } from 'react-router-dom'
import { Globe, BookOpen } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { getUserStatistics } from '../lib/quizApi'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import { getContinentIcon } from './ContinentIcons'
import './Menu.css'

const continents: { name: Continent; gradient: string; glowColor: string }[] = [
  { name: 'Europa', gradient: 'var(--gradient-card-1)', glowColor: 'var(--glow-card-1)' },
  { name: 'Asia', gradient: 'var(--gradient-card-2)', glowColor: 'var(--glow-card-2)' },
  { name: 'Afrika', gradient: 'var(--gradient-card-3)', glowColor: 'var(--glow-card-3)' },
  { name: 'Nord-Amerika', gradient: 'var(--gradient-card-4)', glowColor: 'var(--glow-card-4)' },
  { name: 'Sør-Amerika', gradient: 'var(--gradient-card-1)', glowColor: 'var(--glow-card-1)' },
  { name: 'Oseania', gradient: 'var(--gradient-card-2)', glowColor: 'var(--glow-card-2)' },
]

export function Menu() {
  const { user, isAuthenticated } = useAuth()
  const [practiceCount, setPracticeCount] = useState<number | null>(null)

  useEffect(() => {
    async function loadPracticeCount() {
      if (user) {
        const stats = await getUserStatistics(user.id)
        if (stats?.country_progress) {
          const notMastered = stats.country_progress.filter(c => !c.is_mastered).length
          setPracticeCount(notMastered)
        }
      }
    }
    loadPracticeCount()
  }, [user])

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <h1 className="menu-title">Lær verdens land</h1>
        <p className="menu-subtitle">
          Velg et kontinent eller test deg på alle land
        </p>
      </div>

      <section className="scope-section">
        <h2 className="section-title">Kontinenter</h2>
        <div className="continent-grid">
          {continents.map((continent) => {
            const count = getCountriesByContinent(continent.name).length
            const ContinentIcon = getContinentIcon(continent.name)
            return (
              <Link
                key={continent.name}
                to={`/quiz/continent/${continent.name}`}
                className="continent-card"
                style={{ '--glow-color': continent.glowColor } as React.CSSProperties}
              >
                <div className="continent-card-bg" style={{ background: continent.gradient }} />
                <div className="continent-card-content">
                  <div className="continent-icon">
                    <ContinentIcon />
                  </div>
                  <div className="continent-info">
                    <span className="continent-name">{continent.name}</span>
                    <span className="continent-count">{count} land</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="scope-section">
        <h2 className="section-title">Utfordringer</h2>
        <div className="challenge-grid">
          <Link to="/quiz/all" className="challenge-card" style={{ '--glow-color': 'var(--glow-card-3)' } as React.CSSProperties}>
            <div className="challenge-card-bg" style={{ background: 'var(--gradient-card-3)' }} />
            <div className="challenge-card-content">
              <div className="challenge-icon">
                <Globe size={28} strokeWidth={1.5} />
              </div>
              <div className="challenge-info">
                <span className="challenge-name">Alle land</span>
                <span className="challenge-count">{countries.length} land</span>
              </div>
            </div>
          </Link>

          {isAuthenticated ? (
            <Link
              to="/quiz/practice"
              className={`challenge-card practice-card ${practiceCount === 0 ? 'disabled' : ''}`}
              onClick={(e) => practiceCount === 0 && e.preventDefault()}
              style={{ '--glow-color': 'var(--glow-card-4)' } as React.CSSProperties}
            >
              <div className="challenge-card-bg" style={{ background: 'var(--gradient-card-4)' }} />
              <div className="challenge-card-content">
                <div className="challenge-icon">
                  <BookOpen size={28} strokeWidth={1.5} />
                </div>
                <div className="challenge-info">
                  <span className="challenge-name">Umestrede land</span>
                  <span className="challenge-description">
                    Øv på landene du ikke ennå har mestret
                  </span>
                  <span className="challenge-count">
                    {practiceCount === null
                      ? 'Laster...'
                      : practiceCount === 0
                      ? 'Alle mestret!'
                      : `${practiceCount} land`}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="challenge-card practice-card disabled" style={{ '--glow-color': 'var(--glow-card-4)' } as React.CSSProperties}>
              <div className="challenge-card-bg" style={{ background: 'var(--gradient-card-4)' }} />
              <div className="challenge-card-content">
                <div className="challenge-icon">
                  <BookOpen size={28} strokeWidth={1.5} />
                </div>
                <div className="challenge-info">
                  <span className="challenge-name">Umestrede land</span>
                  <span className="challenge-description">
                    Øv på landene du ikke ennå har mestret
                  </span>
                  <span className="challenge-count">Logg inn for å bruke</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
