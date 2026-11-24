import { z } from 'zod';
import { generalValidationFeilds } from '../../common/validation.js';

export const createMessage = (lang) => {
    return z.object({
        body: z.strictObject({
            content:z.string().min(2).max(50000).optional(),
            receiverId: generalValidationFeilds.id(lang)
            }),
            files:z.array(generalValidationFeilds.file(lang)).max(3).optional()
        }).superRefine((data, ctx) =>{
            
            if (!data.body.content && !data.files ?. length) {
                ctx. addIssue({
                code: "custom",
                path:["content"],
                message: "missing message content" 
            }) 
        }
    })
}

export const allMessages = (lang) => {
    return z.object({
        query: z.strictObject({
            type:z.enum(["0","1","2"]).default("0"),
            page:z.coerce.number().default(1),
            limit:z.coerce.number().default(5),
            }),
        })
}

export const deleteMessages = (lang) => {
    return z.object({
        params: z.strictObject({
        messageId: generalValidationFeilds.id(lang),
        })
    })
}

export const getMessage = (lang) => {
    return z.object({
        params: z.strictObject({
            messageId: generalValidationFeilds.id(lang)
        })
    });
};