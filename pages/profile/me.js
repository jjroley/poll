import { useUser } from '../../lib/hooks/useUser'

export default function Profile() {
  const { user } = useUser({ redirectTo: '/login' })
  if(!user) return null
  return (
    <div>
      { user.username }
      <br />
      { user.id }
      <br />
      { user.image }
    </div>
  )
}

