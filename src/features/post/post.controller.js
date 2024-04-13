import postRepository from "./post.repository.js";

export default class postController{
    constructor(){
        this.postRepository = new postRepository();
    }

    async addPost(req,res,next){
        const {caption} = req.body;
        const image = req.file.filename;
        const userId = req.userId;
        try{
            const post = await this.postRepository.addPost(userId,image,caption);
            return res.status(201).json({
                message:"PostCreated",
                post:post
            });
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async getOnePost(req,res,next){
        const id = req.params.postId;
        try{
            const post = await this.postRepository.getOnePost(id);
            if(!post){
                return res.status(404).send("Post Not Found");
            }
             return res.status(200).send(post);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async getAllPosts(req,res,next){
        try{
            const allPosts = await this.postRepository.getAllPosts();
            if(!allPosts){
                return res.status(404).send("No posts are created by any user");
            }
            return res.status(200).send(allPosts);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async getAllPostByUser(req,res,next){
        const id = req.userId;
        try{
            const getUserPost = await this.postRepository.getAllPostByUser(id);
            if(!getUserPost){
                return res.status(404).send("No posts are created by the user");
            }
            return res.status(200).send(getUserPost);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async deletePost(req,res,next){
        const id = req.params.postId;
        const user = req.userId;
        try{
            const result = await this.postRepository.deletePost(id,user);
            if(result){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send("Post Deleted Successfully");
        }
        catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }

    async updatePost(req,res,next){
        const id = req.params.postId;
        const user = req.userId;
        const {caption} = req.body;
        const image = req.file.filename;
        try{
            const result = await this.postRepository.updatePost(id,user,image,caption);
            if(result.code){
                return res.status(result.code).send(result.msg);
            }
            return res.status(200).send(result);
        }
        catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
}