// Shared API response shapes. Mirrors the rorater-api backend.

// Mirrors the response shape of GET /api/roblox/users/search.
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

// Mirrors the session user shape from GET /api/auth/me.
export interface AuthUser {
  robloxUserId: string
  username?: string
  displayName?: string
  avatarUrl?: string | null
}
