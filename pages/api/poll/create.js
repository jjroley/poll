import nextConnect from "next-connect";
import { Poll } from '../../../scripts/schema'
import auth from '../../../scripts/auth'
import Filter from 'bad-words'
import { uniq } from '../../../lib/helpers'

const wordFilter = new Filter()

const app = nextConnect()

app.post(async function(req, res) {
  try {
    console.log("Attempted poll creation", req.body)
    
    const authed = await auth(req, res)
  
    if(!authed) {
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
    
    const poll = new Poll({
      title: pollData.title,
      official: authed.role === 'ADMIN',
      options: uniq(pollData.options),
      createdBy: authed.replitId,
      votes: [],
      voteCount: 0
    })
    await poll.save()
  
    res.status(201).json(poll)
  }catch(e) {
    console.error("Error creating poll", e)
  }
})

export default app