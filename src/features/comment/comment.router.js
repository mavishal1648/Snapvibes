import express from 'express'
import commentController from './comment.controller.js';

const commentControllers = new commentController();
const commentRoutes = express.Router();

commentRoutes.post('/:postId',(req,res,next)=>{
    commentControllers.addComment(req,res,next);
})
commentRoutes.get('/:postId',(req,res,next)=>{
    commentControllers.getComment(req,res,next);
})
commentRoutes.put('/:commentId',(req,res,next)=>{
    commentControllers.updateComment(req,res,next);
})
commentRoutes.delete('/:commentId',(req,res,next)=>{
    commentControllers.deleteComment(req,res,next);
})
export default commentRoutes;