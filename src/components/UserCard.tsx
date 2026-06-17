import { Link } from 'react-router-dom'
import type { RobloxUser } from '../api/types'
import './UserCard.css'

interface Props {
  user: RobloxUser
}

// A single user result card linking to that user's profile. Reused by search and
// any future user-list section (leaderboard, trending, recently rated).
function UserCard({ user }: Props) {
  const avatarUnavailable =
    !user.avatar || user.avatar.state === 'Blocked' || user.avatar.url === null

  return (
    <Link to={`/users/${user.id}`} className="card">
      <img
        className="avatar"
        src={user.avatar?.url ?? ''}
        alt={user.avatar?.url ? `${user.username} avatar` : ''}
        data-empty={user.avatar?.url ? undefined : ''}
      />
      <div className="info">
        <span className="name">
          {user.displayName}
          {user.hasVerifiedBadge && (
            <span className="badge" title="Verified">
              ✓
            </span>
          )}
        </span>
        <span className="username">@{user.username}</span>
        {avatarUnavailable && (
          <span className="avatar-unavailable">Avatar info unavailable</span>
        )}
      </div>
    </Link>
  )
}

export default UserCard
