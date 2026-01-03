import { useState, useEffect } from 'react'
import { getUserStatistics, UserStatistics } from '../lib/quizApi'
import { useAuth } from '../hooks/useAuth'
import './Statistics.css'

interface StatisticsProps {
  onBack: () => void
}

export function Statistics({ onBack }: StatisticsProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'continents' | 'countries'>('overview')

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
        <button className="back-button" onClick={onBack}>
          ← Tilbake
        </button>
        <h2>Statistikk</h2>
        <p className="no-data">Du har ikke spilt noen quizer enda. Start en quiz for a se statistikk!</p>
      </div>
    )
  }

  return (
    <div className="statistics">
      <button className="back-button" onClick={onBack}>
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
            {stats.best_countries && stats.best_countries.length > 0 && (
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
            )}

            {/* Worst Countries */}
            {stats.worst_countries && stats.worst_countries.length > 0 && (
              <div className="stats-section">
                <h3>Land du kan ove pa</h3>
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
            {stats.continents && stats.continents.length > 0 ? (
              <div className="continent-list">
                {stats.continents.map((continent) => (
                  <div key={continent.continent} className="continent-item">
                    <div className="continent-header">
                      <span className="continent-name">{continent.continent}</span>
                      <span className="continent-accuracy">{continent.accuracy_percent}%</span>
                    </div>
                    <div className="continent-bar">
                      <div
                        className="continent-fill"
                        style={{ width: `${continent.accuracy_percent}%` }}
                      />
                    </div>
                    <span className="continent-details">
                      {continent.correct_count} / {continent.total_attempts} riktige
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Ingen data enda</p>
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
