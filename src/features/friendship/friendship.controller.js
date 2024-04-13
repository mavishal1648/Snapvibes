import { friendRepository } from "./friendship.repository.js";

export class friendshipController{
    constructor(){
        this.friendshipRepository = new friendRepository();
    }

    async toggle(req,res,next){
        const friendId = req.params.friendId;
        const userId = req.userId;
        try{
            if(friendId===userId){
                return res.status(400).send("friendId and userId cant be the same");
            }
            const result = await this.friendshipRepository.toggle(friendId,userId);
            if(result){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send(`${userId} gave friend request to ${friendId}`);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async respone(req,res,next){
        const {friendId,status} = req.params;
        const userId = req.userId;
        try{
            //first check whether friendId gave request to user
            const result = await this.friendshipRepository.checkRequest(friendId,userId);
            if(result){
                return res.status(result.code).send(result.msg);
            }
            // if request is given..user can decide whether to accept or reject
            const requestResponse = await this.friendshipRepository.response(friendId,userId,status);
            return res.status(200).send(requestResponse);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async getPendingRequest(req,res,next){
        try{
            const result = await this.friendshipRepository.getPendingRequest();
            if(!result){
                return res.status(404).send("NO friendRequest is given");
            }
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async getUsersFriend(req,res,next){
        const userId = req.params.userId;
        try{
            const result = await this.friendshipRepository.getUsersFriend(userId);
            if(result.code){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
}