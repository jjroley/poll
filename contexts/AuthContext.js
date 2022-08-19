import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

const AuthContext = React.createContext()


export function useUser(config) {
  const user = React.useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if(!config.redirect) return
    if(user?.unauthenticated) {
      router.replace(config.redirect)
    }
  }, [user])
  return { user }
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState()

  useEffect(() => {
    fetch('/api/getAuth').then(res => res.json()).then(data => {
      setUser(data || { unauthenticated: true })
    })
  }, [])

 

  return (
    <AuthContext.Provider value={user}>
      { children }
    </AuthContext.Provider>
  )
}