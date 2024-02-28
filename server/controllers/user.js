import { createError } from "../error.js"
import User from "../models/user.js"
import Video from "../models/Video.js"


export const updateUser = async (req,res,next) => {

    if(req.params.id === req.user.id)
    {

        try
        {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true})

            res.status(200).json(updatedUser)
        }
        catch(err){
            next(err)
        }

    }
    else
    {
        return next(createError(403,"You are not allowed to update!"))
    }
}

export const deleteUser = async (req,res,next) => {

    if(req.params.id === req.user.id)
    {

        try
        {
            await User.findByIdAndRemove(req.params.id)

            res.status(200).json("User has been deleted!")
        }
        catch(err){
            next(err)
        }

    }
    else
    {
        return next(createError(403,"You are not allowed to delete!"))
    }
}

export const getUser = async (req,res,next) => {
    
        try
        {
            const user = await User.findById(req.params.id)

            res.status(200).json(user)
        }
        catch(err){
            next(err)
        }

}

export const subscribe = async (req,res,next) => {

    try
    {

        console.log(req.user.id == req.params.id)

        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
          });

        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:1}
        })

       const user =  await User.findById(req.params.id)

        res.status(200).json({"message":"Subscription successfull",user})
    }
    catch(err){
        next(err)
    }
}

export const unSubsribe = async (req,res,next) => {

    try
    {
        await User.findByIdAndUpdate(req.user.id,{
            $pull:{subscribedUsers:req.params.id}
        })

        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:-1}
        })

        res.status(200).json("Unsubscription successfull")
    }
    catch(err){
        next(err)
    }
}

export const like = async (req,res,next) => {

    const id = req.user.id
    const videoId = req.params.videoId

    try{

        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id}
        })

        res.status(200).json("Liked")
    }
    catch(err)
    {
        next(err)
    }
}

export const disLike = async (req,res,next) => {

    const id = req.user.id
    const videoId = req.params.videoId

    try{

        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id}
        })

        res.status(200).json("Disliked")
    }
    catch(err)
    {
        next(err)
    }
}
