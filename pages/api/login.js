import { Gql } from '../../scripts/replitGql'
import { User } from '../../scripts/schema'

const replitGql = Gql

import nextConnect from 'next-connect'

const app = nextConnect()

app.post(async function(req, res) {
  const replitId = req.headers['x-replit-user-id']

  const replitData = await replitGql.raw({
    query: `query user($id: Int!) {
      user(id: $id) {
        username image id
      }
    }
    `,
    variables: {
      id: Number(replitId)
    }
  })

  if(replitData.data) {
    const replitUser = replitData.data.user
    User.findOne({ replitId }, async function(err) {
      if(err) {
        const createdUser = new User({
          username: replitUser.username,
          replitId: replitId,
          image: replitUser.image,
          createdAt: new Date().getTime(),
          role: 'DEFAULT'
        })
        await createdUser.save()
      } 
      res.status(200).json({ message: 'Success' })
    })
  }
})