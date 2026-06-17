import { useParams } from 'react-router-dom'
import UserProfile from '../components/UserProfile'

function UserPage() {
  // Key the view by id so it remounts with fresh state when navigating between
  // different profiles.
  const { id } = useParams<{ id: string }>()
  return <UserProfile key={id} id={id ?? ''} />
}

export default UserPage
