import { Link, useNavigate } from 'react-router-dom'
import { Globe, User, LogOut, BarChart3, Palette } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme, ThemeColor } from '../hooks/useTheme'
import { useState, useRef, useEffect } from 'react'
import './Header.css'

const themes: { key: ThemeColor; label: string; colors: string[] }[] = [
  { key: 'sunset', label: 'Solnedgang', colors: ['#ff6b6b', '#feca57', '#ff9ff3'] },
  { key: 'ocean', label: 'Hav', colors: ['#0abde3', '#48dbfb', '#00d2d3'] },
  { key: 'forest', label: 'Skog', colors: ['#10b981', '#34d399', '#a3e635'] },
  { key: 'purple', label: 'Lilla', colors: ['#8b5cf6', '#a855f7', '#ec4899'] },
]

export function Header() {
  const navigate = useNavigate()
  const { profile, signOut, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setShowProfileMenu(false)
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <div className="logo-icon">
          <Globe size={24} />
        </div>
        <span className="logo-text">LandQuiz</span>
      </Link>

      <div className="header-actions">
        {/* Theme Selector */}
        <div className="theme-selector" ref={themeMenuRef}>
          <button
            className="header-btn theme-btn"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            aria-label="Velg tema"
          >
            <Palette size={20} />
            <div className="theme-preview">
              {themes.find(t => t.key === theme)?.colors.map((color, i) => (
                <span key={i} style={{ background: color }} />
              ))}
            </div>
          </button>
          {showThemeMenu && (
            <div className="dropdown-menu theme-menu">
              {themes.map((t) => (
                <button
                  key={t.key}
                  className={`theme-option ${theme === t.key ? 'active' : ''}`}
                  onClick={() => {
                    setTheme(t.key)
                    setShowThemeMenu(false)
                  }}
                >
                  <div className="theme-colors">
                    {t.colors.map((color, i) => (
                      <span key={i} style={{ background: color }} />
                    ))}
                  </div>
                  <span className="theme-label">{t.label}</span>
                  {theme === t.key && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        {isAuthenticated ? (
          <div className="profile-dropdown" ref={profileMenuRef}>
            <button
              className="header-btn profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User size={20} />
              <span className="profile-name-short">
                {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'B'}
              </span>
            </button>
            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="profile-header">
                  <span className="profile-display-name">
                    {profile?.display_name || profile?.username || 'Bruker'}
                  </span>
                  <span className="profile-email">{profile?.username}</span>
                </div>
                <div className="menu-divider" />
                <Link
                  to="/stats"
                  className="menu-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <BarChart3 size={18} />
                  Statistikk
                </Link>
                <button className="menu-item" onClick={handleSignOut}>
                  <LogOut size={18} />
                  Logg ut
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="header-btn login-btn">
            <User size={20} />
            <span>Logg inn</span>
          </Link>
        )}
      </div>
    </header>
  )
}
