import { Poll } from '../../scripts/schema'
import nextConnect from 'next-connect'


const app = nextConnect()

app.post(async function(req, res) {

  // const replitId = req.headers['x-replit-user-id']
  // if(!replitId) {
  //   return res.status(403).json({ message: "You must be logged in to create a poll" })
  // }

  // const poll = new Poll({
    
  // })
})

export default app
