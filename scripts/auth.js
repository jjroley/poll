import { User } from '../lib/schema'


export default function auth(req, res) {
  return new Promise(async resolve => {
    const replitId = req.headers['x-replit-user-id']
    if(!replitId) return resolve(false)
  
    const user = await User.findOne({ replitId })
    
    if(!user) return resolve(false)
  
    resolve(user)
  })
}