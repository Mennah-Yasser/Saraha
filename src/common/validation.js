import { z } from "zod";
import { GenderEnum } from "./enum/user.enum.js";
import { LanguageEnum } from "./enum/security.enum.js";
import mongoose from "mongoose";

const validationMessage = {
    102:{
        ar:" عفوا لا يمكن ادخل اسم مستخدم اقل من حرفين",
        en:"minimum username is 2 char"
    }
}

const getValidationMessage =(lang,code)=>{
    return lang == LanguageEnum.AR ?
    validationMessage[code].ar
    :validationMessage[code].en      
}


const matchFields = ({original="password" ,copy,data,ctx,lang})=>{
    if (data[original] !=data[copy]){
        ctx.addIssue({
            code:"custom",
            path:["copy"],
            message:lang == LanguageEnum.AR ? ` فشل التطابق بين كلا من ${original} و ${copy}`:`Fail to match ${original} and ${copy}`
        })
    }
}

export const generalValidationFeilds ={
    matchFields,
    email:(lang)=>z.email({message:"enter valid email format like example@any.extra"}),
    otp:(lang)=>z.string().regex(/^\d{6}$/),
    password:(lang)=>z.string().regex(/^(?=.*[a-z])(?=.*\s{0,})(?=.*[A-Z])(?=.*\d)(?=.*[!@#_$%^&*()]).{8,16}$/).min(8).max(16),
    phone: (lang)=> z.e164(),
    username:(lang)=> z.string().min(2,{message:getValidationMessage(lang,102)}).max(50),
    gender:(lang)=>z.enum(GenderEnum),
    id:(lang)=>z.string().refine((data) =>{return mongoose.Types.ObjectId.isValid(data)},{message:"Invalid format"}),
    file: (lang) => z.strictObject({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        buffer: z.instanceof(Buffer),
        size: z.number(),
        path: z.string(),
    })
}