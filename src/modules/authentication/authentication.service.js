import { BadException, ConflictException, NotfoundException, TooManyRequestException } from "../../common/exceptions/index.js"
import { createOne, findOne } from "../../common/repository/base.repository.js"
import { UserModel } from "../../DB/model/user.model.js"
import { hash , compare } from "../../common/security/hash.security.js"
import { createLoginCredentials, userBaseRevokeTokenKey } from "../../common/security/token.security.js"
import { WEB_CLIENT_IDS } from "../../config.js"
import {OAuth2Client} from 'google-auth-library';
import { providerEnum } from "../../common/enum/user.enum.js"
import { createOtp, emailEvent, UserEmailKey, UserEmailTrailsKey } from "../../common/utils/index.js"
import { del, expire, incrBy, keys, set , ttl ,get} from "../../common/services/cache.service.js"
import { EmailsubjectEnum } from "../../common/enum/email.enum.js"

const client = new OAuth2Client();

async function verifyGoogleAccount(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: WEB_CLIENT_IDS,
    });
    const payload = ticket.getPayload();
    if (!payload.email_verified)
        throw BadException ("email not verifed")
    return payload
}

export const signup = async ({ email, password, username}) => {
    const duplicatedAccount = await findOne({ 
        model: UserModel,
        filter: { email },
        options: { select: "email" } 
})
if (duplicatedAccount) throw ConflictException("Email Exist")
    
    const account = await createOne({ 
            model: UserModel,
            data: { 
                username,
                email,
                password: await hash(password),
                
            } 
    })
    await sendEmailOtp({email,subject:EmailsubjectEnum.CONFIRM_EMAIL})

    return account
}

const sendEmailOtp = async ({email,subject,expiresIn =120,maxTrials=3,blockInSeconds=300, title}) =>{
    const existOTP_TTL = await ttl ({key: UserEmailKey({email,subject})})
    if(existOTP_TTL > 0 ) {
        throw ConflictException(`Sorry we cannot create new otp while existing one stil valid please try again later`)
    }
    const oldTrials = await get({key:UserEmailTrailsKey({email,subject})})??0
    if (oldTrials >= maxTrials){
        throw TooManyRequestException ("Max otp trails has been reached ")
    }
    const code = createOtp();
    await set ({
        key:UserEmailKey({email,subject}),
        value: await hash(code.toString()),
        ttl: expiresIn
    })
    const currentTrails= await incrBy({key:UserEmailTrailsKey({email,subject})})
    if(currentTrails == maxTrials){
        await expire({key:UserEmailTrailsKey({email,subject}),ttl:blockInSeconds})
    }
    emailEvent.emit("sendEmail",{
        recipients: {to:email},
        subject,
        data:{code,title: title ?? subject}})
}

export const confirmEmail = async ({ email, otp}) => {
    const account = await findOne({ 
        model: UserModel,
        filter: { email ,provider:providerEnum.SYSTEM,confirmEmail:{$exists:false}}
    })
    if (!account) throw NotfoundException("Invalid account ")
        const hashOtp = await get ({key:UserEmailKey({email,subject:EmailsubjectEnum.CONFIRM_EMAIL})})
    if (!hashOtp || ! await compare(otp,hashOtp)) {
        throw ConflictException ("Invalid OTP")
    }
    account.confirmEmail = new Date ();
    await account.save();
    await del ({key:await keys({prefix:UserEmailKey({email,subject:EmailsubjectEnum.CONFIRM_EMAIL})})})
    return
}

export const ResendconfirmEmail = async ({email}) => {
    const account = await findOne({ 
        model: UserModel,
        filter: { email ,provider:providerEnum.SYSTEM,confirmEmail:{$exists:false}}
    })
    if (!account) throw NotfoundException("Invalid account ")
        await sendEmailOtp({email,subject:EmailsubjectEnum.CONFIRM_EMAIL})
    return
}

export const requestForgetPasswordCode = async ({email}) => {
    const account = await findOne({ 
        model: UserModel,
        filter: { 
            email ,
            provider:providerEnum.SYSTEM,
            confirmEmail:{$exists:true}
        }
    })
    if (!account) throw NotfoundException("Invalid account ")
        await sendEmailOtp({email,subject:EmailsubjectEnum.FORGET_PASSWORD})
    return
}

export const verfiyForgetPassword = async ({otp,email}) => {
    const account = await findOne({ 
        model: UserModel,
        filter: { email ,provider:providerEnum.SYSTEM,confirmEmail:{$exists:true}}
    })
    if (!account) throw NotfoundException("Invalid account ")
        const hashOtp = await get ({
            key:UserEmailKey({email,subject:EmailsubjectEnum.FORGET_PASSWORD})
        })
        if (!hashOtp || ! await compare(otp,hashOtp)) {
            throw ConflictException ("Invalid OTP")
        }
        return account;
}

export const resetForgetPassword = async ({otp,email,password}) => {
    const account = await verfiyForgetPassword ({otp,email})
    account.password = await hash(password)
    account.changeCredentialsTime = new Date();
    await account.save();

    const result = await Promise.all([
        keys({prefix: userBaseRevokeTokenKey({userId:account._id})}),
        keys({prefix: UserEmailKey({email, subject: EmailsubjectEnum.FORGET_PASSWORD})})
    ])
    await del ({
        key:[...result[0],...result[1]]
    })
        return;
}

export const signupWithGmail = async ({ idToken }, issuer) => {
    const {name,email,picture} = await verifyGoogleAccount(idToken)

    const existAccount = await findOne ({model:UserModel, filter:{email}})
    if (existAccount){
        if (existAccount.provider != providerEnum.GOOGLE){
            throw ConflictException ("Invalid account provider")
    }
    return {status:200,data:await createLoginCredentials({user:existAccount,issuer})}
    }
    const user = await createOne({ 
            model: UserModel,
            data: 
            {
                confirmEmail: new Date(), 
                provider: providerEnum.GOOGLE,
                username: name,
                image: picture
            } 
    })
    return {status:201, data:await createLoginCredentials({user,issuer})}
}

export const login = async ({email,password},issuer) => {
    const account = await findOne({ 
        model: UserModel,
        filter:{email ,provider:providerEnum.SYSTEM, confirmEmail: {$exists:true} }
    })
    if (!account) throw NotfoundException("Invalid login data")
        const match = await compare(password,account.password)
    if (!match) throw NotfoundException("doesn't exist")
        return await createLoginCredentials({user: account,issuer})
}