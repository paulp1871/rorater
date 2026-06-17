import type { ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './authContext'

interface Props {
  value: AuthContextValue
  children: ReactNode
}

export function AuthProvider({ value, children }: Props) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
