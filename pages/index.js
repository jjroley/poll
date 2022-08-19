import { ChevronRightIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col gap-10 justify-center items-center h-full">
      <h1 className="text-4xl font-bold text-center fade-in-up timing-ease anim-duration-1">
        The Ultimate <span className="text-sky-600">Voting</span> App for Replit
      </h1>
      <div className="flex gap-3 fade-in timing-ease anim-duration-1 anim-delay-1 opacity-0 forwards">
        {/* <button className='border border-sky-600 px-3 py-2 text-sky-600 cursor-pointer rounded-md'>Login</button> */}
        <Link href="/browse">
          <button className="cursor-pointer shadow-lg hover:shadow-xl transition-all px-5 py-3 bg-sky-600 text-white rounded-md flex gap-3 hover:gap-5 items-center">
            Get Started
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
