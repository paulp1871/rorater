import type { RecentlyRatedEntry, TopRatedEntry } from './types'

interface TopRatedResponse {
  entries: TopRatedEntry[]
}

interface RecentlyRatedResponse {
  entries: RecentlyRatedEntry[]
}

interface ApiErrorBody {
  message: string
}

async function readError(res: Response): Promise<Error> {
  const body = (await res.json().catch(() => null)) as ApiErrorBody | null
  return new Error(body?.message ?? `Request failed (${res.status})`)
}

// Top-rated users over the last 7 days (min 3 ratings to qualify).
export async function getTopRated(limit = 20): Promise<TopRatedEntry[]> {
  const res = await fetch(`/api/leaderboard/top?limit=${limit}`, {
    credentials: 'include',
  })

  if (!res.ok) throw await readError(res)

  const data = (await res.json()) as TopRatedResponse
  return data.entries
}

// Users ordered by their most recently received rating.
export async function getRecentlyRated(limit = 20): Promise<RecentlyRatedEntry[]> {
  const res = await fetch(`/api/leaderboard/recent?limit=${limit}`, {
    credentials: 'include',
  })

  if (!res.ok) throw await readError(res)

  const data = (await res.json()) as RecentlyRatedResponse
  return data.entries
}
