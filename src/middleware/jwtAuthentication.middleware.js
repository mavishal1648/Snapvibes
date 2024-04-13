import jwt from "jsonwebtoken";
const jwtAuth = (req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).send('unauthorized');
    };
    try{
        const payLoad = jwt.verify(token,process.env.JWT_TOKEN);
        console.log(payLoad);
        req.userId = payLoad.userID;
    }catch(err){
        return res.status(401).send('unauthorized');
    }
    next();
}
export default jwtAuth;