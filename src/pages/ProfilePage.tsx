import UserProfile from '../components/UserProfile'
import { useAuth } from '../context/authContext'

function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null
  return <UserProfile id={user.robloxUserId} />
}

export default ProfilePage
