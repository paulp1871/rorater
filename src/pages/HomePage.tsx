import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import './HomePage.css'

interface Props {
  authError?: boolean
}

function HomePage({ authError = false }: Props) {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const authRequired = searchParams.has('auth_required')
  const [bannerDismissed, setBannerDismissed] = useState(false)

  function dismissBanner() {
    setBannerDismissed(true)
    setSearchParams({}, { replace: true })
  }

  const showBanner = (authRequired || authError) && !bannerDismissed

  let title: string
  let subtitle: string
  let titleScale = 1

  if (user) {
    const name = user.displayName ?? user.username ?? 'there'
    title = `Welcome back, ${name}!`
    // Scale the title down as the full greeting gets longer so it never wraps.
    titleScale = Math.min(1, 22 / title.length)
    subtitle = 'You\'re signed in with your Roblox account.'
  } else {
    title = 'Welcome to RoRater!'
    subtitle = 'Rate Roblox avatars, climb the leaderboard.'
  }

  function handleSearchClick() {
    if (!user) {
      navigate('/?auth_required=1')
    } else {
      navigate('/search')
    }
  }

  return (
    <div className="home-page">
      {showBanner && (
        <div className="home-auth-banner">
          <span>You need to log in to access that page.</span>
          <button type="button" className="home-auth-login" onClick={login}>
            Log in with ROBLOX
          </button>
          <button type="button" className="home-auth-dismiss" onClick={dismissBanner} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      <h1 className="home-title" style={{ fontSize: `calc(var(--home-title-size) * ${titleScale})` }}>
        {title}
      </h1>
      <p className="home-sub">{subtitle}</p>

      <div className="home-actions">
        <button type="button" className="home-action-card" onClick={handleSearchClick}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <span className="home-action-title">Search Users</span>
            <span className="home-action-desc">Look up Roblox players by username</span>
          </div>
        </button>
        <Link to="/leaderboard" className="home-action-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 20V11M12 20V4M18 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <span className="home-action-title">Leaderboard</span>
            <span className="home-action-desc">See the top rated and recently rated players</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
