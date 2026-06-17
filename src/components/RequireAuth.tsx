import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function RequireAuth() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/?auth_required=1" replace />
  return <Outlet />
}

export default RequireAuth
