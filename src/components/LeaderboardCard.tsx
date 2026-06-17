import { Link } from 'react-router-dom'
import type { LeaderboardUser } from '../api/types'
import './LeaderboardCard.css'

interface Props {
  rank: number
  user: LeaderboardUser
  averageRating: number
  ratingCount: number
  // Optional trailing note, e.g. "rated 2 hours ago" on the recent board.
  meta?: string
}

// A single ranked leaderboard row. Mirrors UserCard's layout but adds a rank
// badge and the rating stats. Reused by both leaderboard tabs.
function LeaderboardCard({ rank, user, averageRating, ratingCount, meta }: Props) {
  const avatarUnavailable =
    !user.avatar || user.avatar.state === 'Blocked' || user.avatar.url === null

  return (
    <Link to={`/users/${user.id}`} className="lb-card">
      <span className="lb-rank">{rank}</span>
      <img
        className="lb-avatar"
        src={user.avatar?.url ?? ''}
        alt={user.avatar?.url ? `${user.username} avatar` : ''}
        data-empty={user.avatar?.url ? undefined : ''}
      />
      <div className="lb-info">
        <span className="lb-name">
          {user.displayName}
          {user.hasVerifiedBadge && (
            <span className="lb-badge" title="Verified">
              ✓
            </span>
          )}
        </span>
        <span className="lb-username">@{user.username}</span>
        {avatarUnavailable && (
          <span className="lb-unavailable">Avatar info unavailable</span>
        )}
      </div>
      <div className="lb-stats">
        <span className="lb-score">
          {averageRating.toFixed(1)}
          <span className="lb-score-max"> / 5</span>
        </span>
        <span className="lb-count">
          {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
        </span>
        {meta && <span className="lb-meta">{meta}</span>}
      </div>
    </Link>
  )
}

export default LeaderboardCard
