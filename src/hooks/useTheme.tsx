import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeColor = 'sunset' | 'ocean' | 'forest' | 'purple'

interface ThemeContextType {
  theme: ThemeColor
  setTheme: (theme: ThemeColor) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('theme-color')
    return (saved as ThemeColor) || 'sunset'
  })

  useEffect(() => {
    localStorage.setItem('theme-color', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
