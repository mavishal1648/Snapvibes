import commentRepository from "./comment.repository.js";


export default class commentController{
    constructor(){
        this.commentRepository = new commentRepository();
    }

    async addComment(req,res,next){
        const postId = req.params.postId;
        const userId = req.userId;
        const {comment} = req.body;
        try{
            const result = await this.commentRepository.add(postId,userId,comment);
            if(result){
                return res.status(result.code).send(result.msg);
            }
            return res.status(201).send("Comment Added!");
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async getComment(req,res,next){
        const postId = req.params.postId;
        try{
            const result = await this.commentRepository.get(postId);
            if(result.code){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async updateComment(req,res,next){
        const commentId = req.params.commentId;
        const userId = req.userId;
        const {post,comment} = req.body;
        try{
            const result = await this.commentRepository.update(commentId,userId,post,comment);
            if(result.code){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async deleteComment(req,res,next){
        const commentId = req.params.commentId;
        const userId = req.userId;
        const {post} = req.body;
        try{
            const result = await this.commentRepository.delete(commentId,userId,post);
            if(result){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send("Comment Deleted");
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
}