import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "./helper.js"

const getAccessToken = (req) => {
    const cookieToken = req.cookies?.accessToken
    if (cookieToken) return cookieToken

    const authHeader = req.headers.authorization
    if (typeof authHeader !== "string") return null
    if (!authHeader.toLowerCase().startsWith("bearer ")) return null
    return authHeader.slice(7).trim() || null
}

export const attachUser = async (req, res, next) => {
    const token = getAccessToken(req)
    if(!token) return next()

    try {
        const decoded = verifyToken(token)
        const user = await findUserById(decoded)
        if(!user) return next()
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        next()
    }
}
