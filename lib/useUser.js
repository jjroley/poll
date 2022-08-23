import useSWR from "swr"
import { useEffect } from 'react'
import Router from 'next/router'

const fetcher = async url => {
  return await fetch(url).then(res => res.json())
}

export default function useUser({
  redirect = false,
  redirectAuthenticated = false
} = {}) {
  const { data, error, mutate } = useSWR(`/api/user`, fetcher)

  error && console.error('Error with user', error)
  
  useEffect(() => {
    if(!redirect || !data) return

    if(Boolean(redirectAuthenticated) === Boolean(data.loggedIn)) {
      Router.push(redirect)
    }
  }, [
    data,
    redirect,
    redirectAuthenticated
  ])

  const runLogin = async (redirect) => {
    await fetch('/api/login', {
      method: "POST"
    })
    const data = await fetch('/api/user').then(res => res.json())
    mutate(data)
    Router.push(redirect)
  }
  
  const login = (redirect) => {
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

      runLogin(redirect)
      
      authWindow.close();
    }
  }

  return {
    user: data,
    loading: !error && !data,
    isError: error,
    login
  }
}