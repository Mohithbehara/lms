import React from 'react'
// import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='py-20 px-6 md:px-0 bg-gray-50 text-center'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800'>
          Learn anything, anytime, anywhere
        </h1>
        
        <p className='text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed'>
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button className='bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm'>
            Get started
          </button>
          
          <button className='flex items-center gap-2 bg-transparent text-gray-700 font-semibold px-8 py-4 rounded-lg hover:text-gray-900 transition-colors duration-200'>
            Learn more 
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallToAction
