import nextConnect from "next-connect"
import auth from "../../../scripts/auth"
import { Poll } from "../../../lib/schema"

const app = nextConnect()

app.post(async (req, res) => {
  const authed = await auth(req, res)
  if(authed.role !== "ADMIN") {
    return res.json({ error: "Not authorized" })
  }
  if(!req.body.pollId || !req.body.feature) {
    return res.json({ error: "Invalid data" })
  }
  try {
    const poll = await Poll.findById(req.body.pollId)
    poll.official = (
      req.body.feature === 'toggle' ?
      !poll.official :
      !!req.body.feature
    )
    await poll.save()
    res.json({ success: true })
  }catch(e) {
    return res.json({ error: "Poll not found" })
  }
})

export default app