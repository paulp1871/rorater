import { Outlet, Link, useLocation } from 'react-router-dom'
import type { AuthUser } from '../api/types'
import './AppLayout.css'

interface Props {
  user: AuthUser | null
  onLogout: () => void
}

function AppLayout({ user, onLogout }: Props) {
  const location = useLocation()

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
        <nav className="app-nav">
          <Link
            to="/"
            className={`app-nav-link${location.pathname === '/' ? ' active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`app-nav-link${location.pathname === '/search' ? ' active' : ''}`}
          >
            Search
          </Link>
        </nav>
        <button type="button" className="logout-button" onClick={onLogout}>
          Log out
        </button>
      </header>
      <Outlet />
    </main>
  )
}

export default AppLayout
