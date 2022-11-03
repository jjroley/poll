import nextConnect from "next-connect"
import { Poll, User } from '../../lib/schema'
import auth from '../../scripts/auth'

const app = nextConnect()

app.post(async (req, res) => {
  const authed = await auth(req, res)

  if(!authed.loggedIn) {
    return res.json({ error: "You are not logged in" })
  }

  const voteData = req.body
  const voteIndex = Number(voteData.index)

  if(isNaN(voteIndex)) {
    return res.json({ error: "Invalid vote data" })
  }

  const user = await User.findOne({ replitId: authed.replitId })

  if(!user) {
    return res.json({ error: "Not logged in" })
  }

  try {
    const poll = await Poll.findById(req.body.pollId)
    if(voteIndex < 0 || voteIndex >= poll.options.length) {
      return res.json({ error: "Invalid vote" })
    }
    if(poll.votes.find(v => v.uid === authed.replitId)) {
      return res.json({ error: "You can't vote twice" })
    }
    poll.votes.push({
      uid: authed.replitId,
      index: voteIndex
    })
    poll.voteCount++
    await poll.save()
    res.status(201).json(poll)
  }catch(e) {
    res.json({ error: "Poll does not exist" })
  }
})

export default app