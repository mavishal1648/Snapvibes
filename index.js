import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { connectUsingMongoose } from './src/config/mongoose.js';
import applicationError from './src/error-handler/application.error.js';
import jwtAuth from './src/middleware/jwtAuthentication.middleware.js';
import userRoutes from './src/features/user/user.routes.js';
import postRoutes from './src/features/post/post.router.js';
import likeRoutes from './src/features/like/like.router.js';
import commentRoutes from './src/features/comment/comment.router.js';
import friendRoutes from './src/features/friendship/friendship.router.js';
import otpRoutes from './src/features/otp/otp.routes.js';


const server = express();

server.use(bodyParser.json());

server.use('/api/users',userRoutes);
server.use('/api/posts/',jwtAuth,postRoutes);
server.use('/api/likes',jwtAuth,likeRoutes);
server.use('/api/comments',jwtAuth,commentRoutes);
server.use('/api/friends',jwtAuth,friendRoutes);
server.use('/api/otp',jwtAuth,otpRoutes);

server.get('/',(req,res)=>{
    res.send('Welcome to socialMedia APIs');
})

server.use((err,req,res,next)=>{
    console.log(err);
    if(err  instanceof applicationError){
        return res.status(err.code).send(err.message)
    }
})

server.listen(7200,()=>{
    console.log('Server is listening to 7200 port');
    connectUsingMongoose();
})