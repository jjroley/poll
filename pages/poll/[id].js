import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline'
import ChartComponent, { getChartImage } from "../../components/Chart"
import Router from 'next/router'
import Swal from 'sweetalert2'
import { Poll, User } from '../../lib/schema'
import Gql from '../../scripts/replitGql'
import auth from '../../scripts/auth'
import { getSerializedPollData } from '../../lib/helpers'

const getDataForChart = (poll) => {
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
  }

const AdminArea = ({ poll, deletePoll }) => {
  const [featured, setFeatured] = useState(poll.official)

  const toggleFeatured = (e) => {
    setFeatured(e.target.checked)
    
    fetch('/api/admin/feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pollId: poll._id,
        feature: 'toggle'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.error) {
        Swal.fire("Error:", data.error)
      }
    })
  }
  
  return (
    <div className='flex flex-wrap p-3 items-center bg-red-200 gap-3 mt-2'>
      <span className='text-lg font-bold'>Admin</span>
      <button
        className='px-3 py-2 bg-red-500 text-white cursor-pointer rounded-sm text-sm font-thin'  
        onClick={ deletePoll }
      >Delete Poll</button>
      <label><input type='checkbox' checked={featured} onChange={toggleFeatured} /> Featured</label>
    </div>
  )
}

export default function PollPage({ pollData, user, creator, voteData }) {
  const [deleted, setDeleted] = useState(false)
  const [image, setImage] = useState('/favicon.ico')
  const [error, setError] = useState(null)
  const [vote, setVote] = useState(voteData)
  const [poll, setPoll] = useState(pollData)

  const deletePoll = async () => {
    if(!poll) return
    Swal.fire({
      title: "Are you sure you want to delete this?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: 'green'
    }).then(async (result) => {
      if(result.isConfirmed) {
        const data = await fetch(`/api/poll/delete?id=${poll._id}`, {
          method: "DELETE"
        })
        .then(res => res.json())
        if(data.success) {
          setDeleted(true)
        }else {
          Swal.fire("Error:", data.error)
        }
      }
    })
  }

  const castVote = () => {
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

  if(deleted) {
    return (
      <div className='container mx-auto text-center text-xl pt-4'>
        You just deleted a poll :O
      </div>
    )
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
        <meta property="og:title" content={poll.title} />
        <meta property="og:image" src={image} />
      </Head>
      <div className='container mx-auto p-3 md:p-0'>
        <Link href='/browse' >
          <span className='text-blue-500 cursor-pointer mt-5 flex items-center gap-2' ><ChevronDoubleLeftIcon className='w-5 h-5 text-blue-500' />browse</span>
        </Link>
        
        <h1 className='text-2xl font-bold mt-5'>{poll.title}</h1>
        <div className='flex items-center gap-2 mb-10 mt-5'>
          <Link href={`/profile/${creator.username}`}>
            <div className='flex gap-2 items-center text-lg font-extralight text-black cursor-pointer'>
              <img
                src={creator.image}
                width='40px'
                height='40px'
                className='rounded-full'
                alt='profile image' />
              {creator.username}
            </div>
          </Link>
          {
            user.replitId === poll.createdBy &&
            <button
              className='px-3 py-2 bg-red-500 text-white cursor-pointer rounded-sm text-sm font-thin'  
              onClick={deletePoll}
            >Delete Poll</button>
          }
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-2/3 max-w-[700px]'>
            <ChartComponent data={getDataForChart(poll)} />
          </div>
          {votesSection}
        </div>
        { user.role === "ADMIN" && <AdminArea poll={poll} deletePoll={deletePoll} />}
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res, params }) {
  const user = await auth(req, res)
  

  try {
    const poll = await Poll.findById(params.id)

    const creator = await User.findOne({ replitId: poll.createdBy })

    const replitGql = new Gql('')
    const creatorImage = await replitGql.raw({
      query: `query user($id: Int!) {
        user(id: $id) {
          image
        } 
      }`,
      variables: {
        id: Number(poll.createdBy)
      }
    })
    
    const vote = poll.votes.find(v => v.uid === user.replitId)

    return {
      props: {
        user: user,
        creator: { username: creator.username, image: creatorImage.data?.user.image },
        pollData: getSerializedPollData(poll),
        voteData: {
          complete: !!vote,
          index: vote ? vote.index : -1
        }
      }
    }
  }catch (e) {
    return {
      props: { user, poll: null, creator: null }
    }
  }

  
}