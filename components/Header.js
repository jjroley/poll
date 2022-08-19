import { DotsHorizontalIcon, ViewGridIcon, UserIcon, LogoutIcon, PlusIcon } from "@heroicons/react/outline";
import { UserIcon as UserSolidIcon, ViewGridIcon as ViewGridSolidIcon } from '@heroicons/react/solid'
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { forwardRef, useRef } from "react";

const MyLink = forwardRef((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

const CondIcon = ({ href, iconA, iconB }) => {
  const activeRef = useRef()
  console.log(activeRef)
  return (
    <Link href={href}>
      <a href={href} ref={activeRef}>
        {/* { activeRef.current.classList.contains('active') ? iconB : iconA } */}
      </a>
    </Link>
  )
}

export default function Header() {
  return (
    <header className="layout-header container py-3 mx-auto flex items-center border-b shadow-[0_-10px_50px_#0002] sm:shadow-none">
      <Link href="/">
        <h1 className="text-3xl font-bold cursor-pointer ml-3 hidden sm:block">
          Repl<span className="text-sky-600">Poll</span>
        </h1>
      </Link>
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
      </div>
      <Menu as="div" className="relative ml-auto hidden sm:block">
        <Menu.Button className="mx-3">
          <DotsHorizontalIcon className="w-10 h-10" />
        </Menu.Button>
        <Menu.Items className="absolute top-[100%] right-0 py-2 w-56 bg-white border rounded-md">
          <div className="flex flex-col">
            <Menu.Item className="p-2 hover:bg-sky-600 hover:text-white flex items-center gap-2">
              <MyLink href="/profile/me"><UserIcon className='w-5 h-5' />Profile</MyLink>
            </Menu.Item>
            <Menu.Item className="p-2 hover:bg-sky-600 hover:text-white flex items-center gap-2">
              <MyLink href="/"><LogoutIcon className='w-5 h-5' />Logout</MyLink>
            </Menu.Item>
          </div>
          <svg viewBox='0 0 20 10' width='20' height='10' className='absolute top-0 right-5 translate-y-[-100%]'>
            <path d='M 0 10 L 10 0 L 20 10' fill='white' stroke='rgb(226 232 240)' strokeWidth='1'></path>
          </svg>
        </Menu.Items>
      </Menu>
    </header>
  );
}
