import nextConnect from 'next-connect'
import { User } from '../../scripts/schema'

const app = nextConnect()

app.post(async (req, res) => {
  const replitId = req.headers['x-replit-user-id']
  if(!replitId) {
    return res.json({ error: 'Not authenticated' })
  }
  const username = req.headers['x-replit-user-name']

  const userExists = await User.findOne({ replitId })

  if(!userExists) {
    const newUser = new User({
      replitId,
      username,
      role: 'DEFAULT'
    })
    await newUser.save()
    res.status(200).json({ message: "User created" })
    return
  }
  res.status(200).json({ message: "User logged in" })
})


export default app
// export default async function handler(req, res) {
//   const replitId = req.headers['x-replit-user-id']
//   if(!replitId) {
//     return res.json({ error: 'Not authenticated' })
//   }
//   const username = req.headers['x-replit-user-name']

//   const userExists = await User.findOne({ replitId })

//   if(!userExists) {
//     const newUser = new User({
//       replitId,
//       username,
//       role: 'DEFAULT'
//     })
//     await newUser.save()
//     res.status(200).json({ message: "User created" })
//     return
//   }
//   res.status(200).json({ message: "User logged in" })
// }