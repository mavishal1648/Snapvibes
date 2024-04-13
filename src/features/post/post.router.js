import express from 'express'
import { upload } from '../../middleware/fileUpload.middleware.js';
import postController from './post.controller.js';
const postRoutes = express.Router();
const postControllers = new postController();


postRoutes.post('/',upload.single('image'),(req,res,next)=>{
    postControllers.addPost(req,res,next);
})
postRoutes.get('/',(req,res,next)=>{
    postControllers.getAllPostByUser(req,res,next);
})
postRoutes.get('/all',(req,res,next)=>{
    postControllers.getAllPosts(req,res,next);
})
postRoutes.get('/:postId',(req,res,next)=>{
    postControllers.getOnePost(req,res,next);
})
postRoutes.delete('/:postId',(req,res,next)=>{
    postControllers.deletePost(req,res,next);
})
postRoutes.put('/:postId',upload.single('image'),(req,res,next)=>{
    postControllers.updatePost(req,res,next);
})
export default postRoutes;