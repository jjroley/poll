import { useRouter } from "next/router";
import { useState } from "react"
 
export default function Login() {
  const [error, setError] = useState()
  const router = useRouter()

  

  return (
    <div className='container mx-auto'>
      <h1 className='text-4xl text-center font-bold my-10'>Login</h1>
      <form onSubmit={replitLogin} className='w-full flex justify-center'>
        <button type='submit' className='font-[300] text-center px-4 py-2 bg-sky-600 text-white rounded-md shadow-md shadow-sky-200 transition-all hover:shadow-xl flex items-center'>Login with <img src='replit.svg' width='100px' className='inline'/></button>
      </form>
    </div>
  )
}