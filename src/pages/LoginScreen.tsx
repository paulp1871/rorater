import { useState } from 'react'
import { startRobloxLogin } from '../api/auth'
import './LoginScreen.css'

interface Props {
  authError?: boolean
}

function LoginScreen({ authError = false }: Props) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [hoverStar, setHoverStar] = useState(0)
  const [lockedStar, setLockedStar] = useState(4)

  async function handleSignIn() {
    setPending(true)
    setError('')
    try {
      await startRobloxLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPending(false)
    }
  }

  const displayStar = hoverStar || lockedStar

  return (
    <div className="rr-shell">
      <nav className="rr-nav">
        <a className="rr-logo" href="#">
          <span className="rr-logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 2L14.2 6.5V13.5H3.8V6.5L9 2Z" fill="white" opacity=".9" />
              <rect x="6.5" y="9" width="5" height="4.5" rx="1" fill="white" opacity=".6" />
            </svg>
          </span>
          Ro<strong>Rater</strong>
        </a>

        <div className="rr-nav-links">
          <span className="rr-nav-link active">Rate</span>
          <span className="rr-nav-link">Trending</span>
          <span className="rr-nav-link">Leaderboard</span>
          <span className="rr-nav-link">Community</span>
        </div>

        <div className="rr-nav-right">
          <span className="rr-nav-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" stroke="#5A6880" strokeWidth="1.5" />
              <path d="M10.5 10.5L13 13" stroke="#5A6880" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Search players
          </span>
          <button className="rr-btn-login" type="button" onClick={handleSignIn} disabled={pending}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="12" height="12" rx="2" fill="white" opacity=".9" />
              <rect x="5" y="5" width="6" height="6" rx="1" fill="#1E72F0" />
            </svg>
            {pending ? 'Redirecting…' : 'Log in with ROBLOX'}
          </button>
        </div>
      </nav>

      <main className="rr-hero">
        <div className="rr-hero-copy">
          <h1 className="rr-h1">
            Rate avatars.<br />
            Get rated.<br />
            <span className="rr-hl">Climb the board.</span>
          </h1>

          <p className="rr-sub">
            Log in with your ROBLOX account, drop a 5-star verdict on other players&apos; fits, and watch your own avatar rise up the global leaderboard.
          </p>

          {authError && (
            <p className="rr-error-msg">Sign in was cancelled or failed. Please try again.</p>
          )}
          {error && <p className="rr-error-msg">{error}</p>}

          <div className="rr-cta-row">
            <button className="rr-cta-primary" type="button" onClick={handleSignIn} disabled={pending}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="12" height="12" rx="2" fill="white" opacity=".9" />
                <rect x="5" y="5" width="6" height="6" rx="1" fill="#1E72F0" />
              </svg>
              {pending ? 'Redirecting…' : 'Log in with ROBLOX'}
            </button>
          </div>

          <p className="rr-trust">Free to join · No payment required</p>
        </div>

        <div className="rr-hero-deco">
          <div className="rr-deco-card rr-deco-rate">
            <div className="rr-deco-rate-top">
              <span className="rr-deco-live">rating now</span>
              <span className="rr-deco-rank">Global #128</span>
            </div>

            <div className="rr-avatar-placeholder">
              <div className="rr-mini-fig">
                <div className="rr-fig-head"></div>
                <div className="rr-fig-torso">
                  <div className="rr-fig-arm"></div>
                  <div className="rr-fig-body"></div>
                  <div className="rr-fig-arm"></div>
                </div>
                <div className="rr-fig-legs">
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>

            <div className="rr-deco-uname">@stardust_milo</div>
            <div className="rr-deco-meta">
              <span style={{ color: '#F59E0B' }}>★★★★☆</span>
              4.5 · 1,204 ratings
            </div>

            <div className="rr-star-row">
              <span className="rr-star-label">Your rating</span>
              <div className="rr-tap-stars">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`${v} star${v > 1 ? 's' : ''}`}
                    onMouseEnter={() => setHoverStar(v)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setLockedStar(v)}
                    style={{ color: v <= displayStar ? '#F59E0B' : '#CBD5E1' }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <button className="rr-deco-submit" type="button" onClick={handleSignIn} disabled={pending}>
              {pending ? 'Redirecting…' : 'Log in to rate'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginScreen
