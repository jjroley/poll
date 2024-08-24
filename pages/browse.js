import { useState, useEffect, useCallback } from "react"
import { objUniq } from '../lib/helpers'
import VoteCard from "../components/VoteCard"
import Dropdown from "../components/Dropdown"
import Search from '../components/Search'
import Head from 'next/head'

export default function Browse() {
  const [filters, setFilters] = useState({
    loaded: false
  })
  const [polls, setPolls] = useState(null)
  const [pollsLoaded, setPollsLoaded] = useState(false)
  const loadAmt = 20

  const removeFilter = key => {
    const newState = { ...filters }
    delete newState[key]
    setFilters(newState)
  }

  const addFilter = (key, value) => {
    setFilters(curr => ({
      ...curr,
      [key]: value
    }))
  }

  const getPolls = useCallback(async (config) => {
    let query = []
    if (filters.official && !filters.keyword) {
      query.push('official=true')
    }

    if (filters.sort) {
      query.push('sort=' + filters.sort)
    }

    if (filters.keyword) {
      query.push('keyword=' + filters.keyword)
    }

    query.push(`skip=${(config?.clear || !polls) ? 0 : polls.length}`)

    query.push(`limit=${loadAmt}`)

    const data = await fetch(`/api/poll/?${query.join('&')}`).then(res => res.json())

    const arr = (config?.clear || !polls) ? data : [...polls, ...data]

    return arr
  }, [filters, polls])

  const loadMore = async function() {
    const data = await getPolls()
    setPolls(data)
    setPollsLoaded(data.length < loadAmt)
  }

  useEffect(() => {
    if (!filters.loaded) {
      setFilters({
        ...filters,
        sort: 'top',
        loaded: true
      })
      return
    }
    getPolls({ clear: true }).then(data => {
      if (data.error) {

      } else {
        setPolls(data)
        setPollsLoaded(data.length < loadAmt)
      }
    })

  }, [filters, getPolls])

  const filter = (data) => {
    if ('keyword' in data) {
      if (data.keyword) {
        addFilter('keyword', data.keyword)
        addFilter('official', false)
      } else {
        removeFilter('keyword')
      }
    }
    if ('sort' in data) {
      if (data.sort === 'asc' || data.sort === 'desc') {
        addFilter('asc', data.sort === 'asc')
      }
      if (data.sort === 'new' || data.sort === 'top') {
        addFilter('sort', data.sort)
      }
    }
    if ('type' in data) {
      if (data.type === 'official') {
        addFilter('official', data.type === 'official')
      } else {
        removeFilter('official')
      }
    }
  }

  var test = []

  return (
    <>
      <Head>
        <title>Browse | ReplPoll</title>
      </Head>
      <div className='container mx-auto'>
        <Search onSearch={keyword => {
          filter({ keyword })
        }} />
        <div className='flex justify-center'>
          <div
            onClick={() => { filter({ type: 'official' }) }}
            className={`cursor-pointer w-32 py-4 text-center border-b-4 ${filters.official ? 'border-black' : 'border-slate-200'}`}>
            Featured
          </div>
          <div
            onClick={() => { filter({ type: 'community' }) }}
            className={`cursor-pointer w-32 py-4 text-center border-b-4 ${filters.official ? 'border-slate-200' : 'border-black'}`}>
            All
          </div>
        </div>
        <div className='p-3'>
          <div className='text-right'>
            <Dropdown
              title='Sort by'
              options={['top', 'new']}
              onChange={value => {
                filter({ sort: value })
              }}
            />
          </div>
          <div className='flex flex-col mx-auto items-center'>
            {
              polls && polls.length ?
                <>
                  {polls.map((poll, index) => {
                    return (
                      <VoteCard
                        key={poll._id}
                        data={{
                          title: poll.title,
                          totalVotes: poll.votes.length,
                          totalOptions: poll.options.length,
                          official: poll.official,
                          id: poll._id
                        }}
                      />
                    )
                  })}
                  {
                    !pollsLoaded &&
                    <button
                      className='text-white font-thin px-3 py-2 bg-sky-600 rounded-sm cursor-pointer'
                      onClick={loadMore}
                    >Load more</button>
                  }
                </> :
                polls && !polls.length ?
                  <div className='text-xl font-thin'>No polls found</div> :
                  <div className='text-xl font-thin'>Loading polls...</div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
