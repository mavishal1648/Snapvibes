import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { postSchema } from "../post/post.schema.js";
import applicationError from "../../error-handler/application.error.js";

const commentModel = new mongoose.model("Comment", commentSchema);
const postModel = new mongoose.model("Post", postSchema);
export default class commentRepository {
  async add(postId, userId, comment) {
    try {
      // first check if post is present or not..
      const post = await postModel.findById(postId);
      if (!post) {
        return {
          code: 404,
          msg: "Post Not found",
        };
      }
      const addComment = await commentModel({
        user: userId,
        post: postId,
        comment: comment,
      });
      addComment.save();
      post.comments.push(addComment._id);
      await post.save();
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }

  async get(postId) {
    try {
      // first check if post is present or not..
      const post = await postModel.findById(postId);
      if (!post) {
        return {
          code: 404,
          msg: "Post Not found",
        };
      }
      const comments = await commentModel.find({
        post: postId,
      });
      if (!comments) {
        return {
          code: 404,
          msg: "No Comments are found",
        };
      }
      return comments;
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }

  async update(commentId, userId, post, comments) {
    try {
      // first check if post is present or not..
      const posts = await postModel.findById(post);
      if (!posts) {
        return {
          code: 404,
          msg: "Post Not found",
        };
      }
      //check if comment is present or not...
      const updateComment = await commentModel.findById(commentId);
      if (!updateComment) {
        return {
          code: 404,
          msg: "No Comment found",
        };
      }
      // check if its the user who commented is only updating or not
      if (updateComment.user != userId) {
        return {
          code: 404,
          msg: "Only the user who commented can update the comment",
        };
      }
      updateComment.comment = comments;
      return await updateComment.save();
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }

  async delete(commentId, userId, post) {
    try {
      const posts = await postModel.findById(post);
      console.log(posts);
      if (!posts) {
        return {
          code: 404,
          msg: "Post Not found",
        };
      }
      //check if comment is present or not...
      const deleteComment = await commentModel.findById(commentId);
      if (!deleteComment) {
        return {
          code: 404,
          msg: "No Comment found",
        };
      }
      if (deleteComment.user != userId && posts.user != userId) {
        return {
          code: 404,
          msg: "Only the user or postOwner can delete the comment",
        };
      }
      await commentModel.findByIdAndDelete(commentId);
      await postModel.updateOne(
        {
          _id: post,
        },
        {
          $pull: {
            comments: new mongoose.Types.ObjectId(commentId),
          },
        }
      );
      await posts.save();
    } catch (err) {
      console.log(err);
      throw new applicationError("something went wrong with database", 500);
    }
  }
}
