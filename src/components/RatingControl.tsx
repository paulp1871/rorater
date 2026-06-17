import { useEffect, useState } from 'react'
import { deleteRating, getMyRating, rateUser } from '../api/ratings'
import type { RatingRecord } from '../api/types'
import './RatingControl.css'

type Status = 'loading' | 'ready' | 'error'

const STARS = [1, 2, 3, 4, 5]

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString()
}

interface Props {
  userId: string
  // Called after a successful rate/remove so the parent can re-fetch the
  // profile and refresh the displayed average / most-recent rating.
  onRated: () => void
}

// Star picker letting the signed-in user rate (or re-rate / remove their rating
// of) another user. Self-rating is gated by the caller, not here.
function RatingControl({ userId, onRated }: Props) {
  const [status, setStatus] = useState<Status>('loading')
  const [rating, setRating] = useState<RatingRecord | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getMyRating(userId)
      .then((data) => {
        if (!active) return
        setRating(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [userId])

  async function submit(score: number) {
    setBusy(true)
    setError('')
    try {
      const updated = await rateUser(userId, score)
      setRating(updated)
      onRated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    setBusy(true)
    setError('')
    try {
      await deleteRating(userId)
      setRating(null)
      onRated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading') {
    return <p className="muted">Loading your rating…</p>
  }

  // The filled baseline is the hovered star while hovering, otherwise the saved
  // score. Falls back to 0 (no stars filled) when neither is set.
  const filled = hovered ?? rating?.score ?? 0

  return (
    <div className="rating-control">
      <div
        className="star-row"
        onMouseLeave={() => setHovered(null)}
        role="radiogroup"
        aria-label="Your rating"
      >
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            className="star"
            data-filled={star <= filled ? '' : undefined}
            disabled={busy}
            onMouseEnter={() => setHovered(star)}
            onClick={() => submit(star)}
            role="radio"
            aria-checked={rating?.score === star}
            aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
          >
            ★
          </button>
        ))}
      </div>

      {rating ? (
        <p className="rating-control-meta">
          You rated this user {rating.score} / 5 on {formatDate(rating.updatedAt)}.{' '}
          <button
            type="button"
            className="remove-rating"
            disabled={busy}
            onClick={remove}
          >
            Remove rating
          </button>
        </p>
      ) : (
        <p className="muted">Click a star to rate this user.</p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default RatingControl
