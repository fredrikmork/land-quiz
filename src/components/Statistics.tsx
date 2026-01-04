import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Landmark, Building2, Flag, Map } from 'lucide-react'
import { getUserStatistics, UserStatistics } from '../lib/quizApi'
import { useAuth } from '../hooks/useAuth'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import './Statistics.css'

const quizModes = [
  { key: 'capital-to-country', label: 'Hovedsteder', icon: Landmark },
  { key: 'country-to-capital', label: 'Land', icon: Building2 },
  { key: 'flag-to-country', label: 'Flagg', icon: Flag },
  { key: 'map-to-country', label: 'Kart', icon: Map },
]

// Normalize continent names from database (may have old "Sor-Amerika")
function normalizeContinent(continent: string): string {
  if (continent === 'Sor-Amerika') return 'Sør-Amerika'
  return continent
}

export function Statistics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'continents' | 'countries'>('overview')
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    if (!user) return
    setLoading(true)
    const data = await getUserStatistics(user.id)
    setStats(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="statistics">
        <p className="loading">Laster statistikk...</p>
      </div>
    )
  }

  if (!stats || !stats.overall) {
    return (
      <div className="statistics">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Tilbake
        </button>
        <h2>Statistikk</h2>
        <p className="no-data">Du har ikke spilt noen quizer enda. Start en quiz for å se statistikk!</p>
      </div>
    )
  }

  return (
    <div className="statistics">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Tilbake
      </button>
      <h2>Din statistikk</h2>

      {/* Overview Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.historical?.lifetime_correct || 0}</span>
          <span className="stat-label">Totalt riktige</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.overall.overall_accuracy}%</span>
          <span className="stat-label">Treffsikkerhet</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.mastered_countries?.length || 0}</span>
          <span className="stat-label">Mestrede land</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.historical?.days_played || 0}</span>
          <span className="stat-label">Dager spilt</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="stats-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Oversikt
        </button>
        <button
          className={activeTab === 'continents' ? 'active' : ''}
          onClick={() => setActiveTab('continents')}
        >
          Kontinenter
        </button>
        <button
          className={activeTab === 'countries' ? 'active' : ''}
          onClick={() => setActiveTab('countries')}
        >
          Land
        </button>
      </div>

      {/* Tab Content */}
      <div className="stats-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Best Countries */}
            {stats.best_countries && stats.best_countries.length > 0 ? (
              <div className="stats-section">
                <h3>Dine beste land</h3>
                <div className="country-list">
                  {stats.best_countries.map((country) => (
                    <div key={country.country_code} className="country-item">
                      <img src={country.flag_url} alt="" className="country-flag" />
                      <span className="country-name">{country.country_name}</span>
                      <span className="country-accuracy good">{country.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="no-data">Spill flere quizer for å se dine beste land!</p>
            )}

            {/* Worst Countries */}
            {stats.worst_countries && stats.worst_countries.length > 0 && (
              <div className="stats-section">
                <h3>Land du kan øve på</h3>
                <div className="country-list">
                  {stats.worst_countries.map((country) => (
                    <div key={country.country_code} className="country-item">
                      <img src={country.flag_url} alt="" className="country-flag" />
                      <span className="country-name">{country.country_name}</span>
                      <span className="country-accuracy bad">{country.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'continents' && (
          <div className="continents-tab">
            {selectedContinent ? (
              <div className="continent-detail">
                <button className="back-link" onClick={() => setSelectedContinent(null)}>
                  ← Alle kontinenter
                </button>
                <h3>{selectedContinent}</h3>
                {stats.country_progress && (
                  <div className="continent-countries">
                    {stats.country_progress
                      .filter((c) => normalizeContinent(c.continent) === selectedContinent)
                      .map((country) => (
                        <div key={country.code} className="country-card">
                          <div className="country-card-header">
                            <img src={country.flag_url} alt="" className="country-flag" />
                            <div className="country-info">
                              <span className="country-name">{country.name}</span>
                              <span className="country-capital">
                                {countries.find(c => c.code === country.code)?.capital}
                              </span>
                            </div>
                            {country.is_mastered && <span className="mastered-badge">✓</span>}
                          </div>
                          <div className="mode-list">
                            {quizModes.map((mode, index) => {
                              const Icon = mode.icon
                              const isCompleted = index < country.modes_correct
                              return (
                                <div
                                  key={mode.key}
                                  className={`mode-row ${isCompleted ? 'completed' : ''}`}
                                >
                                  <Icon size={14} />
                                  <span className="mode-label">{mode.label}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="continent-list">
                {(['Europa', 'Asia', 'Afrika', 'Nord-Amerika', 'Sør-Amerika', 'Oseania'] as Continent[]).map((continentName) => {
                  const totalCountries = getCountriesByContinent(continentName).length
                  const countriesWithProgress = stats.country_progress?.filter(
                    (c) => normalizeContinent(c.continent) === continentName && c.modes_correct > 0
                  ).length || 0
                  const masteredCountries = stats.country_progress?.filter(
                    (c) => normalizeContinent(c.continent) === continentName && c.is_mastered
                  ).length || 0
                  const progressPercent = Math.round((masteredCountries / totalCountries) * 100)

                  return (
                    <div
                      key={continentName}
                      className="continent-item clickable"
                      onClick={() => setSelectedContinent(continentName)}
                    >
                      <div className="continent-header">
                        <span className="continent-name">{continentName}</span>
                        <span className="continent-count">{masteredCountries}/{totalCountries}</span>
                      </div>
                      <div className="continent-bar">
                        <div
                          className="continent-fill"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="continent-details">
                        {masteredCountries} land mestret · {countriesWithProgress} påbegynt
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="countries-tab">
            {/* Mastered Countries */}
            {stats.mastered_countries && stats.mastered_countries.length > 0 && (
              <div className="stats-section">
                <h3>Mestrede land (alle 4 moduser)</h3>
                <div className="mastered-grid">
                  {stats.mastered_countries.map((country) => (
                    <div key={country.country_code} className="mastered-item">
                      <img src={country.flag_url} alt="" className="country-flag" />
                      <span>{country.country_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Country Progress */}
            <div className="stats-section">
              <h3>Fremgang per land</h3>
              <div className="progress-legend">
                <span>0/4</span>
                <span>1/4</span>
                <span>2/4</span>
                <span>3/4</span>
                <span>4/4</span>
              </div>
              {stats.country_progress && (
                <div className="country-progress-grid">
                  {stats.country_progress.map((country) => (
                    <div
                      key={country.code}
                      className={`progress-item modes-${country.modes_correct}`}
                      title={`${country.name}: ${country.modes_correct}/4 moduser`}
                    >
                      <img src={country.flag_url} alt={country.name} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
