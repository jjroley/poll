import nextConnect from 'next-connect'
import { User } from '../../scripts/schema'

const app = nextConnect()

app.post(async (req, res) => {
  try {
    const replitId = req.headers['x-replit-user-id']
    if (!replitId) {
      return res.json({ error: 'Not authenticated' })
    }
    const username = req.headers['x-replit-user-name']
  
    const userExists = await User.findOne({ replitId })
  
    if (!userExists) {
      const newUser = new User({
        replitId,
        username
      })
      await newUser.save((err, data) => {
        if (err) {
          return res.json({ error: "Creation of user failed" })
        }
        res.json({ message: "User created" })
      })
      return
    }
    res.json({ message: "User logged in" })
  }catch(e) {
    console.error("Error logging in", e)
  }
})


export default app
