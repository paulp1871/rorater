import type { AuthUser } from './types'

// Starts the server-driven OAuth flow, then hands the browser to Roblox.
export async function startRobloxLogin(): Promise<never> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Could not start Roblox login')
  const { authorizationUrl } = (await res.json()) as { authorizationUrl: string }
  window.location.href = authorizationUrl
  // The page is navigating away; never resolve so callers stay in their pending state.
  return new Promise<never>(() => {})
}

// Returns the signed-in user, or null when there is no valid session (401).
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Could not load session')
  const { user } = (await res.json()) as { user: AuthUser }
  return user
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}
