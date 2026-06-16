import { useState } from 'react'
import type { FormEvent } from 'react'
import { searchUsers } from '../api/users'
import type { RobloxUser } from '../api/types'
import './SearchPage.css'

type Status = 'idle' | 'loading' | 'done' | 'error'

function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [users, setUsers] = useState<RobloxUser[]>([])
  const [error, setError] = useState('')

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const trimmed = keyword.trim()
    if (!trimmed) return

    setStatus('loading')
    setError('')
    setUsers([])
    try {
      const results = await searchUsers(trimmed)
      setUsers(results)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <>
      <h1>Search Users</h1>
      <p className="tagline">Search Roblox players by username</p>

      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by username…"
          aria-label="Search by username"
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'error' && <p className="error">{error}</p>}

      {status === 'done' && users.length === 0 && (
        <p className="empty">No users found.</p>
      )}

      {users.length > 0 && (
        <p className="disclaimer">Showing the top 25 matching usernames.</p>
      )}

      {users.length > 0 && (
        <ul className="results">
          {users.map((u) => (
            <li key={u.id} className="card">
              <img
                className="avatar"
                src={u.avatar?.url ?? ''}
                alt={u.avatar?.url ? `${u.username} avatar` : ''}
                data-empty={u.avatar?.url ? undefined : ''}
              />
              <div className="info">
                <span className="name">
                  {u.displayName}
                  {u.hasVerifiedBadge && (
                    <span className="badge" title="Verified">
                      ✓
                    </span>
                  )}
                </span>
                <span className="username">@{u.username}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default SearchPage
