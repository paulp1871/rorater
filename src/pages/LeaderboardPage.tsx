import { useEffect, useState } from 'react'
import { getRecentlyRated, getTopRated } from '../api/leaderboard'
import type { RecentlyRatedEntry, TopRatedEntry } from '../api/types'
import LeaderboardCard from '../components/LeaderboardCard'
import './LeaderboardPage.css'

type Tab = 'top' | 'recent'
type Status = 'loading' | 'done' | 'error'

// Formats an ISO timestamp as a short relative string, e.g. "3 hours ago".
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''

  const seconds = Math.round((then - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34524, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ]

  let value = seconds
  for (const [amount, unit] of divisions) {
    if (Math.abs(value) < amount) return rtf.format(Math.round(value), unit)
    value /= amount
  }
  return ''
}

function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('top')
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [top, setTop] = useState<TopRatedEntry[]>([])
  const [recent, setRecent] = useState<RecentlyRatedEntry[]>([])

  // The fetch runs in an effect so it reacts to tab changes (including the
  // initial 'top' load on mount). State is reset to 'loading' in the click
  // handler, never synchronously here, so the effect only mutates state from
  // its async callbacks.
  useEffect(() => {
    let cancelled = false

    const load = tab === 'top' ? getTopRated() : getRecentlyRated()
    load
      .then((entries) => {
        if (cancelled) return
        if (tab === 'top') setTop(entries as TopRatedEntry[])
        else setRecent(entries as RecentlyRatedEntry[])
        setStatus('done')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [tab])

  function selectTab(next: Tab) {
    if (next === tab) return
    setTab(next)
    setStatus('loading')
    setError('')
  }

  const entries = tab === 'top' ? top : recent

  return (
    <>
      <h1>Leaderboard</h1>
      <p className="tagline">
        {tab === 'top'
          ? 'Highest rated players over the last 7 days'
          : 'Players sorted by their most recent rating'}
      </p>

      <div className="lb-tabs" role="tablist" aria-label="Leaderboard view">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'top'}
          className={`lb-tab${tab === 'top' ? ' active' : ''}`}
          onClick={() => selectTab('top')}
        >
          Top Rated
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'recent'}
          className={`lb-tab${tab === 'recent' ? ' active' : ''}`}
          onClick={() => selectTab('recent')}
        >
          Recently Rated
        </button>
      </div>

      {status === 'loading' && <p className="loading">Loading…</p>}

      {status === 'error' && <p className="error">{error}</p>}

      {status === 'done' && entries.length === 0 && (
        <p className="empty">
          {tab === 'top'
            ? 'No one has enough ratings to rank yet. Be the first to rate a player!'
            : 'No players have been rated yet. Be the first to rate a player!'}
        </p>
      )}

      {status === 'done' && entries.length > 0 && (
        <ul className="lb-list">
          {tab === 'top'
            ? top.map((entry, i) => (
                <li key={entry.user.id}>
                  <LeaderboardCard
                    rank={i + 1}
                    user={entry.user}
                    averageRating={entry.averageRating}
                    ratingCount={entry.ratingCount}
                  />
                </li>
              ))
            : recent.map((entry, i) => (
                <li key={entry.user.id}>
                  <LeaderboardCard
                    rank={i + 1}
                    user={entry.user}
                    averageRating={entry.averageRating}
                    ratingCount={entry.ratingCount}
                    meta={`rated ${relativeTime(entry.lastRatedAt)}`}
                  />
                </li>
              ))}
        </ul>
      )}
    </>
  )
}

export default LeaderboardPage
