import express from 'express'
import likeController from './like.controller.js';
const likeControllers = new likeController();
const likeRoutes = express.Router();

likeRoutes.get('/toggle/:id',(req,res,next)=>{
    likeControllers.toggleLike(req,res,next);
})
likeRoutes.get('/:id',(req,res,next)=>{
    likeControllers.getLikes(req,res,next);
})
export default likeRoutes;