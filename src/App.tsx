import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from './components/Menu'
import { Header } from './components/Header'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'

// Lazy load heavy components
const Quiz = lazy(() => import('./components/Quiz').then(m => ({ default: m.Quiz })))
const QuizModeSelector = lazy(() => import('./components/QuizModeSelector').then(m => ({ default: m.QuizModeSelector })))
const Auth = lazy(() => import('./components/Auth').then(m => ({ default: m.Auth })))
const Statistics = lazy(() => import('./components/Statistics').then(m => ({ default: m.Statistics })))

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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
