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

// Mirrors the response shape of GET /api/roblox/users/:id.
export interface CurrentlyWearingItem {
  id: number
  name: string
  assetType: { id: number; name: string }
}

// raterId is intentionally absent: the backend omits it from the profile
// payload so viewers can't learn who left the most recent rating.
export interface MostRecentRating {
  score: number
  createdAt: string
}

// Mirrors the rorater-api RatingRecord returned by /api/ratings/users/:userId.
export interface RatingRecord {
  raterId: string
  ratedId: string
  score: number
  createdAt: string
  updatedAt: string
}

export interface RobloxUserProfile {
  id: number
  username: string
  displayName: string
  avatar: UserAvatar | null
  // avatar3d.url points to a JSON manifest (obj/mtl/textures), not an image.
  avatar3d: UserAvatar | null
  currentlyWearing: CurrentlyWearingItem[]
  averageRating: number | null
  mostRecentRating: MostRecentRating | null
}

// Leaderboard user summary. Mirrors the `user` field of each leaderboard entry
// returned by GET /api/leaderboard/top and /recent.
export interface LeaderboardUser {
  id: number
  username: string
  displayName: string
  hasVerifiedBadge: boolean
  avatar: UserAvatar | null
}

// Mirrors an entry of GET /api/leaderboard/top (top-rated over the last 7 days).
export interface TopRatedEntry {
  user: LeaderboardUser
  averageRating: number
  ratingCount: number
}

// Mirrors an entry of GET /api/leaderboard/recent (ordered by most recent rating).
export interface RecentlyRatedEntry {
  user: LeaderboardUser
  lastRatedAt: string
  averageRating: number
  ratingCount: number
}

// Mirrors the session user shape from GET /api/auth/me.
export interface AuthUser {
  robloxUserId: string
  username?: string
  displayName?: string
  avatarUrl?: string | null
}
