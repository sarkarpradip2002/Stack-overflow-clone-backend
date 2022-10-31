import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import users from "./routes/users.js"
import questions from "./routes/questions.js"
import answers from "./routes/answers.js";
import getusers from "./routes/getusers.js"

const url= "mongodb+srv://PradipStack:1234@stack-overflow-clone.kktg3lv.mongodb.net/?retryWrites=true&w=majority"; 

const app=express();

app.use(express.json({limit: "30mb" , extended : "true"}));
app.use(express.urlencoded({limit: "30mb" , extended : "true"}));
app.use(cors());

app.get('/',(req,res)=>{
    res.send("This is a stack overfloe clone api");
})

app.use('/user',users);
app.use('/Questions',questions);
app.use('/answer',answers);
app.use('/users',getusers)

const PORT= process.env.PORT || 5000;


mongoose.connect(url, {useNewUrlParser : true , useUnifiedTopology : true})
.then(()=>app.listen(PORT,()=>{console.log(`Server starting at PORT ${PORT}`)}))
.catch((err)=> console.log(err));