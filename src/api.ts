// Mirrors the response shape of GET /api/roblox/users/search in rorater-api.

export interface UserAvatar {
  url: string | null
  state: string
}

export interface RobloxUser {
  id: number
  username: string
  displayName: string
  hasVerifiedBadge: boolean
  previousUsernames: string[]
  avatar: UserAvatar | null
}

interface UserSearchResponse {
  users: RobloxUser[]
}

interface ApiErrorBody {
  message: string
}

// Mirrors the session user shape from GET /api/auth/me in rorater-api.
export interface AuthUser {
  robloxUserId: string
  username?: string
  displayName?: string
  avatarUrl?: string | null
}

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

export async function searchUsers(keyword: string): Promise<RobloxUser[]> {
  const res = await fetch(
    `/api/roblox/users/search?keyword=${encodeURIComponent(keyword)}`,
  )

  if (!res.ok) {
    // The API returns { message } for both 400 (validation) and 502 (upstream).
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }

  const data = (await res.json()) as UserSearchResponse
  return data.users
}
