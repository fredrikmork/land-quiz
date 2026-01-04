import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from './components/Menu'
import { Quiz } from './components/Quiz'
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
          <Route path="/quiz/:mode" element={<Quiz />} />
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
