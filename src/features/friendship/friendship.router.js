import express from 'express'
import { friendshipController } from './friendship.controller.js';

const friendRoutes = express.Router();
const friendshipControllers = new friendshipController()

friendRoutes.get('/get-pending-requests',(req,res,next)=>{
    friendshipControllers.getPendingRequest(req,res,next);
});

friendRoutes.get('/toggle-friendship/:friendId',(req,res,next)=>{
    friendshipControllers.toggle(req,res,next);
});

friendRoutes.get('/response-to-request/:friendId/:status',(req,res,next)=>{
    friendshipControllers.respone(req,res,next);
});

friendRoutes.get('/get-friends/:userId',(req,res,next)=>{
    friendshipControllers.getUsersFriend(req,res,next);
});

export default friendRoutes;