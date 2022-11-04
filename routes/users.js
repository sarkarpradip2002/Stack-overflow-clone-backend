import express from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import users from '../models/schema.js'

const app=express.Router();

app.post('/signup',async(req,res)=>{
    const {name,email,password,phone,latitude,longitude}=req.body;
    try {
      const existingUser=await users.findOne({email});
      const existingUserPhone=await users.findOne({phone});
      if(existingUser){
        return res.status(404).json("User already exists");
      }
      if(existingUserPhone){
        return res.status(404).json("User already exists");
      }
      const hashed=await bcrypt.hash(password,12);
      const adduser=await users.create({name,email,password: hashed,phone,latitude,longitude});
      const token=jwt.sign({email: adduser.email,id:adduser._id}, "text" , {expiresIn:'1h'})
      res.status(200).json({result:adduser , token});
      
    } catch (error) {
      res.status(500).json("Something went wrong!!");
    }
})

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        const finduser=await users.findOne({email});
        if(!finduser){
            return res.status(404).json("User doesn't exist!!");
        }
        const checkpw=await bcrypt.compare(password,finduser.password);
        if( !checkpw){
            return res.status(404).json("Invalid user details!!");
        }
        const token=jwt.sign({email: finduser.email,id:finduser._id}, "text" , {expiresIn:'1h'})
      res.status(200).json({result:finduser , token});

    } catch (error) {
        res.status(500).json("Something went wrong");
    }
})

app.post('/byPhone',async (req,res)=>{
    const {phone}=req.body;
    try {
      const finduser=await users.findOne({phone});
      if(!finduser){
        return res.status(404).json("User doesn't exist!!");
    }
    const token=jwt.sign({email: finduser.email,id:finduser._id}, "text" , {expiresIn:'1h'})
    res.status(200).json({result:finduser , token});
    } catch (error) {
      res.status(500).json("Something went wrong");
    }
})


export default app;