import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-slate-800 text-white'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16'>
          {/* Logo and Description */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>⚡</span>
              </div>
              <span className='text-2xl font-bold'>Edemy</span>
            </div>
            <p className='text-gray-300 leading-relaxed text-sm pr-8'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                  Home
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                  About us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                  Contact us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Subscribe to our newsletter</h3>
            <p className='text-gray-300 mb-4 leading-relaxed text-sm'>
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <div className='flex gap-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-3 py-2 bg-slate-700 text-white placeholder-gray-400 border border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors duration-200 whitespace-nowrap text-sm'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className='border-t border-slate-700'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <p className='text-center text-gray-400 text-sm'>
            Copyright 2024 © Edemy. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
