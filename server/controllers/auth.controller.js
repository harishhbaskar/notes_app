import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN ,JWT_SECRET } from '../config/env.js'
import User from '../models/user.model.js'

export const signIn = async (req ,res , next) => {

    try{
        const {email , password } = req.body;

        const user = await User.findOne({email});

        if(!user){
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password,user.password );

        if(!isPasswordValid){
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId : user._id},JWT_SECRET,{expiresIn : JWT_EXPIRES_IN});

        const userObject = {
            _id : user._id,
            name : user.name,
            email:user.email,
        }
        

        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            data : {
                token,
                user: userObject,
            }
        })

    }catch(error){
        next(error);
    }

}
export const signUp = async (req,res ,next) => {


    try{
        const {name , email , password} = req.body;

        if(!password){
            const error =  new Error("Password is important")
            error.statusCode = 404;
            throw error;
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            const error = new Error("User already exists")
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({name , email , password:hashedPassword});

        const token = jwt.sign({userId : newUser._id},JWT_SECRET,{expiresIn : JWT_EXPIRES_IN});



        const userObject = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
        

        res.status(201).json({
            success:true,
            message : "User created successfully",
            data : {
                token,
                user : userObject,
            }
        })
    }catch(error){
        next(error);
    }

}

export const signOut = (req,res) => {
    res.send("signout")
}

export const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        data: { user: req.user }
    });
}