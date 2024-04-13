import likeRepository from "./like.repository.js";

export default class likeController{
    constructor(){
        this.likeRepository = new likeRepository();
    }

    async toggleLike(req,res,next){
        const id = req.params.id;
        const user = req.userId;
        try{
            let result = await this.likeRepository.checkPost(id);
            console.log(result);
            if(result){
                result = await this.likeRepository.checkComment(id);
                if(result){
                    return res.status(404).send("id doesnt belong to post nor comment")
                }
                else{
                    const commentResult = await this.likeRepository.toggle(id,user,"comment");
                    if(commentResult){
                        res.status(commentResult.code).send(commentResult.msg)
                    }
                    else{
                        res.status(201).send("Like added to the comment");
                    }
                }
            }else{
                const postResult = await this.likeRepository.toggle(id,user,"post");
                if(postResult){
                    res.status(postResult.code).send(postResult.msg)
                }
                else{
                    res.status(201).send("Like added to the post");
                }
            }
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async getLikes(req,res,next){
        const id = req.params.id;
        try{
            let result = await this.likeRepository.checkPost(id);
            if(result){
                result = await this.likeRepository.checkComment(id);
                if(result){
                    return res.status(404).send("id doesnt belong to post nor comment")
                }
                else{
                    const commentResult = await this.likeRepository.getLikes(id,"comment");
                    if(commentResult.code){
                        res.status(commentResult.code).send(commentResult.msg)
                    }
                    else{
                        res.status(201).send(commentResult);
                    }
                }
            }
            else{
                const postResult = await this.likeRepository.getLikes(id,"post");
                if(postResult.code){
                    res.status(postResult.code).send(postResult.msg)
                }
                else{
                    res.status(201).send(postResult);
                }
            }
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
}