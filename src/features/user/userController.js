import jwt from "jsonwebtoken";
import userModel from "./user.model.js";
import userRepostiory from "./user.repository.js";
import bcrypt from 'bcrypt'

let token_arr = [];
export default class userController{
    constructor(){
        this.userRepostiory = new userRepostiory();
    }
    async signUp(req,res,next){
        const {name,email,gender,password} = req.body
        const avatar = req.file.filename;
        try{
            const hashPassword = await bcrypt.hash(password,12);
            const user = new userModel(name,email,gender,avatar,hashPassword);
            await this.userRepostiory.signUp(user);
            res.status(201).send(user);
        }catch(err){
            next(err);
        }
    };

    async signIn(req,res,next){
        const {email,password} = req.body
        try{
            const user = await this.userRepostiory.signIn(email);
            if(!user){
                return res.status(400).send("Incorrect Credentials");
            }
            else{
                const result = bcrypt.compare(password,user.password);
                if(result){
                    const token = jwt.sign(
                    {
                        userID : user._id,
                        email: user.email
                    },
                    process.env.JWT_TOKEN,
                    {
                        expiresIn:"1h"
                    }
                );
                req.session = {
                    userID: user._id,
                    token: token
                };
                token_arr.push(token);
                await this.userRepostiory.addToken(email,token);
                res.status(200).send(token);
                }else{
                    return res.status(400).send("Incorrect Credentials");
                }
            }
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
   
    async getUserDetails(req,res,next){
        try{
            
            const user = await this.userRepostiory.getUserDetails(req.params.userId);
            if(!user){
                return res.status(404).send("User Not Found");
            }
            return res.status(200).send(user);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async getAllUserDetails(req,res,next){
        try{
            const users = await this.userRepostiory.getALL();
            if(!users){
                return res.status(404).send("Users Not Present!");
            }
            return res.status(200).send(users);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async updateDetails(req,res,next){
        try{
            const id = req.params.userId;
            const avatar = req.file.filename;
            const updatedProfile = await this.userRepostiory.update(req.body,avatar,id);
            if(updatedProfile.code){
                return res.status(updatedProfile.code).send(updatedProfile.msg);
            }else{
                return res.status(200).send(updatedProfile);
            }
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async logOutFromAllDevices(req,res,next){
        const {email} = req.body
        try{
            const user = await this.userRepostiory.signIn(email);
            if(!user){
                return res.status(400).send("Incorrect Credentials");
            }
            await this.userRepostiory.logOutFromALLDevices(email);
            return res.status(200).send("LogOut from all devices done!");
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async logout(req,res,next){
        const {email,token} = req.body
        try{
            const user = await this.userRepostiory.signIn(email);
            if(!user){
                return res.status(400).send("Incorrect Credentials");
            }
            await this.userRepostiory.logout(email,token);
            return res.status(200).send("Logout done!");
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
}