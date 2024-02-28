//import User from "../models/User.js"
import { query } from "express"
import mongoose from "mongoose"
import { createError } from "../error.js"
import Video from "../models/Video.js"

const User = mongoose.model('User')

export const addVideo = async (req,res,next) => {

    const newVideo = new Video({userId:req.user.id, ...req.body})

    try{
        const savedVideo = await newVideo.save()

        res.status(200).json(savedVideo)
    }
    catch(err){
        next(err)
    } 

}

export const updateVideo = async (req,res,next) => {
    
    try{

        const video =await Video.findById(req.params.id)

        if(!video) return next(createError(404,"Video is not found"))

        if(video.userId == req.user.id)
        {
            console.log(video)
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },
            {
                new:true
            })

            console.log(updatedVideo)

            res.status(200).json(updatedVideo)
        }
        else
        {
            next(createError(401,"You are not allowed to update the video"))
        }

    }catch(err){

        next(err)
    }
}

export const deleteVideo =async (req,res,next) => {

    try{

        const video =await Video.findById(req.params.id)

        if(!video) return next(createError(404,"Video is not found"))

        if(video.userId == req.user.id)
        {
           await Video.findByIdAndDelete(req.params.id)
           
           res.status(200).json("Video deleted successfully")
        }
        else
        {
            next(createError(401,"You are not allowed to update the video"))
        }

    }catch(err){

        next(err)
    }
    
}

export const getVideo = async (req,res,next) => {

    try{    

        const video =await Video.findById(req.params.id)

        if(!video) return next(createError(404,"Video is not found"))

        res.status(200).json(video)

    }
    catch(err)
    {
        next(err)
    }
    
}


export const addView = async (req,res,next) => {

    try{

        const video = await Video.findById(req.params.id)

        if(!video) return next(createError(404,"Video is not found"))

        await Video.findByIdAndUpdate(req.params.id,{
            $inc:{views:1}
        })

        res.status(200).json("View has been incremented")
    }
    catch(err){
        next(err)
    }
}


export const trend = async (req,res,next) => {

    try{
       
       const videos = await Video.find().sort({views:-1})

       res.status(200).json(videos)
    }
    catch(err){
        next(err)
    }
}

export const random = async (req,res,next) => {

    try{
       
       const videos = await Video.aggregate([{$sample:{size:40}}])

       res.status(200).json(videos)
    }
    catch(err){
        next(err)
    }
}

export const subscribed = async (req,res,next) => {

    try {

        const user = await User.findById(req.user.id);

        console.log("user",user)
        const subscribedChannels = user.subscribedUsers;
        
        console.log("subscribed videos",subscribedChannels)

        const list = await Promise.all(
          subscribedChannels.map(async (channelId) => {
            return await Video.find({ userId: channelId });
          })
        );
    
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
      } catch (err) {
        next(err);
      }
}

export const getByTag = async (req,res,next) => {

    let query = req.query.tags
    const tags = query.split(",")

    try{
       
       const videos = await Video.find({tags: {$in:tags}}).limit(20)

       res.status(200).json(videos)
    }
    catch(err){
        next(err)
    }
}

export const search = async (req,res,next) => {

    const query = req.query.q

    try{
       
       const videos = await Video.find({title: {$regex:query,$options:"i"}})

       res.status(200).json(videos)
    }
    catch(err){
        next(err)
    }
}