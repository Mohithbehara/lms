import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import Loading from '../../components/student/Loading';

const CoursesList = () => {
    
    const { navigate, allCourses, loading, error } = useContext(AppContext);
    const { input } = useParams();
    const [filteredCourse, setFilteredCourse] = useState([]);

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice();
            if (input) {
                setFilteredCourse(
                    tempCourses.filter(
                        item => item.courseTitle && item.courseTitle.toLowerCase().includes(input.toLowerCase())
                    )
                );
            } else {
                setFilteredCourse(tempCourses);
            }
        } else {
            setFilteredCourse([]);
        }
    }, [allCourses, input]);

    // Show loading state
    if (loading) {
        return (
            <div className='min-h-screen flex justify-center items-center'>
                <Loading />
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className='min-h-screen flex justify-center items-center'>
                <div className='text-center'>
                    <p className='text-red-500 text-lg mb-4'>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
      <>
        <div className='relative md:px-36 px-8 pt-20 text-left'>
            <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                <div>
                    <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                    <p className='text-gray-500'>
                        <span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>Home</span> / <span>Course List</span>
                    </p>
                    
                </div>
                <SearchBar data={input} />
              </div>    
                { input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
                    <p>{input}</p>
                    <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => navigate('/course-list')} />
                </div>
                }
            

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
                {filteredCourse && filteredCourse.length > 0 ? (
                    filteredCourse.map((course, index) => (
                        <CourseCard key={course._id || index} course={course} />
                    ))
                ) : (
                    <div className='col-span-full text-center py-16'>
                        <p className='text-gray-500 text-lg'>
                            {input ? `No courses found for "${input}"` : 'No courses available'}
                        </p>
                    </div>
                )}
            </div>
          </div>
          <Footer />
        
      </>
    )
}

export default CoursesList;