import mongoose from "mongoose";

export const connectUsingMongoose = async ()=>{
    try{        
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('MongoDb connected using mongoose');
    }catch(err){
        onsole.log("Error while connecting to the db!");
        console.log(err);
    }
}