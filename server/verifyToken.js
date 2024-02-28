import jwt from "jsonwebtoken"
import { createError } from "./error.js"

export const verifyToken = (req,res,next) => {

    console.log("token verifying ....")

    const token = req.cookies.access_token

    if(!token) return next(createError(401,"You are not authenticated"))

    jwt.verify(token,process.env.JWT,(err,user)=>{

        if(err) return next(createError(403,"Invalid token!"))
        req.user = user
        console.log(user)

        next()
    })

    
}