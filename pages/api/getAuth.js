import { User } from '../../scripts/schema'

export default function handler(req, res) {
  const replitId = req.headers['x-replit-user-id']

  if(!replitId) {
    return res.json(false)
  }
  User.findOne({ replitId }, function(err, user) {
    if(err) {
      res.json(false)
    }
    else {
      res.json({
        name: user.username,
        id: user.replitId,
        image: user.image,
      })
    }
  })
}