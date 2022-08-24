import { ViewGridIcon, UserIcon, PlusCircleIcon } from "@heroicons/react/outline";
import Link from "next/link";

import useUser from '../lib/useUser'

export default function Header() {
  const { user, loading } = useUser()

  if (loading) {
    return null
  }

  return (
    <header className="container mx-auto flex items-center border-b p-2">
      <Link href="/">
        <h1 className="text-xl font-extrabold uppercase cursor-pointer">
          Repl<span className='text-sky-600'>Poll</span>
        </h1>
      </Link>
      {
        user.loggedIn ?
          <>
            <div className='flex items-center px-2 relative ml-auto gap-2'>
              <Link href='/poll/new'>
                <PlusCircleIcon className='w-10 h-10 hover:text-white hover:bg-sky-600 rounded-md p-1 cursor-pointer hover:shadow-xl hover:shadow-[#0005]' />
              </Link>
              <Link href='/browse'>
                <ViewGridIcon className='w-10 h-10 hover:text-white hover:bg-sky-600 rounded-md p-1 cursor-pointer hover:shadow-xl hover:shadow-[#0005]' />
              </Link>
              <Link href='/profile/me'>
                <UserIcon className='w-10 h-10 hover:text-white hover:bg-sky-600 rounded-md p-1 cursor-pointer hover:shadow-xl hover:shadow-[#0005]' />
              </Link>
            </div>
          </> :
          <div className='flex items-center gap-2 ml-auto'>
            <Link href='/login'>
              <button className='px-3 py-2 rounded-sm ring-1 ring-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white'>Log In</button>
            </Link>
          </div>
      }
    </header>
  );
}
