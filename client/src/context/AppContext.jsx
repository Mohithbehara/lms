import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext()


export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY || '$'

    const [allCourses, setAllCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isEducator, setIsEducator]=useState(true)
    const [enrolledCourses, setEnrolledCourses]=useState([])

    const navigate=useNavigate()
    // Fetch all courses
    const fetchAllCourses = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Simulate API call delay for better UX
            await new Promise(resolve => setTimeout(resolve, 100))
            
            if (dummyCourses && Array.isArray(dummyCourses)) {
                setAllCourses(dummyCourses)
                console.log("Courses loaded successfully:", dummyCourses.length, "courses")
            } else {
                console.error("dummyCourses is not a valid array")
                setError("Failed to load courses data")
                setAllCourses([])
            }
        } catch (err) {
            console.error("Error fetching courses:", err)
            setError("Failed to fetch courses")
            setAllCourses([])
        } finally {
            setLoading(false)
        }
    }

    //Function to calculate average rating of course
    const calculateRating = (course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating+=rating.rating
        })
        return totalRating/course.courseRatings.length
    }

    //Function to Calculate Course Chapter Time

    const calculateChapterTime = (chapter) => {
    let time = 0
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
}

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {
        let time = 0

        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }
    
    // Function to calculate no . of lectures in the course

    const calculateNoOfLectures = (course)=>{
        let totalLectures=0;
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures+=chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    //Fetch user Enrolled courses
    const fetchUserEnrolledCourses=async ()=>{
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        console.log("Initializing AppContext...")
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, [])

    const value = {
        currency,
        allCourses,
        loading,
        error,
        navigate,
        calculateRating,
        isEducator,
        enrolledCourses,
        setIsEducator,
        calculateChapterTime,
        calculateNoOfLectures,
        calculateCourseDuration,
        fetchAllCourses,
        fetchUserEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
