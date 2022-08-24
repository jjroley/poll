import { useState, useEffect, useCallback } from 'react'
import ChartComponent from "../../components/Chart"
import Loader from '../../components/Loader'
import Router, { useRouter } from 'next/router'
import useUser from '../../lib/useUser'
import Link from 'next/link'

export default function PollPage() {
  const { user } = useUser()
  const router = useRouter()
  const pollId = router.query.id
  const [poll, setPoll] = useState()
  const [createdBy, setCreatedBy] = useState()
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [voted, setVoted] = useState(false)
  const [error, setError] = useState()

  const castVote = async () => {
    if (!selected) return
    const data = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pollId: pollId,
        vote: selected
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.error) {
        setError(data.error)
      } else {
        setPoll(data)
        setVoted(selected)
      }
    })
  }

  const getDataForChart = useCallback(() => {
    if (!poll) return
    const options = poll.options
    const obj = {}
    options.forEach(o => {
      obj[o] = 0
    })
    poll.votes.forEach(v => {
      obj[v.vote]++
    })
    return {
      title: poll.title,
      labels: poll.options,
      data: Object.values(obj)
    }
  }, [poll])

  useEffect(() => {
    if (!pollId || !user) return
    console.log('pollid', typeof pollId)
    fetch(`/api/poll?id=${pollId}`)
    .then(res => {
      return res.json()
    })
    .then(pollData => {
      if (!pollData || pollData.error) {
        console.log(pollData)
        setLoading(false)
        return
      }
      
      const alreadyVoted = pollData.votes.find(v => v.uid === user.id)
      setVoted(alreadyVoted)
      setSelected(alreadyVoted ? alreadyVoted.vote : false)

      fetch(`/api/user?id=${pollData.createdBy}`)
      .then(res => res.json())
      .then(user => {
        console.log(user)
        setPoll(pollData)
        setCreatedBy(user)
        setLoading(false)
      })
    })
  }, [pollId, user])

  if (loading) {
    return <Loader />
  }

  if (!poll) {
    return (
      <div className='container mx-auto text-center text-xl pt-4'>
        {`This poll doesn't exist. `}
        <span 
          className='text-blue-400 cursor-pointer'
          onClick={() => Router.back()}>Go back</span>
      </div>
    )
  }

  return (
    <>
      <div className='container mx-auto p-3 md:p-0'>
        <h1 className='text-2xl font-bold mt-10'>{poll.title}</h1>
        <Link href={`/profile/${createdBy.username}`}>
          <div className='flex gap-2 items-center text-lg font-extralight mb-10 text-black cursor-pointer'>
            <img src={createdBy.image} className='w-10 h-10 rounded-full'/>
            { createdBy.username }
          </div>
        </Link>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-2/3 max-w-[700px]'>
            <ChartComponent data={getDataForChart(poll)} />
          </div>
          {
            user.loggedIn ?
              <>
                <div className='grow relative rounded-md flex flex-col'>
                  <div className='font-bold text-2xl m-2'>Cast your vote</div>
                  <div className='flex flex-wrap mb-2'>
                    {
                      poll.options.map(option => {
                        const isSelected = selected === option
                        return (
                          <div
                            key={option}
                            className={`flex items-center gap-1 px-3 py-2 m-1 font-thin rounded-md border border-sky-800 ${isSelected ? 'bg-green-500 shadow-green-300 text-white border-transparent' : 'bg-sky-800 text-white hover:bg-white hover:text-black'} transition-all shadow-lg  cursor-pointer`}
                            onClick={() => !voted && setSelected(option)}
                          >
                            {option}
                          </div>
                        )
                      })
                    }
                  </div>
                  <button className={`m-2 mt-auto px-4 py-2 rounded-md text-white bg-green-500 shadow-lg  transition-all  ${error ? 'bg-red-500 shadow-red-300' : 'shadow-green-300 disabled:shadow-none disabled:text-slate-500 disabled:bg-slate-200'}`} disabled={!selected || voted} onClick={castVote}>{error ? error : voted ? "Voted" : "Submit"}</button>
                </div>
              </> :
              <div>
                <Link href='/login'>
                  <button className='px-3 py-2 bg-white ring-1 rounded-sm ring-sky-600 text-sky-600 cursor-pointer mr-1'>Log in</button>
                </Link>
                to cast your vote
              </div>
          }
        </div>
      </div>
    </>

  )
}
