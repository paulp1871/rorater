import type { RobloxUser, RobloxUserProfile } from './types'

interface UserSearchResponse {
  users: RobloxUser[]
}

interface ApiErrorBody {
  message: string
}

export async function searchUsers(keyword: string): Promise<RobloxUser[]> {
  const res = await fetch(
    `/api/roblox/users/search?keyword=${encodeURIComponent(keyword)}`,
    { credentials: 'include' },
  )

  if (!res.ok) {
    // The API returns { message } for both 400 (validation) and 502 (upstream).
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }

  const data = (await res.json()) as UserSearchResponse
  return data.users
}

export async function getUserProfile(
  id: number | string,
): Promise<RobloxUserProfile> {
  const res = await fetch(`/api/roblox/users/${encodeURIComponent(id)}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    // The API returns { message } for both 400 (validation) and 502 (upstream).
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }

  return (await res.json()) as RobloxUserProfile
}
