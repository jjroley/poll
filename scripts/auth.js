import { User } from '../lib/schema'


export default function auth(req, res) {
  return new Promise(async resolve => {
    const replitId = req.headers['x-replit-user-id']
    const loggedOutUser = { loggedIn: false }
    if(!replitId) return resolve(loggedOutUser)
  
    const user = await User.findOne({ replitId })
    
    if(!user) return resolve(loggedOutUser)
  
    resolve({ ...user, loggedIn: true })
  })
}