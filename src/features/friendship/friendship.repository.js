import mongoose from "mongoose";
import { friendshipSchema } from "./friendship.schema.js";
import { userSchema } from "../user/user.schema.js";
import applicationError from "../../error-handler/application.error.js";

const friendModel = mongoose.model('Friend', friendshipSchema);
const userModel = mongoose.model('User', userSchema);

export class friendRepository {

    async toggle(friendId, userId) {
        try {
            // Check if that id exists or not to whom the user wants to give a request
            const checkUser = await userModel.findById(friendId);
            if (!checkUser) {
                return {
                    code: 404,
                    msg: "User Not found",
                };
            }
 
            // Check if request is already given or not
            const checkRequest = await friendModel.findOne({
                user: userId,
                friend: friendId,
            });

            if (checkRequest) {
                return {
                    code: 404,
                    msg: "Request already given",
                };
            }

            checkUser.requests.push(userId);
            await checkUser.save();

            await new friendModel({
                user: userId,
                friend: friendId,
                status:'Pending'
            }).save();

        } catch (err) {
            console.log(err);
            throw new applicationError("something went wrong with the database", 500);
        }
    }

    async checkRequest(friendId,userId){
        try{
            if(friendId==userId){
                return {
                    code: 404,
                    msg: "friendId & UserID are same",
                };
            }
            const checkUser = await userModel.findById(friendId);
            if (!checkUser) {
                return {
                    code: 404,
                    msg: "User Not found",
                };
            }
            const checkRequest = await friendModel.findOne({
                user: friendId,
                friend: userId,
                status:"Pending"
            });
            if (!checkRequest) {
                return {
                    code: 404,
                    msg: "Request not given",
                };
            }
        }catch (err) {
            console.log(err);
            throw new applicationError("something went wrong with the database", 500);
        }
    }
    async response(friendId,userId,status){
        try{ 
            const user = await userModel.findById(userId);
            
            if(status=="accept"){
                user.friends.push(friendId);
                await userModel.updateOne(
                    {
                        _id:userId
                    },
                    {
                        $pull:{
                            requests:new mongoose.Types.ObjectId(friendId)
                        }
                    }
                )
                await user.save();
                const friend = await friendModel.findOne({
                    user:friendId,
                    friend:user,
                    status:"Pending"
                });
                friend.status="Accepted";
                await friend.save();
                return "FriendRequest accepted"
            }else if(status=="reject"){
                await userModel.updateOne(
                    {
                        _id:userId
                    },
                    {
                        $pull:{
                            requests:new mongoose.Types.ObjectId(friendId)
                        }
                    }
                )
                await user.save();
                await friendModel.findOneAndDelete({
                    user:friendId,
                    friend:user,
                    status:"Pending"
                });
                return "FriendRequest Rejected"
            }
        }catch (err) {
            console.log(err);
            throw new applicationError("something went wrong with the database", 500);
        }
    }

    async getPendingRequest(){
        try{
            return await friendModel.find({
                status:"Pending"
            })
        }catch (err) {
            console.log(err);
            throw new applicationError("something went wrong with the database", 500);
        }
    }

    async getUsersFriend(userId){
        try{
            //first check if the user is present or not..
            const user = await userModel.findById(userId);
            if(!user){
                return {
                    code: 404,
                    msg: "User Not found",
                };
            }
            if(user.friends.length>0){
                return user.friends;
            }else{
                return {
                    code: 404,
                    msg: "User has no friends :(",
                };
            }
        }catch (err) {
            console.log(err);
            throw new applicationError("something went wrong with the database", 500);
        }
    }
}
