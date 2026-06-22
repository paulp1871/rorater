import { useState } from 'react'
import type { FormEvent } from 'react'
import { searchUsers } from '../api/users'
import type { RobloxUser } from '../api/types'
import UserCard from '../components/UserCard'
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
    if (trimmed.length < 3) {
      setError('Enter at least 3 characters to search.')
      setStatus('error')
      return
    }

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
        <p className="disclaimer">
          Showing the top 25 matching usernames. Search results may be a few hours out of date.
        </p>
      )}

      {users.length > 0 && (
        <ul className="results">
          {users.map((u) => (
            <li key={u.id}>
              <UserCard user={u} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default SearchPage
