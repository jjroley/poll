import { User } from '../../scripts/schema'
import Gql from '../../scripts/replitGql'

const replitGql = new Gql()

export default async function handler(req, res) {
  const replitId = req.headers['x-replit-user-id']

  if(!replitId) {
    return res.status(403).json(false)
  }

  const replitData = await replitGql.raw({
    query: `
      query user($id Int!) {
        username image bio
      }    
    `,
    variables: {
      id: Number(replitId)
    }
  })

  if(replitData.data) {
    const replitUser = replitData.data.user
    const userExists = await User.findOne({ replitId })
    if(!userExists) {
      const newUser = new User({
        username: replitUser.username,
        replitId: replitId,
        createdAt: new Date().getTime(),
        role: "DEFAULT"
      })
      await newUser.save()
    }
    const user = {
      name: replitUser.username,
      id: replitUser.id,
      image: replitUser.image
    }
    req.session.user = user
    await res.session.save()
    res.status(200).json(user)
  }
}