import { useState } from 'react'
import { SearchIcon } from "@heroicons/react/outline"


export default function Search({ onSearch }) {
  const [value, setValue] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSubmit = e => {
    if(e.key !== 'Enter') return
    onSearch(value)
    setSearched(true)
  }
  const handleChange = e => {
    setValue(e.target.value)
    if(e.target.value === '' && searched) {
      onSearch('')
      setSearched(false)
    }
  }
  
  return (
    <div className="flex items-center border py-3 rounded-md mx-auto mt-3 max-w-[400px]">
      <SearchIcon className="mx-3 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleSubmit}
        placeholder="Search polls..."
        className="display-block outline-none font-extralight bg-none w-full"
      />
    </div>
  )
}