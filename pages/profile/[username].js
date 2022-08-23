import useUser from '../../lib/useUser'
import { useRouter } from 'next/router'
import Loader from '../../components/Loader'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Profile() {
  const [user, setUser] = useState()
  const [userLoading, setUserLoading] = useState(true)
  const [userPolls, setUserPolls] = useState()
  const router = useRouter()
  const { username } = router.query
  const { loading } = useUser()

  const loadData = async () => {
    const userData = await fetch(`/api/user/${username}`)
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
                <Link href={`/poll/${poll._id}`} key={poll._id}>
                  <div className='cursor-pointer m-2 p-2 bg-slate-200 hover:bg-slate-100 transition-all'>
                    <div className='font-bold'>{poll.title}</div>
                    <div>{poll.votes.length} voters</div>
                  </div>
                </Link>
              )
            })
            :
            <div>It looks like this user hasn't created any polls yet</div>
        }
      </div>

    </div>
  )
}
