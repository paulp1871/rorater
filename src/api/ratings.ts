import type { RatingRecord } from './types'

interface RatingResponse {
  rating: RatingRecord | null
}

interface ApiErrorBody {
  message: string
}

async function readError(res: Response): Promise<Error> {
  // The API returns { message } for validation (400), self-rating (400) and
  // not-found (404) cases.
  const body = (await res.json().catch(() => null)) as ApiErrorBody | null
  return new Error(body?.message ?? `Request failed (${res.status})`)
}

// The signed-in user's own rating of userId, or null if they haven't rated yet.
export async function getMyRating(
  userId: number | string,
): Promise<RatingRecord | null> {
  const res = await fetch(`/api/ratings/users/${encodeURIComponent(userId)}`, {
    credentials: 'include',
  })

  if (!res.ok) throw await readError(res)

  const data = (await res.json()) as RatingResponse
  return data.rating
}

// Creates or updates the signed-in user's rating (idempotent upsert).
export async function rateUser(
  userId: number | string,
  score: number,
): Promise<RatingRecord> {
  const res = await fetch(`/api/ratings/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  })

  if (!res.ok) throw await readError(res)

  const data = (await res.json()) as { rating: RatingRecord }
  return data.rating
}

// Removes the signed-in user's rating. The API responds 204 on success.
export async function deleteRating(userId: number | string): Promise<void> {
  const res = await fetch(`/api/ratings/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) throw await readError(res)
}
