import { z } from "zod";
import {generalValidationFeilds} from "../../common/validation.js"

export const loginSchema = (lang)=> {
    return z.strictObject({
        email:generalValidationFeilds.email(lang),
        password:generalValidationFeilds.password(lang)
    })
}

export const login = (lang)=>{
    return z.object({
        body:loginSchema(lang),
    })
}

export const signup =(lang)=>{
    return z.object({
        body: loginSchema(lang).safeExtend({
            username:generalValidationFeilds.username(lang),
            phone: generalValidationFeilds.phone(lang),
            confirmPassword:generalValidationFeilds.password(lang),
            gender:generalValidationFeilds.gender(lang)
        }).superRefine((data, ctx) =>{
            generalValidationFeilds.matchFields({original:"password",copy:"confirmPassword",data,ctx,lang})
        if (!data.username.includes(" ")) {
            ctx. addIssue({
                code: "custom",
                path: ['username'],
                message: "username must contain 2 parts"
            })
        }
    })
})
}

export const confirmEmail = (lang)=>{
    return z.object({
        body:z.strictObject({
            email:generalValidationFeilds.email(lang),
            otp:generalValidationFeilds.otp(lang)
        })
    })
}

export const resendConfirmEmail = (lang)=>{
    return z.object({
        body:z.strictObject({
            email:generalValidationFeilds.email(lang)
        })
    })
}

export const resetForgotPassword = (lang) => {
    return z.object({
        body: z.strictObject({
            email: generalValidationFeilds.email(lang),
            otp: generalValidationFeilds.otp(lang),
            password: generalValidationFeilds.password(lang),
            confirmPassword: generalValidationFeilds.password(lang)
        }).superRefine((data, ctx) => {
            generalValidationFeilds.matchFields({ original: "password", copy: "confirmPassword", data, ctx })
        })
    })
}