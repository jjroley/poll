import { Poll } from '../../../lib/schema'
import nextConnect from 'next-connect'

const app = nextConnect()

app.get(async (req, res) => {

  if (req.query.id) {
    try {
      const poll = await Poll.findById(req.query.id)
      res.json(poll)
    }catch(e) {
      res.json(false)
    }
    return
  }

  let filter = {}

  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy
  }

  if (req.query.official && req.query.official === 'true') {
    filter.official = true
  }

  if (req.query.keyword) {
    filter.title = {
      $regex: req.query.keyword,
      $options: 'i'
    }
  }

  const query = Poll.find(filter)

  if (req.query.sort) {
    if (req.query.sort === 'new') {
      query.sort({
        createdAt: req.query?.asc === 'true' ? 1 : -1
      })
    }
    else if (req.query.sort === 'top') {
      query.sort({
        voteCount: req.query?.asc === 'true' ? 1 : -1
      })
    }
  }

  if(req.query.skip) {
    const skipAmt = Number(req.query.skip)
    query.skip(isNaN(skipAmt) ? 0 : skipAmt)
  }

  if (req.query.limit) {
    const limit = Number(req.query.limit)
    !isNaN(limit) && query.limit(limit)
  }

  res.json(await query.exec())
})

export default app