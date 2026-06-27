import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import './AppLayout.css'

function AppLayout() {
  const { user, login, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function guardedNav(path: string) {
    if (!user) {
      navigate('/?auth_required=1')
    } else {
      navigate(path)
    }
  }

  return (
    <main className="page">
      <header className="app-header">
        {user && (
          <div className="app-user">
            <img
              className="app-avatar"
              src={user.avatarUrl ?? ''}
              alt={user.avatarUrl ? `${user.username ?? 'User'} avatar` : ''}
              data-empty={user.avatarUrl ? undefined : ''}
            />
            <span className="app-name">
              {user.displayName ?? user.username ?? 'Signed in'}
            </span>
          </div>
        )}
        <nav className="app-nav">
          <Link
            to="/"
            className={`app-nav-link${location.pathname === '/' ? ' active' : ''}`}
          >
            Home
          </Link>
          <button
            type="button"
            className={`app-nav-link${location.pathname === '/search' ? ' active' : ''}`}
            onClick={() => guardedNav('/search')}
          >
            Search
          </button>
          <Link
            to="/leaderboard"
            className={`app-nav-link${location.pathname === '/leaderboard' ? ' active' : ''}`}
          >
            Leaderboard
          </Link>
          <button
            type="button"
            className={`app-nav-link${location.pathname === '/profile' ? ' active' : ''}`}
            onClick={() => guardedNav('/profile')}
          >
            Profile
          </button>
        </nav>
        {user ? (
          <button type="button" className="logout-button" onClick={logout}>
            Log out
          </button>
        ) : (
          <button type="button" className="logout-button" onClick={login}>
            Log in with ROBLOX
          </button>
        )}
      </header>
      <Outlet />
      <footer className="app-footer">
        <Link to="/terms" className="app-footer-link">
          Terms of Service
        </Link>
        <Link to="/privacy" className="app-footer-link">
          Privacy Policy
        </Link>
      </footer>
    </main>
  )
}

export default AppLayout
