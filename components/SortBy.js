import { useState } from 'react'
import { Listbox } from "@headlessui/react"
import { SelectorIcon } from '@heroicons/react/outline'

export default function SortBy() {
  const options = ['new', 'hot', 'top']
  const [selected, setSelected] = useState(options[0])
  return (
    <div className='relative z-10 w-full flex justify-end items-center'>
      <span className='mr-3'>Sort by</span>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative border rounded-sm px-2 py-1 w-32'>
          <Listbox.Button className='flex items-center justify-between w-full'>{selected}<SelectorIcon className='w-5 h-5' /></Listbox.Button>
          <Listbox.Options className='absolute bg-white mt-3 w-32 right-0 overflow-auto rounded-md py-1 shadow-lg ring-1 ring-slate-200 text-left'>
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={`p-2 pl-4 ${selected === option ? 'bg-sky-600 text-white' : ''} hover:bg-sky-600 hover:text-white cursor-pointer`}
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>  
    </div>
    
  )
}