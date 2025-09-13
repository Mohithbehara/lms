import { message } from "antd";
import Course from "../models/course.js";

//Get All Courses

export const getAllCourse=async(requestAnimationFrame,res)=>{
    try {
        const courses = await Course.find({
            isPublished:true}).select(['-courseContent','-enrolledStudents']).populate({path:'educator'})

            res.json({success:true, courses})
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}

//GEt Course by Id

export const getCourseById=async(req,res)=>{
    const {id} = req.params

    try {
        const courseData= await Course.findById(id).populate({path:'educator'})

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter =>{
            chapter.chapterContent.forEach(lecture=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl="";
                }
            })
        })

        res.json({success:true,courseData})

    } catch (error) {

        res.json({success:false,message:error.message})
        
    }
}


