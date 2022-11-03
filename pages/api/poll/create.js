import nextConnect from "next-connect";
import { Poll } from '../../../lib/schema'
import auth from '../../../scripts/auth'
import Filter from 'bad-words'
import { pollIsInvalid } from '../../../lib/helpers'

const wordFilter = new Filter()

const app = nextConnect()

app.post(async function(req, res) {
  
  const authed = await auth(req, res)

  if(!authed.loggedIn) {
    return res.status(403).json({ error: "You aren't logged in"})
  }

  const polls = await Poll.find({ createdBy: authed.replitId })

  if(polls && polls.length >= authed.permissions.maxPolls && authed.role !== 'ADMIN') {
    return res.json({
      error: `You are only allowed to make up to ${authed.permissions.maxPolls} polls.`
    })
  }

  const pollData = req.body

  if(
    wordFilter.isProfane(pollData.title) ||
    pollData.options.find(o => wordFilter.isProfane(o))
  ) {
    return res.json({ error: "Please, no profanity." })
  }

  const invalid = pollIsInvalid({ title: pollData.title, options: pollData.options })

  if(invalid.error) {
    return res.json({ error: invalid.error })
  }
  
  const poll = new Poll({
    title: pollData.title,
    official: authed.role === 'ADMIN',
    options: pollData.options.filter(o => !!o),
    createdBy: authed.replitId,
    votes: [],
    voteCount: 0
  })
  await poll.save()

  res.status(201).json(poll)
})

export default app