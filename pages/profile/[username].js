import Gql from '../../scripts/replitGql'
import { User } from '../../scripts/schema'

export default function Profile({ user }) {
  if(!user) {
    return "User does not exist"
  }
  return (
    <div className='container mx-auto'>
      <img src={user.image} className='w-32 h-32 rounded-full object-cover' />
      { user.username }
    </div>
  )
}

export async function getServerSideProps(context) {
  const { username } = context.params
  
  const replitGql = new Gql('')

  const replitData = await replitGql.raw({
    query: `query userByUsername($username: String!) {
      userByUsername(username: $username) {
        image
      }
    }`,
    variables: { username }
  })

  const user = await User.findOne({ username })

  console.log(replitData)

  if(!user) {
    return {
      props: { user: null }
    }
  }

  return {
    props: {
      user: {
        username: user.username,
        image: replitData.data.userByUsername.image
      }
    }
  }

}

