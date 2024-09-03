import React from 'react'
import Navbar from '@/components/Navbar'
import StableSidebar from '@/components/StableSidebar'
const Homepage = () => {
  return (
    <main className='relative min-h-screen w-full'>
       <StableSidebar>
          <div className='w-full h-full bg-red-50'> Hello</div>
        </StableSidebar>
      <div className='w-[90%] lg:w-[80%] m-auto'>
      </div>
    </main>
  )
}

export default Homepage
