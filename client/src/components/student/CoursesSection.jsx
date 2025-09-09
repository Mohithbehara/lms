import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
import Loading from './Loading'

const CoursesSection = () => {
  const { allCourses, loading, error } = useContext(AppContext)

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>
        Discover our top-rated courses across various categories. From coding and design to <br/> business and wellness, our courses are crafted to deliver results.
      </p>
      
      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-16'>
          <Loading />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className='text-center py-16'>
          <p className='text-red-500 text-lg'>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className='mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Courses Grid */}
      {!loading && !error && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 auto-rows-fr'>
            {allCourses && allCourses.length > 0 ? (
              allCourses.slice(0, 4).map((course, index) => (
                <div key={course._id || index} className='flex'>
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className='col-span-full text-center py-16'>
                <p className='text-gray-500 text-lg'>No courses available</p>
              </div>
            )}
          </div>
          
          {allCourses && allCourses.length > 0 && (
            <div className='text-center mt-8'>
              <Link 
                to='/course-list' 
                onClick={() => scrollTo(0, 0)}
                className='inline-block text-gray-500 border border-gray-500/30 px-10 py-3 rounded hover:bg-gray-50 transition-colors'
              >
                Show all courses
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CoursesSection
