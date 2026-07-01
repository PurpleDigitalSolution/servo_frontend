import React from 'react'
import { Outlet } from 'react-router-dom'
import SessionChecker from '../hooks/Session'

const Layout = () => {
  return (
    <div>
      <main>
       <SessionChecker/>
        <Outlet/>
      </main>
    </div>
  )
}

export default Layout