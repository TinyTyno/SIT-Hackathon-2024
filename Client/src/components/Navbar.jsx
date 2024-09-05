import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({fixed=false}) => {
  return (
    <div className={`w-full  bg-[#ffffffbe] backdrop:blur-sm ${fixed?'fixed top-0 left-0 z-50 backdrop-blur-sm':'relative'}`}>
      <ul className='flex w-[90%] lg:w-[80%] py-6 m-auto flex-row list-none justify-between gap-12'>
        <li className='self-center'>
          <Link to={'/'}><img src='/Logo.svg' alt='logo' className='h-5 w-auto'/></Link>
        </li>
        <li className='self-center text-black hover:text-[#126ABC] ml-auto'>
          <Link to='/qna'>Q&A</Link>
        </li>
        <li className='self-center text-black hover:text-[#126ABC]'>
          <Link to='/login'>Login</Link>
        </li>

      </ul>
    </div>
  )
}

export default Navbar
