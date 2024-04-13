import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    image:{
        type:String,
        required:true
    },
    caption:String,
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
})
