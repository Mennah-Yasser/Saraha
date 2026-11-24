import {EventEmitter} from "node:events"
import { sendEmail } from "./send.email.js";
import { getConfirmationEmail } from "./email.templates.js";
export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail",async ({recipients,subject,data})=>{
    try{
        await sendEmail({
        ...recipients,
        subject,
        html:getConfirmationEmail({code:data.code,title:data.title ?? subject,subject})})

    } catch(error){
        console.log(error);
    }
})