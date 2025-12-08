import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col justify-center items-center gap-6">
      <h1 className="text-4xl font-bold">Welcome to Notes App</h1>
      <div className="flex gap-4">
        <Link 
          to="/signup" 
          className="bg-[#2563EB] hover:bg-[#3B82F6] px-6 py-3 rounded-lg font-semibold transition"
        >
          Get Started (Sign Up)
        </Link>
        <Link 
          to="/signin" 
          className="bg-[#374151] hover:bg-[#4B5563] px-6 py-3 rounded-lg font-semibold transition"
        >
          I have an account
        </Link>
      </div>
    </div>
  )
}

export default Home