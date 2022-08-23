import { useState, useEffect, useCallback } from 'react'
import ChartComponent from "../../components/Chart"
import { useRouter } from 'next/router'
import useUser from '../../lib/useUser'
import Link from 'next/link'

export default function PollPage() {
  const { user } = useUser()
  const router = useRouter()
  const pollId = router.query.id
  const [poll, setPoll] = useState()
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [voted, setVoted] = useState(false)

  const castVote = async () => {
    if(!selected) return
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
      if(res.status === 201) {
        setVoted(selected)
      }
    })
  }

  const getDataForChart = useCallback(() => {
    if(!poll) return
    const options = poll.options
    const obj = {}
    options.forEach(o => {
      obj[o] = 0
    })
    poll.votes.forEach(v => {
      obj[v[0]]++
    })
    
    return {
      title: poll.title,
      labels: poll.options,
      data: Object.values(obj)
    }
  }, [poll])
  
  useEffect(() => {
    if(!pollId || !user) return
    fetch(`/api/poll?id=${pollId}`)
    .then(res => {
      if(res.status === 404) {
        return
      }  
      return res.json()
    })
    .then(data => {      
      setLoading(false)
      setPoll(data)
      const alreadyVoted = data.votes.find(v => v[1] === user.id)
      setVoted(alreadyVoted)
      setSelected(alreadyVoted ? alreadyVoted[0] : false)
    })
  }, [pollId, user])

  if(loading) {
    return "loading..."
  }

  if(!poll) {
    return (
      "Sorry, poll doesn't exist"
    )
  }

  return (
    <>
      <div className='container mx-auto p-3 md:p-0'>
        <h1 className='text-2xl font-bold mt-10'>{poll.title}</h1>
        <p className='text-lg font-extralight mb-10'>{poll.createdBy}</p>
        <div className='flex flex-col md:flex-row'>
          {
            /* 229, 192, 127 */
            user.loggedIn ? 
            <>
              <div className='w-full md:w-2/3 max-w-[700px]'>
                {
                  poll.votes.length ?
                  <ChartComponent data={getDataForChart(poll)}/> :
                  <div>No votes yet</div>
                }
              </div>
              <div className='grow relative rounded-md flex flex-col'>
                <div className='font-bold text-2xl m-2'>Cast your vote</div>
                <div className='flex flex-wrap mb-2'>
                  {
                    poll.options.map(option => {
                      const isSelected = selected === option
                      return (
                        <div 
                          key={option} 
                          className={`flex items-center gap-1 px-3 py-2 m-1 font-thin rounded-md border border-sky-800 ${ isSelected ? 'bg-green-500 shadow-green-300 text-white border-transparent' : 'bg-sky-800 text-white hover:bg-white hover:text-black' } transition-all shadow-lg  cursor-pointer`}
                          onClick={() => !voted && setSelected(option)}
                        >
                          {option}
                        </div>
                      )
                    })
                  }
                </div>
                <button className='m-2 mt-auto px-4 py-2 rounded-md text-white bg-green-500 shadow-lg shadow-green-300 transition-all disabled:shadow-none disabled:text-slate-500 disabled:bg-slate-200' disabled={!selected || voted} onClick={castVote}>{ voted ? "Voted" : "Submit" }</button>
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
