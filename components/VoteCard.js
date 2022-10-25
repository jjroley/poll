import Link from 'next/link'
import { CheckCircleIcon, UsersIcon } from '@heroicons/react/outline'


export default function VoteCard({ data }) {
  const style = {}
  if(data.bg) {
    style.backgroundColor = data.bg
  }

  return (
    <Link href={`/poll/${data.id}`}>
      <div
        className='relative w-full md:w-96 bg-slate-200 rounded-md p-4 px-5 my-2 cursor-pointer transition-shadow hover:shadow-lg'
        style={style}
        >
        <div className='flex mb-2 items-center'>
          <div className='font-bold ml-1'>{data.title}</div>
        </div>
        <div className='flex gap-4'>
          <div className='flex items-center gap-1'>
            <UsersIcon className='w-5 h-5' />
            <span>{data.totalVotes} vote{(data.totalVotes !== 1) && 's'}</span>
            <CheckCircleIcon className='w-5 h-5 ml-1' />
            <span>{data.totalOptions} options</span>
          </div>
        </div>
        { data.index }
      </div>
    </Link>
  )
}