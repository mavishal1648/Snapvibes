import express from 'express'
import userController from './userController.js';
import { upload } from '../../middleware/fileUpload.middleware.js';

const userRoutes = express.Router();

const userControllers = new userController();

userRoutes.post('/signup',upload.single('avatar'),(req,res,next)=>{
    userControllers.signUp(req,res,next);
});

userRoutes.post('/signin',(req,res,next)=>{
    userControllers.signIn(req,res,next);
})

userRoutes.get('/logout',(req,res,next)=>{
    userControllers.logout(req,res,next);
})
userRoutes.get('/logout-all-devices',(req,res,next)=>{
    userControllers.logOutFromAllDevices(req,res,next);
})
userRoutes.get('/get-all-details',(req,res,next)=>{
    userControllers.getAllUserDetails(req,res,next);
})

userRoutes.get('/get-details/:userId',(req,res,next)=>{
    userControllers.getUserDetails(req,res,next);
})

userRoutes.put('/update-details/:userId',upload.single('avatar'),(req,res,next)=>{
    userControllers.updateDetails(req,res,next);
})
export default userRoutes;