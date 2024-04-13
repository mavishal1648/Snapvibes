import mongoose from "mongoose";
import applicationError from "../../error-handler/application.error.js";
import { likeSchema } from "./like.schema.js";
import { postSchema } from "../post/post.schema.js";
import { commentSchema } from "../comment/comment.schema.js";

const postModel = new mongoose.model("Post", postSchema);
const likeModel = new mongoose.model("Like", likeSchema);
const commentModel = new mongoose.model("Comment", commentSchema);

export default class likeRepository {
  async checkPost(id) {
    try {
      //check if id is post or not
      const post = await postModel.findById(id);
      console.log(post);
      if (!post) {
        return "Post not found";
      }
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }
  async checkComment(id) {
    try {
      //check if id is comment or not
      const comment = await commentModel.findById(id);
      if (!comment) {
        return "comment not found";
      }
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }
  async toggle(likeId, userId, likeable) {
    try {
      let id;
      if (likeable === "comment") {
        //find the comment
        id = await commentModel.findById(likeId);
        console.log(id);
        if (!id) {
          return {
            code: 400,
            msg: "comment not found",
          };
        }
        //check if the user has already liked the comment..if he has then he cant like it once again
        const commentLiked = await commentModel.findOne({
          _id: likeId,
          likeComment: userId,
        });
        if (commentLiked) {
          return {
            code: 400,
            msg: "Comment is already liked by the user",
          };
        }
        await new likeModel({
          user:userId,
          likeable:likeId,
          type:'Comment'
        }).save()
        id.likeComment.push(userId);
        await id.save();
      } else if (likeable === "post") {
        //find the post
        id = await postModel.findById(likeId);
        if (!id) {
          return {
            code: 400,
            msg: "comment not found",
          };
        }
        //check if the user has already liked the post..if he has then he cant like it once again
        const postLiked = await postModel.findOne({
          _id: likeId,
          likes: userId,
        });
        if (postLiked) {
          return {
            code: 400,
            msg: "post is already liked by the user",
          };
        }
        await new likeModel({
          user:userId,
          likeable:likeId,
          type:'Post'
        }).save()
        id.likes.push(userId);
        await id.save();
      }
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }

  async getLikes(likeId,getable){
    try{
      let id;
      if (getable === "comment") {
        //find the comment
        id = await commentModel.findById(likeId);
        console.log(id);
        if (!id) {
          return {
            code: 400,
            msg: "comment not found",
          };
        }
        const getComment = await likeModel.find({
          likeable:id
        })
        return getComment;
      }else if (getable === "post") {
        //find the post
        id = await postModel.findById(likeId);
        if (!id) {
          return {
            code: 400,
            msg: "comment not found",
          };
        }
        const getLike = await likeModel.find({
          likeable:id
        })
        return getLike;
      }
    }catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }
}
