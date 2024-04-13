import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import applicationError from "../../error-handler/application.error.js";

const postModel = mongoose.model('Post',postSchema)

export default class postRepository{
    
    async addPost(userId,image,caption){
        console.log(image);
        try{
            const post = new postModel({
                user:userId,
                image:image,
                caption:caption
            });
            return await post.save();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }

    async getOnePost(id){
        try{
            return await postModel.findById(id);
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async getAllPosts(){
        try{
            return await postModel.find();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }

    async getAllPostByUser(id){
        try{
            return await postModel.find({
                user:id
            });
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async deletePost(id,user){
        try{
           // first check if post is present or not
           const post = await postModel.findById(id);
           if(!post){
            return {
                code:404,
                msg:"Post Not found"
            }
           }
           // check if user is the one who created that post
           if(post.user!=user){
            return {
                code:400,
                msg:"Post is not created by the user"
            }
           }
           //once these validations are checked..we can delete the post
           await postModel.findByIdAndDelete(id);
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }

    async updatePost(id,user,image,caption){
        try{
            const post = await postModel.findById(id);
            if(!post){
             return {
                 code:404,
                 msg:"Post Not found"
             }
            }
            // check if user is the one who created that post
           if(post.user!=user){
            return {
                code:400,
                msg:"Post is not created by the user"
            }
           }
           post.image = image;
           post.caption = caption;
           return await post.save();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
}