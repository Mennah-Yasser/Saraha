import bcrypt from "bcrypt"

export const hash = async (plaintext , salt=12, minor="b") =>{
    const saltRound = await bcrypt.genSalt(salt,minor)
    return await bcrypt.hash(plaintext,saltRound)
}

export const compare = async (plaintext, cipherText) => {
    return await bcrypt.compare(plaintext, cipherText)
}