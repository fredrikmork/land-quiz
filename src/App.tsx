import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from './components/Menu'
import { Quiz } from './components/Quiz'
import { QuizModeSelector } from './components/QuizModeSelector'
import { Auth } from './components/Auth'
import { Statistics } from './components/Statistics'
import { Header } from './components/Header'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import './App.css'

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Laster...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
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
