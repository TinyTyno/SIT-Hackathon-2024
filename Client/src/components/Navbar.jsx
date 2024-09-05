import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='w-full '>
      <ul className='flex w-[90%] lg:w-[80%] py-6 m-auto flex-row list-none justify-between gap-5 bg-[#ffffffbe] backdrop:blur-sm'>
        <li className='self-center'><img src='/Logo.svg' alt='logo' className='h-5 w-auto'/></li>
        <li className='self-center text-black hover:text-[#126ABC]'>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
