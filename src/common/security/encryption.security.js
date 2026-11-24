import crypto from 'node:crypto'
import { ENC_KEY, IV_LENGTH } from '../../config.js'

export const encryption = async (plaintext) => {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipherIv = crypto.createCipheriv("aes-256-cbc", ENC_KEY,iv)
    let cipherText = cipherIv.update(plaintext, 'utf-8', 'hex')
    cipherText += cipherIv.final("hex")
    return `${iv.toString("hex")}::${cipherText}`
};

export const decrypt = async (cipherText) => {
    let [iv, encryptedData] = cipherText.split("::")
    iv = Buffer.from(iv, "hex")

    const deCipherIv = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, iv)
    let plaintext = deCipherIv.update(encryptedData, "hex" ,"utf-8")
    plaintext += deCipherIv.final("utf-8")
    return plaintext
}