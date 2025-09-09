import React, { useContext } from 'react'
import { assets, calculateAverageRating } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
  const {currency} = useContext(AppContext)
  
  // Safety check to prevent errors if course data is incomplete
  if (!course) {
    return (
      <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-full flex flex-col'>
        <div className='animate-pulse'>
          <div className='bg-gray-200 h-40 rounded-lg mb-3'></div>
          <div className='bg-gray-200 h-5 rounded mb-2 w-4/5'></div>
          <div className='bg-gray-200 h-4 rounded mb-3 w-2/3'></div>
          <div className='bg-gray-200 h-5 rounded w-16'></div>
        </div>
      </div>
    )
  }

  // Get dynamic rating data
  const ratingData = calculateAverageRating(course.courseRatings)
  const enrolledCount = course.enrolledStudents ? course.enrolledStudents.length : 0

  return (
    <Link 
      to={'/course/'+course._id} 
      onClick={()=>scrollTo(0,0)} 
      className='block bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 h-full group cursor-pointer'
    >
      {/* Image Container - Smaller and more compact */}
      <div className='relative overflow-hidden rounded-lg mb-3 bg-gray-50'>
        <img 
          src={course.courseThumbnail || '/default-course.jpg'} 
          alt={course.courseTitle || 'Course thumbnail'}
          className='w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300'
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x160/f3f4f6/9ca3af?text=Course+Image'
          }}
        />
      </div>
      
      {/* Content Container - More compact */}
      <div className='flex flex-col h-32'>
        {/* Course Title - Smaller and consistent */}
        <h3 className='font-semibold text-base text-gray-800 mb-2 line-clamp-2 leading-tight h-10 overflow-hidden'>
          {course.courseTitle}
        </h3>
        
        {/* Rating Row - Simplified */}
        <div className='flex items-center gap-1.5 mb-3 flex-shrink-0'>
          {ratingData.count > 0 ? (
            <>
              <div className='flex items-center gap-1'>
                <span className='text-yellow-500 font-medium text-sm'>{ratingData.average}</span>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <img 
                      key={i} 
                      src={i < Math.floor(ratingData.average) ? assets.star : assets.star_blank} 
                      alt='star' 
                      className='w-3.5 h-3.5'
                    />
                  ))}
                </div>
              </div>
              <span className='text-gray-500 text-xs'>({ratingData.count} reviews)</span>
            </>
          ) : (
            <>
              <div className='flex items-center gap-1'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <img 
                      key={i} 
                      src={assets.star_blank} 
                      alt='star' 
                      className='w-3.5 h-3.5'
                    />
                  ))}
                </div>
              </div>
              <span className='text-gray-500 text-xs'>({enrolledCount} students)</span>
            </>
          )}
        </div>
        
        {/* Price - Positioned at bottom, smaller */}
        <div className='mt-auto'>
          <p className='text-blue-600 font-bold text-lg'>
            {currency || '$'}{(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
