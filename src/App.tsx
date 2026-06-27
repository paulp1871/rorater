import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { fetchCurrentUser, logout, startRobloxLogin } from './api/auth'
import type { AuthUser } from './api/types'
import { AuthProvider } from './context/AuthProvider'
import AppLayout from './components/AppLayout'
import RequireAuth from './components/RequireAuth'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import LeaderboardPage from './pages/LeaderboardPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import './styles/base.css'

// Lazy-loaded: these pages pull in Three.js (via UserProfile), which we keep out of
// the main bundle.
const UserPage = lazy(() => import('./pages/UserPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

type AuthState = 'checking' | 'ready'

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
        setAuthState('ready')
      })
      .catch(() => setAuthState('ready'))
  }, [authError])

  async function handleLogout() {
    await logout()
    setUser(null)
  }

  if (authState === 'checking') {
    return <main className="page loading-screen">Loading…</main>
  }

  return (
    <AuthProvider value={{ user, login: startRobloxLogin, logout: handleLogout }}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage authError={authError} />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/users/:id"
              element={
                <Suspense fallback={<p className="loading">Loading…</p>}>
                  <UserPage />
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <Suspense fallback={<p className="loading">Loading…</p>}>
                  <ProfilePage />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
