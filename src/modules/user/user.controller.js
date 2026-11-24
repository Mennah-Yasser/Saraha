import { Router } from "express";
import { fileValidation, localFileUpload, successResponse} from "../../common/utils/index.js";
import { profile , update , rotateToken, logout} from "./user.service.js";
import { authentication, authorization, uploadMiddleware } from "../../middleware/index.js";
import { RoleEnum, TokenTypeEnum } from "../../common/enum/index.js";

const router = Router()

router.get("/", authentication(), async (req, res, next) =>{
    const data = await profile (req.user)
    return successResponse({ res, data })
})

router.patch("/", authentication(),authorization(RoleEnum.USER), async (req, res, next) => {
const data = await update(req.user, req.body)
return successResponse({ res, data })

})

router.post("/rotate-token", authentication(TokenTypeEnum.REFRESH), async (req, res, next) => {
const data = await rotateToken(req.payload, req.user,`${req.protocol}://${req.host}`)
return successResponse({ res, data })
})

router.post("/logout", authentication(), async (req, res, next) => {
const data = await logout(req.payload, req.user,req.body,`${req.protocol}://${req.host}`)
return successResponse({ res, data })
})

router.patch("/profile-image",
    authentication(),
    uploadMiddleware({
        isRequired:false,
        multerMiddleware:localFileUpload({maxFileSize:2}).single("attachment"),
        customPath:"users",
        validation: fileValidation.image
    }),
        async (req, res, next) => {
            req.user.image = req.file.path
            await req.user.save()
    return successResponse ({ res, data:{user:req.user }})
})
export default router 