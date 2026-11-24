import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadException } from "../../exceptions/error.exception.js";

export const UserEmailKey = ({email,subject})=>{
    return `User::${email}::${subject}::OTP`
}

export const UserEmailTrailsKey = ({email,subject})=>{
    return `${UserEmailKey({email,subject})}::Trails`
}

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: APP_EMAIL,
        pass: APP_PASSWORD,
    },
});

export const sendEmail = async ({
    to, 
    cc,
    bcc,
    subject, 
    text,
    html, 
    attachments =[]
}) =>{
    try {
        if (!to?.length && !bcc?.length && !cc?.length){
            throw BadException("Missing email recipients")
        }
        if (!text?.length && !html?.length && !attachments?.length){
            throw BadException("Missing email recipients")
        }
        const info = await transporter. sendMail({
            from:`"${APPLICATION_NAME}" <${APP_EMAIL}>`, 
            to, 
            cc,
            bcc,
            subject, 
            text,
            html, 
            attachments
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
    console.error("Error while sending mail:", err);
    throw err;
}

}