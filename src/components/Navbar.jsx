import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button onClick={()=>setToken('')} className="text-white bg-gray-600 rounded-full text-xs sm:text-sm px-5 py-2 sm:px-7 sm:py-2">Logout</button>
    </div>
  )
}

export default Navbar
