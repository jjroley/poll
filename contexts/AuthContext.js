import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

const AuthContext = React.createContext()


export function useAuth() {
  return React.useContext(AuthContext)
}


export function useUser(config) {
  const user = useAuth()
  const router = useRouter()

  if(config.redirect) {

  }
  return { user }
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState()

  useEffect(() => {
    
  }, [])

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
    <AuthContext.Provider value={user}>
      { children }
    </AuthContext.Provider>
  )
}