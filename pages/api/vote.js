import nextConnect from "next-connect"
import { Poll, User } from '../../scripts/schema'
import auth from '../../scripts/auth'

const app = nextConnect()

app.post(async (req, res) => {
  const authed = await auth(req, res)

  if(!authed) {
    return res.json({ error: "You are not logged in" })
  }

  const voteData = req.body

  const user = await User.findOne({ replitId: authed.id })

  if(!user) {
    return res.json({ error: "Invalid user id" })
  }

  try {
    const poll = await Poll.findById(req.body.pollId)
    if(poll.votes.find(v => v.uid === authed.id)) {
      return res.json({ error: "You can't vote twice" })
    }
    if(poll.options.indexOf(voteData.vote) === -1) {
      return res.json({ error: "Invalid option" })
    }
    poll.votes.push([voteData.vote, authed.id, Date.now()])
    await poll.save()
    res.status(201).json({ success: true })
  }catch(e) {
    res.json({ error: "Poll does not exist" })
  }
})

export default app