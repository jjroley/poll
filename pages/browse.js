import { useState } from "react"
import { SearchIcon } from "@heroicons/react/outline"
import VoteCard from "../components/VoteCard"
import SortBy from "../components/SortBy"

export default function Browse() {
  const [browseType, setBrowseType] = useState("Official")
  const [filters, setFilters] = useState([])

  return (
    <div className='container mx-auto'>
      <div className="flex items-center border py-3 rounded-md mx-3 mt-3">
        <SearchIcon className="mx-3 w-5 h-5" />
        <input
          type="text"
          placeholder="Search polls..."
          className="display-block outline-none font-extralight bg-none"
        />
      </div>
      <div className='flex justify-center'>
        <div
          onClick={() => { setBrowseType('Official') }}
          className={`cursor-pointer w-32 py-4 text-center border-b-4 ${browseType==='Official' ? 'border-black' : 'border-slate-200'}`}>
          Official
        </div>
        <div 
          onClick={() => { setBrowseType('Community') }}
          className={`cursor-pointer w-32 py-4 text-center border-b-4 ${browseType==='Official' ? 'border-slate-200' : 'border-black'}`}>
          Community
        </div>
      </div>
      <div className='p-3'>
        <div className='text-right'>
          <SortBy />
        </div>
        <div className='flex flex-col mx-auto items-center'>
          <VoteCard data={{
            title: "Which is your favorite online code editor?",
            author: 'jjroley',
            totalVotes: 24,
            totalOptions: 3,
            official: true
          }}/>
          <VoteCard data={{
            title: "What is your favorite fruit?",
            author: 'jjroley',
            totalVotes: 24,
            totalOptions: 3,
            official: false,
            new: true
          }}/>
        </div>
      </div>
    </div>
  )
}