import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline'
import ChartComponent from "../../components/Chart"
import Loader from '../../components/Loader'
import Router, { useRouter } from 'next/router'
import useUser from '../../lib/useUser'


export default function PollPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useUser()
  const [loading, setLoading] = useState(true)
  const [poll, setPoll] = useState(null)
  const [creator, setCreator] = useState(null)
  const [vote, setVote] = useState({
    index: -1,
    complete: false
  })
  const [error, setError] = useState()

  const getDataForChart = useCallback(() => {
    if (!poll) {
      return {
        title: '',
        labels: [],
        data: []
      }
    }
    const options = poll.options
    const arr = new Array(options.length).fill(0)
    poll.votes.forEach(v => {
      arr[v.index]++
    })
    return {
      title: poll.title,
      labels: poll.options,
      data: arr
    }
  }, [poll])

  const castVote = () => {
    if (!poll) return
    if (vote.index < 0 || vote.index >= poll.options.length) return
    fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        index: vote.index,
        pollId: poll._id
      })
    })
      .then(res => {
        if (res.status === 201) {
          setVote(prev => ({ ...prev, complete: true }))
        }
        return res.json()
      })
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setPoll(data)
        }
      })
  }

  useEffect(() => {
    if (!router.query.id) return
    fetch(`/api/poll?id=${router.query.id}`)
      .then(res => res.json())
      .then(pollData => {
        if (!pollData) {
          setPoll(false)
          setLoading(false)
        } else {
          const { createdBy } = pollData
          fetch(`/api/user?id=${createdBy}`)
            .then(res => res.json())
            .then(userData => {
              setLoading(false)
              if (!userData) {
                setPoll(false)
              } else {
                setPoll(pollData)
                setCreator(userData)
                console.log(pollData, userData)
                const didVote = pollData.votes.find(v => v.uid === userData.id.toString())
                if(didVote) {
                  setVote(prev => ({
                    ...prev,
                    index: didVote.index,
                    complete: true
                  }))
                }
              }
            })
        }
      })
  }, [router.query.id])

  if (loading || authLoading) {
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

  const votesSection = (
    user.loggedIn ?
      <>
        <div className='grow relative rounded-md flex flex-col'>
          <div className='font-bold text-2xl m-2'>Cast your vote</div>
          <div className='flex flex-wrap mb-2'>
            {
              poll.options.map((option, index) => {
                const isSelected = vote.index === index
                return (
                  <button
                    key={option}
                    className={`flex items-center gap-1 px-3 py-2 m-1 font-thin rounded-md border border-sky-800 ${isSelected ? 'bg-green-500 shadow-green-300 text-white border-transparent' : 'bg-sky-800 text-white hover:bg-white hover:text-black'} transition-all shadow-lg cursor-pointer`}
                    onClick={() => !vote.complete && setVote(prev => ({ ...prev, index }))} >
                    {option}
                  </button>
                )
              })
            }
          </div>
          <button
            className={`m-2 mt-auto px-4 py-2 rounded-md text-white bg-green-500 shadow-lg  transition-all  ${error ? 'bg-red-500 shadow-red-300' : 'shadow-green-300 disabled:shadow-none disabled:text-slate-500 disabled:bg-slate-200'}`}
            disabled={vote.index < 0 || vote.complete}
            onClick={castVote}>
            {error ? error : vote.complete ? "Voted" : "Submit"}
          </button>
        </div>
      </> :
      <div>
        <Link href='/login'>
          <button className='px-3 py-2 bg-white ring-1 rounded-sm ring-sky-600 text-sky-600 cursor-pointer mr-1'>Log in</button>
        </Link>
        to cast your vote
      </div>
  )

  return (
    <>
      <Head>
        <title>{poll.title} | ReplPoll</title>
      </Head>
      <div className='container mx-auto p-3 md:p-0'>
        <div onClick={() => router.back()} className='text-blue-500 cursor-pointer mt-5 flex items-center gap-2'>
          <ChevronDoubleLeftIcon className='w-5 h-5 text-blue-500' />back
        </div>
        <h1 className='text-2xl font-bold mt-5'>{poll.title}</h1>
        <Link href={`/profile/${creator.username}`}>
          <div className='flex gap-2 items-center w-min text-lg font-extralight mb-10 text-black cursor-pointer'>
            <img
              src={creator.image}
              width='40px'
              height='40px'
              className='rounded-full'
              alt='profile image' />
            {creator.username}
          </div>
        </Link>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-2/3 max-w-[700px]'>
            <ChartComponent data={getDataForChart()} />
          </div>

          {votesSection}
        </div>
      </div>
    </>
  )
}
