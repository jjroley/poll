import nextConnect from "next-connect";
import { Poll } from '../../../scripts/schema'
import auth from '../../../scripts/auth'

const app = nextConnect()

app.post(async function(req, res) {
  console.log("Attempted poll creation", req.body)
  
  const authed = await auth(req, res)

  if(!authed) {
    return res.status(403).json({ error: "You aren't logged in"})
  }

  const pollData = req.body
  
  const poll = new Poll({
    title: pollData.title,
    official: authed.role === 'ADMIN',
    options: pollData.options,
    createdBy: authed.id,
  })
  await poll.save()

  console.log(poll)

  res.status(201).json({ success: true, pollId: poll._id })
})

export default app