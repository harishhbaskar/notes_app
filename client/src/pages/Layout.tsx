import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'

const Layout = () => {
  return (
    <div className="bg-[#111827] min-h-screen flex flex-col">
        <Header/>
        <Outlet/>
    </div>
  )
}

export default Layout