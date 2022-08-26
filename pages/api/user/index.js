import { User } from '../../../lib/schema'
import Gql from '../../../scripts/replitGql'

const replitGql = new Gql('')

export default async function handler(req, res) {
  let filter = {}

  if(req.query.username) {
    filter.username = req.query.username
  }

  if(req.query.id) {
    filter.replitId = req.query.id
  }
  
  const user = await User.findOne(filter)

  if(!user) {
    return res.json({ error: "User not found" })
  }

  const replitData = await replitGql.raw({
    query: `query user($id: Int!) {
      user(id: $id) {
        image username id
      } 
    }`,
    variables: {
      id: Number(user.replitId)
    }
  });

  if(!replitData.data) return res.status(404).json(false)
  
  res.json(replitData.data.user)
}
