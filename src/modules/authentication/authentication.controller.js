import { Router } from "express";
import { confirmEmail, login, requestForgetPasswordCode, ResendconfirmEmail, resetForgetPassword, signup, signupWithGmail, verfiyForgetPassword } from "./authentication.service.js";
import { generateLimiter, successResponse } from "../../common/utils/index.js";
import * as validators from './authentication.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
import { del } from "../../common/services/cache.service.js";
const router = Router();

router.post("/signup", validation(validators.signup) ,async (req, res, next) => {
    const data = await signup(req.validate.body)
    return successResponse({ res,status: 201, data })

})

router.patch("/confirm-email", validation(validators.confirmEmail) ,async (req, res, next) => {
    const data = await confirmEmail(req.validate.body)
    return successResponse({ res,status: 200, data })

})

router.patch("/resend-confirm-email", validation(validators.resendConfirmEmail) ,async (req, res, next) => {
    const data = await ResendconfirmEmail(req.validate.body)
    return successResponse({ res,status: 200, data })

})

router.patch("/verfiy-forgot-password", validation(validators.confirmEmail) ,async (req, res, next) => {
    const data = await verfiyForgetPassword(req.validate.body)
    return successResponse({ res,status: 200, data })

})

router.patch("/reset-forgot-password", validation(validators.resetForgotPassword) ,async (req, res, next) => {
    const data = await resetForgetPassword(req.validate.body)
    return successResponse({ res,status: 200, data })

})

router.post("/request-forgot-password-code", validation(validators.resendConfirmEmail) ,async (req, res, next) => {
    const data = await requestForgetPasswordCode(req.validate.body)
    return successResponse({ res,status: 201, data })

})

router.post("/signup-with-gmail", async (req, res, next) => {
    const {status,data} = await signupWithGmail(req.body,`${req.protocol}:://${req.host}`)
    return successResponse({ res,status, data })

})

const loginLimiter = generateLimiter({ limit: 5, ttl: 5 , skipSuccessfulRequests:true})
router.post("/login", loginLimiter,validation(validators.login) ,async (req, res, next) =>{
    const data = await login(req.validate.body, `${req.protocol}://${req.host}`)
    await del({key:req.rateLimit.key})
    return successResponse({ res, data })

})

export default router