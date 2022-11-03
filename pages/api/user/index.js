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
    return res.status(404).json({ error: "User not found" })
  }


  try {
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
    if(replitData.data.user) {
      res.json(replitData.data?.user)
    }else {
      res.status(404).json({ error: "User not found" })
    }
  } catch(err) {
    console.log("Error fetching replit data", err)
    res.status(404).json({ error: "User not found" })
  }
}
