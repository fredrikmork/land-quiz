import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from './components/Menu'
import { Quiz } from './components/Quiz'
import { Auth } from './components/Auth'
import { Statistics } from './components/Statistics'
import { useAuth } from './hooks/useAuth'
import './App.css'

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="app">
        <p className="loading">Laster...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/stats" element={<Statistics />} />
      <Route path="/quiz/:mode" element={<Quiz />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
