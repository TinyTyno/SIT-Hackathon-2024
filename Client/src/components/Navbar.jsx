import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <ul className='flex flex-row list-none justify-between gap-5 bg-[#ffffffbe] backdrop:blur-sm'>
        <li className='self-center'><img src='/Logo.svg' alt='logo' className='h-5 w-auto'/></li>
        <li className='self-center text-black'>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
