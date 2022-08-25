import { InformationCircleIcon, PlusCircleIcon, RefreshIcon, TrashIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"
import Link from 'next/link'
import Head from 'next/head'
import { uniq } from '../../lib/helpers'

function nonMutatingSplice(arr, start, deleteCount, ...items) {
  const newArr = JSON.parse(JSON.stringify(arr))
  newArr.splice(start, deleteCount, ...items)
  return newArr
}

export default function NewPoll() {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState([
    { value: '', placeholder: 'Javascript' },
    { value: '', placeholder: 'Python' },
    { value: '', placeholder: 'Ruby' }
  ])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState("Loading...")
  const [success, setSuccess] = useState(false)

  const updateOption = (e, index) => {
    setOptions(options.map((o, i) => {
      return index === i ? { value: e.target.value } : o
    }))
  }

  const removeOption = index => {
    if (options.length < 2) return
    setOptions(nonMutatingSplice(options, index, 1))
  }

  const addOption = index => {
    setOptions(nonMutatingSplice(options, index + 1, 0, { value: '' }))
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (title.length > 100) {
      setError('Title is too long')
    }
    else if (options.length < 2) {
      setError('At least two options needed')
    }
    else if (options.length > 10) {
      setError('There must be 10 options or less')
    }
    else if (uniq(options.map(o => o.value), '').length !== options.length) {
      setError("Duplicate options")
    }
    else {
      setError(null)
    }
    if (
      title.length <= 100 &&
      title.length &&
      options.length > 1 &&
      options.length <= 10 &&
      options.every(o => o.value !== '')
    ) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [options, title])

  const createPoll = async () => {
    setLoading('Creating...')
    const data = await fetch('/api/poll/create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        options: options.map(o => o.value)
      })
    }).then(res => res.json())
    if (data.error) {
      setError(data.error)
      setLoading(false)
    } else {
      setSuccess({
        pollId: data._id
      })
    }
  }

  if (success) {
    return (
      <div className='container mx-auto p-2'>
        Your poll has been created!
        <Link href={`/poll/${success.pollId}`}>
          <a className='text-blue-500 ml-3'>View</a>
        </Link>
      </div>
    )
  }

  return (
    <>
    <Head>
      <title>New Poll | ReplPoll</title>
    </Head>
    <div className='container mx-auto p-2 md:text-center'>
      <div className='font-bold text-lg mb-2'>Create a Poll</div>
      <input
        type='text'
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className='py-2 w-full md:max-w-md px-3 ring-2 ring-slate-200 focus:ring-blue-400 focus:outline-none rounded-md'
      />
      <div className='font-bold text-md my-2'>Options</div>
      <div className='flex flex-col md:items-center'>
        {
          options.map((option, index) => {
            return (
              <div className='flex items-center mb-2 ml-3 md:ml-0' key={index}>
                <input
                  type='text'
                  value={option.value}
                  onChange={e => updateOption(e, index)}
                  placeholder={option.placeholder || ''}
                  className='ring-1 px-3 py-2 rounded-md ring-slate-200 focus:ring-sky-400 focus:outline-none'
                />
                <PlusCircleIcon className='w-8 h-8 text-green-500 mr-2 ml-3 cursor-pointer rounded-full p-1 hover:bg-green-500 hover:text-white' onClick={() => addOption(index)} />
                <TrashIcon className='w-8 h-8 text-orange-700 cursor-pointer rounded-full p-1 hover:bg-orange-700 hover:text-white' onClick={() => removeOption(index)} />
              </div>
            )
          })
        }
      </div>
      <button
        className={`p-3 rounded-md text-white shadow-lg ${error ? 'bg-red-600 shadow-red-200' : 'disabled:bg-slate-300 bg-green-400'}  w-full md:max-w-md mx-auto flex justify-center items-center gap-2`}
        disabled={!ready || loading}
        onClick={createPoll}
      >
        {
          loading ?
            <>
              <div className='rounded-full w-4 h-4 border-2 border-white animate-spin border-t-transparent' />
              {loading}
            </> :
            error ?
              <>
                <InformationCircleIcon className='w-5 h-5' />
                {error}
              </> :
              "Create"
        }
      </button>
    </div>
    </>
  )
}
