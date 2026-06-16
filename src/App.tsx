import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { fetchCurrentUser, logout } from './api/auth'
import type { AuthUser } from './api/types'
import LoginScreen from './pages/LoginScreen'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import './styles/base.css'

type AuthState = 'checking' | 'authed' | 'anon'

function App() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authError] = useState(() =>
    new URLSearchParams(window.location.search).has('auth_error'),
  )

  useEffect(() => {
    if (authError) {
      window.history.replaceState(null, '', window.location.pathname)
    }

    fetchCurrentUser()
      .then((current) => {
        setUser(current)
        setAuthState(current ? 'authed' : 'anon')
      })
      .catch(() => setAuthState('anon'))
  }, [authError])

  async function handleLogout() {
    await logout()
    setUser(null)
    setAuthState('anon')
  }

  if (authState === 'checking') {
    return <main className="page loading-screen">Loading…</main>
  }

  if (authState === 'anon') {
    return <LoginScreen authError={authError} />
  }

  return (
    <Routes>
      <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
