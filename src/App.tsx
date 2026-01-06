import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from './components/Menu'
import { Quiz } from './components/Quiz'
import { QuizModeSelector } from './components/QuizModeSelector'
import { Auth } from './components/Auth'
import { Statistics } from './components/Statistics'
import { Header } from './components/Header'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Laster...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/stats" element={<Statistics />} />

          {/* Quiz mode selectors */}
          <Route path="/quiz/continent/:continent" element={<QuizModeSelector />} />
          <Route path="/quiz/all" element={<QuizModeSelector />} />
          <Route path="/quiz/practice" element={<QuizModeSelector />} />

          {/* Quiz routes */}
          <Route path="/quiz/continent/:scopeValue/:mode" element={<Quiz />} />
          <Route path="/quiz/all/:mode" element={<Quiz />} />
          <Route path="/quiz/practice/:mode" element={<Quiz />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
