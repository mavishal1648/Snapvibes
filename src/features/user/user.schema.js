import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name:{
        type:String,
        maxLength:[20,"Name cannot be greater than 20 characters"],
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.\w{2,3}$/,"Not a valid email"]
    },
    gender:{
        type:String,
        required:true,
        enum:['M','F']
    },
    avatar:String,
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        default:null
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Friend',
    }],
    requests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Friend'
    }],
    token:[{
        type:String
    }]
})