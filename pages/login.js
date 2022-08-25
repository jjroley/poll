import useUser from '../lib/useUser'
import Loader from '../components/Loader'
import { useState } from 'react'
import Head from 'next/head'

export default function Login() {
  const { loading: userLoading, login } = useUser()
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    login('/browse')
  }
  
  if(userLoading) {
    return <Loader />
  }

  return (
    <>
    <Head>
      <title>Login | ReplPoll</title>
    </Head>
    <div className='container mx-auto'>
      <h1 className='text-4xl text-center font-bold my-10'>Login</h1>
      <form onSubmit={handleLogin} className='w-full flex justify-center'>
        <button disabled={loading} type='submit' className='font-[300] text-center px-4 py-2 bg-sky-600 text-white rounded-md shadow-md shadow-sky-200 transition-all hover:shadow-xl flex items-center disabled:bg-slate-200'>Login with <img src='replit.svg' width='100px' className='inline' alt=''/></button>
      </form>
    </div>
    </>
  )
}
