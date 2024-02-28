import { createError } from "../error.js"
import Comment from "../models/Comment.js"
import Video from "../models/Video.js"

export const adddComments = async (req,res,next) => {

    const newComment = new Comment({...req.body,userId:req.user.id})

    try
    {
        const saveComment = await newComment.save()

        res.status(200).json(newComment)

    }catch(err){
        next(err)
    }
}

export const deleteComment = async (req,res,next) => {


    try
    {
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(comment.videoId)

        if(req.user.id == comment.userId || req.user.id == video.userId)
        {
            await Comment.findByIdAndDelete(req.params.id)

            res.status(200).json("COmment has been deleted")
        }
        else
        {
            next(createError(403,"you are unauthorized to delete"))
        }

    }catch(err){
        next(err)
    }
}

export const getComments = async (req,res,next) => {

    try
    {
        const comments = await Comment.find({videoId:req.params.videoId})

        res.status(200).json(comments)

    }catch(err){
        next(err)
    }
}