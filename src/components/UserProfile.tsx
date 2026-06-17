import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserProfile } from '../api/users'
import type { RobloxUserProfile } from '../api/types'
import { useAuth } from '../context/authContext'
import Avatar3DViewer from './Avatar3DViewer'
import RatingControl from './RatingControl'
import './UserProfile.css'

type Status = 'loading' | 'done' | 'error'

function formatRating(value: number | null): string {
  return value === null ? 'No ratings yet' : `${value.toFixed(1)} / 5`
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString()
}

interface Props {
  id: string
}

// Renders a full Roblox user profile by id. Shared by the public /users/:id page
// and the signed-in /profile page.
function UserProfile({ id }: Props) {
  const { user } = useAuth()
  const [status, setStatus] = useState<Status>('loading')
  const [profile, setProfile] = useState<RobloxUserProfile | null>(null)
  const [error, setError] = useState('')
  // Bumped after a rating write to re-fetch the profile and pick up the fresh
  // average / most-recent rating the backend merges in per request.
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!id) return
    let active = true

    getUserProfile(id)
      .then((data) => {
        if (!active) return
        setProfile(data)
        setStatus('done')
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [id, reloadKey])

  const isSelf = profile !== null && user !== null && String(profile.id) === user.robloxUserId

  return (
    <div className="user-page">
      <Link to="/search" className="back-link">
        ← Back to search
      </Link>

      {status === 'loading' && <p className="loading">Loading profile…</p>}
      {status === 'error' && <p className="error">{error}</p>}

      {status === 'done' && profile && (
        <>
          <header className="profile-header">
            <img
              className="avatar avatar-lg"
              src={profile.avatar?.url ?? ''}
              alt={profile.avatar?.url ? `${profile.username} avatar` : ''}
              data-empty={profile.avatar?.url ? undefined : ''}
            />
            <div className="profile-id">
              <h1 className="display-name">
                {profile.displayName}
                {isSelf && <span className="you-marker">(you)</span>}
              </h1>
              <span className="username">@{profile.username}</span>
              <span className="user-id">ID: {profile.id}</span>
              <a
                className="roblox-profile-link"
                href={`https://www.roblox.com/users/${profile.id}/profile`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to ROBLOX Profile ↗
              </a>
            </div>
          </header>

          <section className="profile-section">
            <h2>3D Avatar</h2>
            <p className="disclaimer">Avatar info may be a few hours out of date.</p>
            {profile.avatar3d?.url ? (
              <Avatar3DViewer manifestUrl={profile.avatar3d.url} />
            ) : (
              <p className="muted">3D avatar unavailable.</p>
            )}
          </section>

          <section className="profile-section">
            <h2>Ratings</h2>
            <p className="rating-average">
              Average rating: <strong>{formatRating(profile.averageRating)}</strong>
            </p>
            {profile.mostRecentRating ? (
              <p className="rating-recent">
                Most recent: <strong>{profile.mostRecentRating.score} / 5</strong>{' '}
                on {formatDate(profile.mostRecentRating.createdAt)}
              </p>
            ) : (
              <p className="muted">No ratings yet.</p>
            )}
            {isSelf ? (
              <p className="muted">You can't rate yourself.</p>
            ) : (
              <RatingControl
                userId={String(profile.id)}
                onRated={() => setReloadKey((key) => key + 1)}
              />
            )}
          </section>

          <section className="profile-section">
            <h2>Currently Wearing</h2>
            {profile.currentlyWearing.length === 0 ? (
              <p className="muted">Not wearing any assets.</p>
            ) : (
              <ul className="wearing-list">
                {profile.currentlyWearing.map((item) => (
                  <li key={item.id} className="wearing-item">
                    <span className="wearing-name">{item.name}</span>
                    <span className="wearing-type">{item.assetType.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default UserProfile
