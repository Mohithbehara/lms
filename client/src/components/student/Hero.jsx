import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='w-full md:pt-36 pt-20 pb-16 px-6 md:px-0 bg-gradient-to-b from-cyan-100/70 text-center min-h-[70vh] flex items-center justify-center'>
      <div className='max-w-3xl mx-auto space-y-8'>
        {/* Main Heading */}
        
          <h1 className='md:text-home-heading-large text-home-heading-small  relative font-bold text-gray-800  max-w-3xl mx-auto'>
            Empower your future with the courses designed to 
            <span className='text-blue-600'> fit your choice.</span> 
            <img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-0'/>
          </h1>

          {/* Description */}
          <p className='text-gray-500 max-w-2xl mx-auto md:text-lg text-base leading-relaxed px-4 md:px-0'>
            We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
          </p>
        

        {/* Search Bar */}
        <div className='flex justify-center pt-4'>
          <SearchBar/>
        </div>
      </div>
    </div>

  )
}

export default Hero
