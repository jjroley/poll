import { Poll } from '../../../scripts/schema'

export default async function handler(req, res) {
  try {
    if (req.query.id) {
      Poll.findById(req.query.id, function(err, data) {
        if (err) return res.status(404).json({ error: err })
        res.status(200).json(data)
      })
      return
    }
  
    let filter = {}
  
    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy
    }
  
    if (req.query?.official === 'true') {
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
      if (req.query.sort === 'top') {
        query.sort({
          voteCount: req.query?.asc === 'true' ? 1 : -1
        })
      }
    }
  
    if (req.query.limit) {
      const limit = Number(req.query.limit)
      !isNaN(limit) && query.limit(limit)
    }
  
    query.exec((err, data) => {
      if (err) return res.json([])
      res.json(data)
    })
  }catch(e) {
    console.error("Error querying polls", e)
  }
}