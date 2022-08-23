import { User } from '../../../scripts/schema'
import Gql from '../../../scripts/replitGql'

const replitGql = new Gql('')

export default async function handler(req, res) {
  const { username } = req.query

  const user = await User.findOne({ username })

  if(!user) {
    return res.status(404).json(false)
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

  console.log(replitData)

  if(!replitData.data) return res.status(404).json(false)
  
  res.json(replitData.data.user)
}
