import useUser from '../../lib/useUser'
import { useRouter } from 'next/router'
import Loader from '../../components/Loader'
import { useState, useEffect } from 'react'
import VoteCard from '../../components/VoteCard'
import Head from 'next/head'

export default function Profile() {
  const [user, setUser] = useState()
  const [userLoading, setUserLoading] = useState(true)
  const [userPolls, setUserPolls] = useState()
  const router = useRouter()
  const { username } = router.query
  const { loading } = useUser()

  const loadData = async () => {
    const userData = await fetch(`/api/user/?username=${username}`)
      .then(res => res.json())

    setUser(userData)
    setUserLoading(false)

    if (!userData) return

    const pollData = await fetch(`/api/poll?createdBy=${userData.id}`)
      .then(res => res.json())

    setUserPolls(pollData)
  }

  useEffect(() => {
    if (!username) return
    loadData()
  }, [username])

  if (loading) {
    return <Loader />
  }


  return (
    <>
    <Head>
      <title>{userLoading ? 'Loading' : user.username} | ReplPoll</title>
    </Head>
    <div className='container mx-auto'>
      <div className='p-2'>
        {
          userLoading ?
            <div className='animate-pulse flex items-center gap-2'>
              <div className='w-24 h-24 rounded-full bg-slate-400' />
              <div className='w-32 h-6 rounded bg-slate-400' />
            </div>
            :
            !user ?
              <div>It looks like this profile doesn't exist</div>
              :
              <div className='flex items-center gap-2'>
                <img src={user.image} className='w-24 h-24 rounded-full object-cover' />
                <div className='text-2xl font-bold'>{user.username}</div>
              </div>
        }
      </div>
      <h3 className='text-2xl font-semibold pl-2'>Recent Polls</h3>
      <div className='p-2'>
        {
          userPolls && userPolls.length ?
            userPolls.map(poll => {
              return (
                <VoteCard 
                  key={poll._id}
                  data={{
                    title: poll.title,
                    totalVotes: poll.votes.length,
                    totalOptions: poll.options.length,
                    id: poll._id
                  }}
                />
              )
            })
            :
            <div>It looks like this user hasn't created any polls yet</div>
        }
      </div>
    </div>
    </>
  )
}
