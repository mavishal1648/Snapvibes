import express from 'express'
import otpController from './otp.controller.js';

const otpRoutes = express.Router();
const otpControllers = new otpController();
otpRoutes.post('/send',(req,res,next)=>{
    otpControllers.send(req,res,next);
})
otpRoutes.post('/verify',(req,res,next)=>{
    otpControllers.verify(req,res,next);
})

export default otpRoutes;