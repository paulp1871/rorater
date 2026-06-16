import { Link } from 'react-router-dom'
import type { AuthUser } from '../api/types'
import './HomePage.css'

interface Props {
  user: AuthUser | null
}

function HomePage({ user }: Props) {
  const name = user?.displayName ?? user?.username ?? 'there'

  return (
    <div className="home-page">
      <h1 className="home-title">Welcome back, {name}!</h1>
      <p className="home-sub">You&apos;re signed in with your Roblox account.</p>

      <div className="home-actions">
        <Link to="/search" className="home-action-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <span className="home-action-title">Search Users</span>
            <span className="home-action-desc">Look up Roblox players by username</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
