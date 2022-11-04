import express from 'express';
import users from '../models/schema.js'
import mongoose from 'mongoose';

const app=express.Router();

app.get('/',async (req,res)=>{
  try {
    const findUsers=await users.find();
    const allusers=[];
    findUsers.forEach((user)=>{
        allusers.push({_id: user._id , name : user.name ,latitude:user.latitude,longitude:user.longitude ,about: user.about , tags:user.tags, joinedOn :user.joinedOn})
    })
    res.status(200).json(allusers)
  } catch (error) {
    res.status(404).json(error);
  }
})

app.patch('/Update/:id',async(req,res)=>{
  const {id: _id}=req.params;
  const {name,about,tags}=req.body;

  if(!mongoose.Types.ObjectId.isValid(_id)){
    res.status(404).json("Question unavailaible...");
}

  try {
    const updateDetails=await users.findByIdAndUpdate(_id,{$set :{'name': name , 'about': about , 'tags': tags}} , {new : true});
    res.status(200).json(updateDetails)
  } catch (error) {
    res.status(404).json(error.message);
  }
})

export default app;