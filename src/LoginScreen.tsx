import { useState } from 'react'
import { startRobloxLogin } from './api'

interface LoginScreenProps {
  authError?: boolean
}

function LoginScreen({ authError = false }: LoginScreenProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <main className="login">
      <div className="login-card">
        <h1>RoRater</h1>
        <p className="tagline">Sign in with your Roblox account to search users.</p>

        {authError && (
          <p className="error">Sign in was cancelled or failed. Please try again.</p>
        )}
        {error && <p className="error">{error}</p>}

        <button
          type="button"
          className="roblox-button"
          onClick={handleSignIn}
          disabled={pending}
        >
          <svg
            className="roblox-glyph"
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              x="18"
              y="18"
              width="64"
              height="64"
              rx="6"
              transform="rotate(12 50 50)"
              fill="currentColor"
            />
            <rect x="40" y="40" width="20" height="20" rx="2" fill="#fff" />
          </svg>
          {pending ? 'Redirecting…' : 'Sign in with Roblox'}
        </button>
      </div>
    </main>
  )
}

export default LoginScreen
