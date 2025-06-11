import React from 'react'
import {NavLink} from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/add">
            <img className='w-5 h-5' src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="list">
            <img className='w-5 h-5' src={assets.list_icon} alt="" />
            <p className='hidden md:block'>List Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/editProducts">
            <img className='w-6 h-6' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAYZJREFUWEftl91NgzEMRW83gUmATWCS0klgE8oksAn0SJ+lNE0c5wepSM1L+xAnx9dOvpudrmTsroRDN5C8Ev9SkbtGP33P9FtEkVdJ+8AmR0lPhXmWgAvaAvmQ9CjpIImFvMUASQdxxNtgDZIqDg/ElCDLfJOWQAYBOACogqrvkl5KwR7I1wZQDHRIDCIvlSVW3NMD+dnoySI60nKgBkmYms+S3iTdl0pcA0FKFOkpS6oEANYf/AcKCEapoas3ay9IqRyskTYrEKlCZyqvUKTWE2yUNm0VgomzIB4EilAOfl2IWZBlEDMgoxDWN5yc6R4ZhWDj6hHu7ZEZiGUgsxDLQOxOyC+kntOxpDSlb08PxDJFcpBeiGUglIbNzZOY4WleVsk5XVIa8xQG8Ln5ix6LaCAXp/Uv/IhnGWoN775rjN61eFGjcprnOr6WZ+WjBRDmiFKMDEr5sH2JawY79NIjE1toBISY3K1drNNSJA1ovWtqkKFm7gEZVSMUdwOJ+pGQnCsn/QLih44jt/GtiQAAAABJRU5ErkJggg==' alt="" />
            <p className='hidden md:block'>Edit products</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/Orders">
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p className='hidden md:block'>Orders</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/Delivered">
            <img className='w-6 h-6' src={assets.parcel_icon} alt="" />
            <p className='hidden md:block'>Delivered Orders</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/edit">
            <img className='w-6 h-6' src={assets.image} alt="" />
            <p className='hidden md:block'>Change Images</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
