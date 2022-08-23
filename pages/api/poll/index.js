import { Poll } from '../../../scripts/schema'

export default async function handler(req, res) {
  if(req.query.id) {
    Poll.findById(req.query.id, function(err, data) {
      if(err) return res.status(404).json(false)
      res.status(200).json(data)
    })
    return
  }

  let filter = {}

  if(req.query.createdBy) {
    filter.createdBy = req.query.createdBy
  }

  const query = Poll.find(filter)

  if(req.query.sort) {
    query.sort([
      req.query.sort,
      req.query?.asc === 'true' ? 1 : -1
    ])
  }

  if(req.query.limit) {
    const limit = Number(req.query.limit)
    !isNaN(limit) && query.limit(limit)
  }

  query.exec((err, data) => {
    if(err) return res.json([])
    res.json(data)
  })
}