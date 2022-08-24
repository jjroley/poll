import '../styles/globals.css'
import '../styles/animation.css'

import Header from '../components/Header'
import React from 'react'
import NextNProgress from 'nextjs-progressbar'

const layoutStyles = {
  main: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateRows: 'auto 1fr'
  },
  header: {
    gridRow: '1 / 2'
  },
  content: {
    gridRow: '2 / 3'
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <div style={layoutStyles.main}>
      <div style={layoutStyles.header}>
        <Header />
      </div>
      <div style={layoutStyles.content}>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
