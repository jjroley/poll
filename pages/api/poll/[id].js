import { Poll } from '../../../scripts/schema'

export default async function handler(req, res) {
  const { id } = req.params
  const poll = await Poll.findById(id).exec()
  
}