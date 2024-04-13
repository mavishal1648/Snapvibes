import otpRepository from "./otp.repository.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
});

export default class otpController{
    constructor(){
        this.otpRepository = new otpRepository();
    }

    async send(req,res,next){
        const {email} = req.body;
        try{
            const result = await this.otpRepository.checkEmail(email);
            if(result){
                return res.status(result.code).send(result.msg);
            };
            const otp = Math.floor(1000 + Math.random()*9000).toString();
            await this.otpRepository.generateOtp(email,otp);
            const mailOptions = {
                from:process.env.EMAIL,
                to:email,
                subject:"Password Reset",
                text:`Your otp for password Reset is ${otp}`
            }
            const info = await transporter.sendMail(mailOptions);
            return res.status(200).send("OTP sent successfully");
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    async verify(req,res,next){
        const { email,otp,password} = req.body;
        const user = req.userId;
        try{
            const result = await this.otpRepository.checkEmail(email);
            if(result){
                return res.status(result.code).send(result.msg);
            };
            const finalResult = await this.otpRepository.verifyOtp(email,otp,user,password);
            if(finalResult.code){
                return res.status(finalResult.code).send(finalResult.msg);
            }
            return res.status(200).send(finalResult);
        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong!");
        }
    }
    
}