import { createContext, useContext } from 'react'
import type { AuthUser } from '../api/types'

export interface AuthContextValue {
  user: AuthUser | null
  login: () => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
