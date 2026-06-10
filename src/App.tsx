import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { fetchCurrentUser, logout, searchUsers } from './api'
import type { AuthUser, RobloxUser } from './api'
import LoginScreen from './LoginScreen'
import './App.css'

type Status = 'idle' | 'loading' | 'done' | 'error'
type AuthState = 'checking' | 'authed' | 'anon'

function App() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [user, setUser] = useState<AuthUser | null>(null)
  // The backend redirects here with ?auth_error=1 when a login attempt fails.
  const [authError] = useState(() =>
    new URLSearchParams(window.location.search).has('auth_error'),
  )

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [users, setUsers] = useState<RobloxUser[]>([])
  const [error, setError] = useState('')

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

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const trimmed = keyword.trim()
    if (!trimmed) return

    setStatus('loading')
    setError('')
    try {
      const results = await searchUsers(trimmed)
      setUsers(results)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (authState === 'checking') {
    return <main className="page loading-screen">Loading…</main>
  }

  if (authState === 'anon') {
    return <LoginScreen authError={authError} />
  }

  return (
    <main className="page">
      <header className="app-header">
        <div className="app-user">
          <img
            className="app-avatar"
            src={user?.avatarUrl ?? ''}
            alt={user?.avatarUrl ? `${user.username ?? 'User'} avatar` : ''}
            data-empty={user?.avatarUrl ? undefined : ''}
          />
          <span className="app-name">
            {user?.displayName ?? user?.username ?? 'Signed in'}
          </span>
        </div>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <h1>RoRater</h1>
      <p className="tagline">Search Roblox users</p>

      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by username…"
          aria-label="Search by username"
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'error' && <p className="error">{error}</p>}

      {status === 'done' && users.length === 0 && (
        <p className="empty">No users found.</p>
      )}

      {users.length > 0 && (
        <ul className="results">
          {users.map((user) => (
            <li key={user.id} className="card">
              <img
                className="avatar"
                src={user.avatar?.url ?? ''}
                alt={user.avatar?.url ? `${user.username} avatar` : ''}
                data-empty={user.avatar?.url ? undefined : ''}
              />
              <div className="info">
                <span className="name">
                  {user.displayName}
                  {user.hasVerifiedBadge && (
                    <span className="badge" title="Verified">
                      ✓
                    </span>
                  )}
                </span>
                <span className="username">@{user.username}</span>
                {/* {user.previousUsernames.length > 0 && (
                  <span className="previous">
                    aka {user.previousUsernames.join(', ')}
                  </span>
                )} */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
