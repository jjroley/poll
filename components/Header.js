import { ViewGridIcon, UserIcon, PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

import useUser from '../lib/useUser'

export default function Header() {
  const { user, loading } = useUser()

  if(loading) {
    return null
  }
  
  return (
    <header className="layout-header container py-3 mx-auto flex items-center border-b shadow-[0_-10px_50px_#0002] sm:shadow-none">
      <Link href="/">
        <h1 className="text-3xl font-bold cursor-pointer ml-3 hidden sm:block">
          Repl<span className="text-sky-600">Poll</span>
        </h1>
      </Link>
      {
        user.loggedIn && 
        <>
          <div className='sm:hidden flex items-center font-bold px-2 relative w-full gap-2'>
            <Link href='/browse'>
              <a><ViewGridIcon className='w-10 h-10' /></a>
            </Link>
            <Link href='/profile/me'>
              <UserIcon className='w-10 h-10' />
            </Link>
            <Link href='/poll/new'>
              <a className='absolute mt-[-30px] right-5'>
                <div className='p-2  bg-sky-800 text-white rounded-lg shadow-xl shadow-[#0004]'>
                  <PlusIcon className='w-8 h-8' />
                </div>
              </a>
            </Link>
            <div>Hi, {user.username}</div>
          </div>
          <div className='hidden sm:flex items-center px-2 relative ml-auto gap-2'>
            <Link href='/browse'>
              Browse
            </Link>
            <Link href='/profile/me'>
              Profile
            </Link>
            <Link href='/poll/new'>
              New Poll
            </Link>
          </div>
        </>
      }
    </header>
  );
}
