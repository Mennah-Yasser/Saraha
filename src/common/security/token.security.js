import jwt from "jsonwebtoken"
import { ACCESS_USER_TOKEN_SIGNNATURE, REFRESH_USER_TOKEN_SIGNNATURE,ACCESS_TOKEN_EXPIRES_IN,REFRESH_TOKEN_EXPIRES_IN, ACCESS_ADMIN_TOKEN_SIGNNATURE, REFRESH_ADMIN_TOKEN_SIGNNATURE} from "../../config.js" 
import {UserModel} from "../../DB/model/user.model.js"
import { findById, findOne } from "../repository/base.repository.js"
import { BadException, NotfoundException, UnauthorizedException } from "../exceptions/error.exception.js"
import { TokenTypeEnum } from "../enum/security.enum.js"
import { RoleEnum } from "../enum/user.enum.js"
import { compare } from "./hash.security.js"
import {randomUUID} from "node:crypto"
import {exist, set} from "../services/index.js"

export const userBaseKey = ({userId})=>{
    return `user::${userId.toString()}`
}

export const userBaseRevokeTokenKey = ({userId})=>{
    return `${userBaseKey({userId})}::Revoke_Token:`
}

export const userRevokeTokenKey = ({userId,jti})=>{
    return `${userBaseRevokeTokenKey({userId})}::${jti}`
}



export const createToken = async ({
    payload = {},
    secret= ACCESS_USER_TOKEN_SIGNNATURE,
    options = {}
}={}) => {
    return jwt.sign(payload,secret,options)
}

export const verifyToken = async ({
    token = "",
    secret= ACCESS_USER_TOKEN_SIGNNATURE,
}={}) => {
    return jwt.verify(token,secret)
}

const getTokenSignatures = async ({role= RoleEnum.USER}={}) => {
    let signature;
    switch (role) {
        case RoleEnum.ADMIN:
            signature = {
                access: ACCESS_ADMIN_TOKEN_SIGNNATURE,
                refresh: REFRESH_ADMIN_TOKEN_SIGNNATURE
            }
            break;
        default:
            signature = {
                access: ACCESS_USER_TOKEN_SIGNNATURE,
                refresh: REFRESH_USER_TOKEN_SIGNNATURE
            }
    }
    return signature
}

const getSignature = async ({tokenType=TokenTypeEnum.ACCESS, role= RoleEnum.USER

} = {}) => {
    const signatures = await getTokenSignatures({role})
    return tokenType == TokenTypeEnum.ACCESS ? signatures.access : signatures.refresh
}

export const decodeToken = async ({
    authorization = "",
    tokenType = TokenTypeEnum.ACCESS

} ={}) => {
    const decoded = jwt.decode(authorization);
    if(!decoded?.aud?.length){
        throw BadException ("missing token payload")
    }

    const payload = await verifyToken({
        token:authorization,
        secret: await getSignature({tokenType,role:decoded.aud[0]})
    })
    if (!payload?.sub)
        {throw BadException("missing token payload")
        }
        if (await exist({key:userRevokeTokenKey({userId:payload.sub, jti:payload.jti})})){
            throw UnauthorizedException("Expired login credentials")
        }
    const user = await findById({ 
        model: UserModel,
        id: payload.sub 
    })
    if (!user) 
        {throw NotfoundException("invalid user")}
    if ((user.createLoginCredentials?.getTime()??0) > payload.iat *1000) 
        {throw NotfoundException("Expired login credentials")}
    return {payload, user}
}

export const createLoginCredentials = async ({
    user = {},
    options = {},
    }) => {
        const jwtid =randomUUID()
        const {access: accessSignature,refresh: refreshSignature} = await getTokenSignatures({role:user.role})
        const access_token = await createToken({
            payload:{sub: user._id},
            secret: accessSignature, 
            options: {
                ...options,
                audience:[user.role],
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
                jwtid
            }
    })
    const refresh_token = await createToken({
        payload:{sub:user._id},
        secret: refreshSignature,
        options: {
            ...options,
            audience:[user.role],
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            jwtid
        } 
    })
    return {access_token, refresh_token}
}

export const createRevokeToken = async ({payload}) => {
    const consumedTime = (Math.ceil(Date.now() / 1000) - payload.iat)
    const refreshExpiresIn = payload.iat + REFRESH_TOKEN_EXPIRES_IN
    const ttl = refreshExpiresIn - consumedTime
    await set({ key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }), value: payload.jti, ttl })
    return;
}

export const basicAuth = async ({ email, password }) => {
    const user = await findOne({
        model: UserModel,
        filter: {
        email,
    }
})
if (!user) return NotfoundException("not Exist")
    const match = await compare(password, user.password)
if (!match) return NotfoundException("not Exist")
    return user
}