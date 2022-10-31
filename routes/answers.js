import express from 'express';
import questions from '../models/questions.js'
import mongoose from 'mongoose'
import auth from '../middlewares/auth.js';

const app=express.Router();

app.patch('/post/:id',async (req,res)=>{
    const {id: _id}=req.params;
    const {userId, noOfAnswers , answerBody , userAnswered} =req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(404).json("Question unavailaible...");
    }

    updateNoOfAnswers(_id,noOfAnswers);

    try {
        const updateanswer=await questions.findByIdAndUpdate(_id,{ $addToSet: { 'answer': [{answerBody,userAnswered , userId}]}})
        res.status(200).json(updateanswer);
    } catch (error) {
        res.status(404).json(error);
    }
    
})

const updateNoOfAnswers=async (_id, noOfAnswers)=>{
   try {
      await questions.findByIdAndUpdate(_id,{$set : { "noOfAnswers": noOfAnswers
    }})
   } catch (error) {
     console.log(error);
   }
}

app.patch('/Delete/:id',async (req,res)=>{
    const {id: _id}=req.params;
    const {answerId,noOfAnswers}=req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(404).json("Question unavailaible...");
    }

    if(!mongoose.Types.ObjectId.isValid(answerId)){
        res.status(404).json("Answer unavailaible...");
    }

    updateNoOfAnswers(_id,noOfAnswers);

    try {
      await questions.updateOne(
        {_id},
        {$pull: {'answer' : {_id: answerId}}},
      ) 

      res.status(200).json({message: "Answer Deleted"});
    } catch (error) {
        res.status(404).json({message : error.message});
    }
})

export default app;