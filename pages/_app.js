import '../styles/globals.css'
import '../styles/animation.css'

import Header from '../components/Header'
import React from 'react'
import NextNProgress from 'nextjs-progressbar'
import { AuthProvider } from '../contexts/AuthContext'



function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className='layout'>
        <NextNProgress 
          height={3}
          color="rgb(14 165 233)"
        />
        <Header />
        <div className='layout-content'><Component {...pageProps} /></div>
      </div>
    </AuthProvider>
  )
}

export default MyApp
