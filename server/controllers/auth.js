import mongoose from "mongoose";
import User from "../models/user.js"
import { createError } from "../error.js"
import bcrypt, { compareSync } from "bcrypt"
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {

    try {

        console.log(req.body)

        const salt = bcrypt.genSaltSync(10)

        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({ ...req.body, password: hashedPassword })

        await newUser.save()
        console.log(4)
        res.status(200).send("User has been created!")
        console.log(5)
    }
    catch (err) {
        console.log(err)
    }
}

export const signin = async (req, res, next) => {

    try {

        console.log(req.body)

        const user = await User.findOne({ "name": req.body.name })

        if (!user) return next(createError(404, "User not found!"))

        const result = await bcrypt.compare(req.body.password, user.password)

        console.log(result)

        if (!result) return next(createError(400, "Wrong password!"))

        const { password, ...other } = user._doc

        const token = jwt.sign({ id: user._id }, process.env.JWT)

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)

    }
    catch (err) {
        console.log(err)
    }
}

export const googleAuth = async (req,res,next) => {

    try {

    const user = await User.findOne({ email: req.body.email })


        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            res.cookie('access_token', token, {
                httpOnly: true,
            }).status(200).json(user._doc)

        }
        else {

            const newUser = User({ ...req.body, fromGoole: true })

            const savedUser = await newUser.save()

            const token = jwt.sign({ id: savedUser._id }, process.env.JWT)
            res.cookie('access_token', token, {
                httpOnly: true,
            }).status(200).json(savedUser._doc)
        }

    } catch (err) {

        next(err)

    }

}