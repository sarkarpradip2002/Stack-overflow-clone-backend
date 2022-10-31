import express from 'express';
import questions from '../models/questions.js'
import mongoose from 'mongoose';
import auth from '../middlewares/auth.js';

const app=express.Router();

app.post('/AskQuestion',async(req,res)=>{
   const postQuestions=req.body;
   const post=new questions({...postQuestions, userId: req.body.userId})
   try {
    await post.save();
    res.status(200).json(post);
   } catch (error) {
    console.log(error);
    res.status(404).json("Couldn't post a new question !!");
   }
})

app.get('/Get',async(req,res)=>{
   try {
      const questionsList=await questions.find();
       res.status(200).json(questionsList);
   } catch (error) {
      console.log(error);
      res.status(404).json("Failed to fetch!!");
   }
})

app.delete('/Delete/:id',async (req,res)=>{
   const {id: _id}=req.params;

   if(!mongoose.Types.ObjectId.isValid(_id)){
      res.status(404).json("Question unavailaible...");
  }

  try {
   await questions.findByIdAndDelete(_id);
   res.status(200).json({mesaage: "Question Deleted Successfully"});
  } catch (error) {
   res.status(404).json({message: error.mesaage});
  }
})

app.patch('/Votes/:id' ,async(req,res)=>{ 
   const {id: _id}=req.params;
   const {value , userId}=req.body;

   if(!mongoose.Types.ObjectId.isValid(_id)){
      return res.status(404).send('question unavailable...');
  }

  try {
   const question=await questions.findById(_id);
   const upvote=question.upVote.findIndex((id)=> id===String(userId))
   const downvote=question.downVote.findIndex((id)=> id===String(userId))

   if(value=='upvote'){
      if(downvote!==-1){
         question.downVote= question.downVote.filter((id)=> id!==String(userId));
      }
      if(upvote===-1){
         question.upVote.push(userId)
      }
      else{
         question.upVote= question.upVote.filter((id)=> id!==String(userId));
      }
   }

   if(value=='downvote'){
      if(upvote!==-1){
         question.upVote= question.upVote.filter((id)=> id!==String(userId));
      }
      if(downvote===-1){
         question.downVote.push(userId)
      }
      else{
         question.downVote= question.downVote.filter((id)=> id!==String(userId));
      }
   }

   await questions.findByIdAndUpdate(_id,question);
   res.status(200).json({message: "Voting Updated"})
  } catch (error) {
    res.status(200).json({message: error.message})
  }
})

export default app; 