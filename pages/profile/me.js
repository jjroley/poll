import { useUser } from "../../contexts/AuthContext"


export default function Profile() {
  const { user } = useUser({ redirect: '/login' })
  if(!user) {
    return "Loading..."
  }
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

