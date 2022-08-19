import { useRouter } from "next/router";
import { useState } from "react"
 
export default function Login() {
  const [error, setError] = useState()
  const router = useRouter()

  async function replitLogin(event) {
    event.preventDefault()
    
    window.addEventListener('message', authComplete);

		var left = (screen.width / 2) - 175;
		var top = (screen.height / 2) - 250;

    var authWindow = window.open(
      'https://repl.it/auth_with_repl_site?domain='+location.host,
      '_blank',
      'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=350, height=500, top='+top+', left='+left)

    function authComplete(e) {
      if (e.data !== 'auth_complete') {
        return;
      }

      window.removeEventListener('message', authComplete);

      authWindow.close();
      fetch('/api/login', { method: "POST" }).then(res => {
        if(res.status === 200) {
          router.push('/browse')
        }
      })
    }
  }

  return (
    <div className='container mx-auto'>
      <h1 className='text-4xl text-center font-bold my-10'>Login</h1>
      <form onSubmit={replitLogin} className='w-full flex justify-center'>
        <button type='submit' className='font-[300] text-center px-4 py-2 bg-sky-600 text-white rounded-md shadow-md shadow-sky-200 transition-all hover:shadow-xl flex items-center'>Login with <img src='replit.svg' width='100px' className='inline'/></button>
      </form>
    </div>
  )
}