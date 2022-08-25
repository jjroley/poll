import { Poll } from '../../../scripts/schema'

export default async function handler(req, res) {
  console.log('querying for polls', req.query)
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

  console.log(filter)

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

  if (req.query.limit) {
    const limit = Number(req.query.limit)
    !isNaN(limit) && query.limit(limit)
  }

  const data = await query.exec()
  res.json(data)
}