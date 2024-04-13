import mongoose from "mongoose";
import applicationError from "../../error-handler/application.error.js";
import { userSchema } from "./user.schema.js";
import bcrypt from 'bcrypt'

const userModel = mongoose.model('User',userSchema);

export default class userRepostiory{

    async signUp(user){
        try{  
            await new userModel(user).save();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    };
    async signIn(email,token){
        try{
            const checkEmail = await userModel.findOne({email:email});
            return checkEmail;
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async addToken(email,token){
        try{
            const checkEmail = await userModel.findOne({email:email});
            checkEmail.token.push(token);
            await checkEmail.save();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }

    async logOutFromALLDevices(email){
        try{
            const checkEmail = await userModel.findOne({email:email});
            checkEmail.token = [];
            await checkEmail.save();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async logout(email,token){
        try{
            const checkEmail = await userModel.findOneAndUpdate(
                {
                    email:email
                },
                {
                    $pull:{
                        token:token
                    }
                }
            )
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }


    async getUserDetails(userId){
        try{
            return await userModel.findById(userId);
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async getALL(){
        try{
            return await userModel.find();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }

    async update(updateDetails,avatar,id){
        try{
            // first search if user is present or not
            console.log(updateDetails);
            console.log(avatar);
            const user = await userModel.findById(id);
            if(!user){
                return{
                    code:404,
                    msg:"User Not found"
                }
            }
            //once user is found compare the oldPassword and userPassword for verification
            console.log(updateDetails.oldPassword);
            const checkPassword = await bcrypt.compare(updateDetails.oldPassword,user.password);
            console.log(checkPassword);
            if(!checkPassword){
                return{
                    code:400,
                    msg:"oldPassword is wrong..check your password then only update your profile"
                } 
            }
            // once password is confirmed changed the details
            const hashPassword = await bcrypt.hash(updateDetails.newPassword,12);
            user.name = updateDetails.name;
            user.email = updateDetails.email;
            user.avatar = avatar;
            user.password = hashPassword;
            return await user.save();
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
}