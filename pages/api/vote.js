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

  const user = await User.findOne({ replitId: authed.replitId })

  if(!user) {
    return res.json({ error: "Invalid user id" })
  }

  try {
    const poll = await Poll.findById(req.body.pollId)
    if(poll.votes.find(v => v.uid === authed.replitId)) {
      return res.json({ error: "You can't vote twice" })
    }
    if(poll.options.indexOf(voteData.vote) === -1) {
      return res.json({ error: "Invalid option" })
    }
    poll.votes.push({
      uid: authed.replitId,
      vote: voteData.vote
    })
    poll.voteCount++
    await poll.save()
    res.status(201).json(poll)
  }catch(e) {
    res.json({ error: "Poll does not exist" })
  }
})

export default app