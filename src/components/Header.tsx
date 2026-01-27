import { Link, useNavigate } from 'react-router-dom'
import { Globe, User, LogOut, BarChart3, Palette, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme, ThemeColor } from '../hooks/useTheme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const themes: { key: ThemeColor; label: string; colors: string[] }[] = [
  { key: 'sunset', label: 'Miami Vice', colors: ['#ff1493', '#00ffff', '#9400d3'] },
  { key: 'ocean', label: 'Hav', colors: ['#0abde3', '#48dbfb', '#00d2d3'] },
  { key: 'forest', label: 'Skog', colors: ['#10b981', '#34d399', '#a3e635'] },
  { key: 'purple', label: 'Lilla', colors: ['#8b5cf6', '#a855f7', '#ec4899'] },
]

export function Header() {
  const navigate = useNavigate()
  const { profile, signOut, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-8 justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group rounded-md p-1 hover:bg-accent/10 transition-colors">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-main rounded-md text-white transition-transform group-hover:scale-105">
            <Globe size={24} />
          </div>
          <span className="text-lg md:text-xl font-bold bg-gradient-main bg-clip-text text-transparent">
            LandQuiz
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Velg tema">
                <Palette
                  size={20}
                  style={{ color: themes.find(t => t.key === theme)?.colors[0] }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {themes.map((t) => (
                <DropdownMenuItem
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {t.colors.map((color, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <span>{t.label}</span>
                  </div>
                  {theme === t.key && <Check size={16} className="text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Statistics (only when logged in) */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" asChild aria-label="Statistikk">
              <Link to="/stats">
                <BarChart3 size={20} className="text-primary" />
              </Link>
            </Button>
          )}

          {/* Profile / Login */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Profilmeny">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-main text-white text-sm">
                      {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'B'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 flex flex-col gap-1">
                  <span className="font-semibold text-foreground">
                    {profile?.display_name || profile?.username || 'Bruker'}
                  </span>
                  <span className="text-xs text-muted-foreground">{profile?.username}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut size={18} />
                  Logg ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <User size={20} />
                <span>Logg inn</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
