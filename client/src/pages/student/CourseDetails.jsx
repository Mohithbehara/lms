import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';

const CourseDetails = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null); // For replacing course image

    const context = useContext(AppContext);
    const { allCourses, calculateRating, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime, currency } = context || {};

    const fetchCourseData = async () => {
        if (!allCourses || allCourses.length === 0) return;
        const findCourse = allCourses.find((course) => course._id === id);
        setCourseData(findCourse);
    };

    useEffect(() => {
        fetchCourseData();
    }, [allCourses, id]);

    const toggleSection = (index) => {
        setOpenSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // Handle preview video - replace course image
    const handlePreviewVideo = (lecture) => {
        const videoId = getYouTubeVideoId(lecture.lectureUrl);
        if (videoId) {
            setCurrentVideo({
                videoId: videoId,
                title: lecture.lectureTitle
            });
        }
    };

    // Close preview modal (keep for backward compatibility if needed)
    const closePreviewModal = () => {
        setPlayerData(null);
    };

    return courseData ? (
        <>
            {/* Background Gradient - Full Width */}
            <div className="bg-gradient-to-b from-cyan-100 via-cyan-50 to-white">
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Header Info + Course Structure + Description */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="py-4">
                                <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>{courseData.courseTitle}</h1>
                                <p className='text-lg text-gray-700 mb-4' dangerouslySetInnerHTML={{ __html: courseData?.courseDescription?.slice(0, 200) || 'Course description not available.' }}></p>
                        
                                {/* Review and Ratings */}
                                <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6'>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-semibold">{calculateRating ? calculateRating(courseData) : '0.0'}</span>
                                        <span>({courseData?.courseRatings?.length || 0} ratings)</span>
                                    </div>
                                    <div>{courseData?.enrolledStudents?.length || 0} students</div>
                                    <div>Course by <span className='text-blue-600 font-semibold'>GreatStack</span></div>
                                </div>
                            </div>
                            
                            {/* Course Structure */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">Course Structure</h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {courseData?.courseContent?.map((chapter, index) => {
                                        const chapterLectures = chapter?.chapterContent?.length || 0;
                                        const isExpanded = openSections[index];
                                        
                                        return (
                                            <div key={index} className="">
                                                <button
                                                    onClick={() => toggleSection(index)}
                                                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                                                >
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 mb-1">
                                                            {chapter.chapterTitle}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {chapterLectures} lectures • {calculateChapterTime ? calculateChapterTime(chapter) : '0m'}
                                                        </p>
                                                    </div>
                                                    <div className="text-gray-400">
                                                        <svg 
                                                            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                                
                                                {isExpanded && chapter?.chapterContent && (
                                                    <div className="px-6 pb-4 bg-gray-50">
                                                        {chapter.chapterContent.map((lecture, i) => (
                                                            <div key={i} className="flex items-center gap-3 py-2 text-sm">
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                                                <span className="text-gray-700 flex-grow">{lecture.lectureTitle}</span>
                                                                <div className="flex items-center gap-2">
                                                                    {lecture.isPreviewFree && (
                                                                        <button
                                                                            onClick={() => handlePreviewVideo(lecture)}
                                                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1"
                                                                        >
                                                                            <img src={assets.play_icon} alt="Play" className="w-3 h-3" />
                                                                            Preview
                                                                        </button>
                                                                    )}
                                                                    <span className="text-gray-500">{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Course Description */}
                            <div className="mb-16">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Description</h2>
                                <div className="text-gray-700 leading-relaxed space-y-4">
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: courseData?.courseDescription || 'No detailed description available.' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Course Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                                    {/* Course Image / Video */}
                                    <div className="aspect-video bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center relative">
                                        {currentVideo ? (
                                            <div className="w-full h-full">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                                                    title={currentVideo.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : courseData?.courseThumbnail ? (
                                            <img 
                                                src={courseData.courseThumbnail} 
                                                alt={courseData.courseTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center text-white p-8">
                                                <div className="text-4xl font-bold mb-2">Course</div>
                                                <div className="text-xl">Preview</div>
                                            </div>
                                        )}
                                        
                                        {/* Price Badge - hide when video is playing */}
                                        {!currentVideo && (
                                            <div className="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                                🔥 5 days left at this price!
                                            </div>
                                        )}
                                    </div>
                                    {/* Course Info */}
                                    <div className='p-6'>
                                        {/* Pricing */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    {currency || '$'}{((courseData?.coursePrice || 0) - (courseData?.discount || 0) * (courseData?.coursePrice || 0) / 100).toFixed(2)}
                                                </span>
                                                {(courseData?.discount || 0) > 0 && (
                                                    <>
                                                        <span className="text-lg text-gray-500 line-through">
                                                            {currency || '$'}{courseData?.coursePrice || '0.00'}
                                                        </span>
                                                        <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
                                                            {courseData?.discount || 0}% off
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Course Stats */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="font-semibold">{calculateRating ? calculateRating(courseData) : '0.0'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{calculateCourseDuration ? calculateCourseDuration(courseData) : 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>{calculateNoOfLectures ? calculateNoOfLectures(courseData) : 0} lessons</span>
                                            </div>
                                        </div>
                                        
                                        {/* Enroll Button */}
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-4">
                                            {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                                        </button>
                                        
                                        {/* What's in the course */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">What's in the course?</h3>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span>Lifetime access with free updates</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span>Step-by-step, hands-on project guidance</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span>Downloadable resources and source code</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span>Quizzes to test your knowledge</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span>Certificate of completion</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer/>
        </>
    ) : <Loading />;
};

export default CourseDetails;
