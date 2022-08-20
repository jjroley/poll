import { User } from './schema'


export function authProps({ req, res }) {
  const replitId = req.headers['x-replit-user-id']
  const user = await User.findOne({ replitId })
  if(!user) return { user: null }
  return {
    username: user.username,
    id: user.replitId,
    image: user.image,
    role: user.role
  }
}