import nextConnect from "next-connect";
import auth from '../../../scripts/auth'
import { Poll } from '../../../lib/schema'

const app = nextConnect()

app.delete(async (req, res) => {

  if(!req.query.id) {
    return res.json({ error: 'ID must be specified' })
  }
  
  const authed = await auth(req, res)
  if(!authed) {
    return res.json({ error: 'Not authenticated' })
  }
  

  try {
    const poll = await Poll.findById(req.query.id)
    if(authed.role !== "ADMIN" && poll.createdBy !== authed.replitId) {
      return res.json({ error: "You can't delete someone else's poll"})
    }
  }catch(e) {
    return res.json({ error: "Failed to find poll" })
  }

  try {
    const poll = await Poll.findByIdAndDelete(req.query.id)
    res.json({ success: true })
  }catch(e) {
    res.json({ error: "Failed to delete" })
  }
})

export default app