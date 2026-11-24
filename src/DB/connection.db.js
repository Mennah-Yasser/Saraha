import { DB_URI } from "../config.js";
import mongoose from "mongoose";
import { connectRedis } from "./redis.connection.js";

export const bootstrapDB= async (app,port)=>{
    try {
        await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 30000});
        console.log(`DB Connected successfully`);
        await connectRedis()
        app.listen(port,()=> console.log(`Example app listening on port ${port}!`))
    } 
    catch (error) {
        console.log(`Fail to connect on DB`,`${error}`);
    }
}