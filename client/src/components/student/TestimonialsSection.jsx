import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='py-16 px-8 md:px-20 lg:px-32 max-w-6xl mx-auto'>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-medium text-gray-800 mb-4'>Testimonials</h2>
        <p className='text-base text-gray-500 max-w-3xl mx-auto leading-relaxed'>
          Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.
        </p>
      </div>

      {/* Testimonials Grid - More compact */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto'>
        {dummyTestimonial.map((testimonial, index) => (
          <div key={index} className='bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col'>
            {/* Header with Profile */}
            <div className='flex items-center gap-3 px-4 py-4 bg-gray-50 border-b border-gray-100'>
              <img  
                className='h-10 w-10 rounded-full object-cover flex-shrink-0' 
                src={testimonial.image} 
                alt={testimonial.name}
              />
              <div className='flex-1 min-w-0'>
                <h3 className='text-sm font-semibold text-gray-800 truncate'>{testimonial.name}</h3>
                <p className='text-xs text-gray-600 truncate'>{testimonial.role}</p>
              </div>
            </div>
            
            {/* Content */}
            <div className='p-4 flex-1 flex flex-col'>
              {/* Rating Stars */}
              <div className='flex gap-0.5 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <img 
                    className='h-4 w-4' 
                    key={i} 
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} 
                    alt="star"
                  />
                ))}
              </div>
              
              {/* Feedback Text */}
              <p className='text-sm text-gray-600 leading-relaxed line-clamp-4 mb-4'>
                {testimonial.feedback}
              </p>
              
              {/* Read More Button */}
              <div className='mt-auto'>
                <a href="#" className='text-blue-500 hover:text-blue-600 underline text-sm transition-colors duration-200'>
                  Read more
                </a>
              </div>
            </div>
            
            {/* Bottom spacing */}
            <div className='pb-4'></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection