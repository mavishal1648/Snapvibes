import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    likeComment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like',
        }
    ]
})
