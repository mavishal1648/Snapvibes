import mongoose from "mongoose";
import { userSchema } from "../user/user.schema.js";
import applicationError from "../../error-handler/application.error.js";
import bcrypt from 'bcrypt'
const userModel = mongoose.model('User', userSchema);
export default class otpRepository{

    async checkEmail(email){
        try{
            const findEmail = await userModel.findOne({
                email:email
            })
            if(!findEmail){
                return {
                    code: 404,
                    msg: "email Not found",
                };
            }

        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }

    async generateOtp(email,otp){
        try{
            const findUser = await userModel.findOne({email:email});
            findUser.otp = otp;
            await findUser.save();   
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async verifyOtp(email,otp,userId,password){
        try{
            const user = await userModel.findOne({email:email});
            if(user.otp!=otp){
                return {
                    code: 400,
                    msg: "Invalid OTP",
                };
            }
            else{
                return this.resetPassword(userId,password);
            }
        }catch(err){
            console.log(err);
            throw new applicationError("something went wrong with database",500);
        }
    }
    async resetPassword(userId, newPassword) {
        try {
            const hashPassword = await bcrypt.hash(newPassword,12);
            const updateUser = await userModel.findByIdAndUpdate(userId, 
                { 
                    password: hashPassword,
                    otp:null
                });
            if (!updateUser) {
                return{
                    code: 404,
                    msg: "Password did not reset"
                }
            }
            return "Password reset successfully"
        } catch (err) {
            console.log(err);
            throw new applicationError("something went wrong with database", 500);
        }
    }
}