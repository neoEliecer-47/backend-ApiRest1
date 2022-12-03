import jwt from 'jsonwebtoken'
import { tokenVerificationErrors } from "../utils/tokenManager.js"

export const requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken
        
        if(!refreshTokenCookie) throw new Error('no existe el Rtoken')

        const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH)//verificamos el refresh token con la clave secreta (JWT_REFRESH)

        req.uid = uid //le colocamos una propiedad al req llamada uid que es igual al uid del cliente que extraemos del payload del refreshToken
        next() //siga con la siguiente operacion o middleware
    } catch (error) {
        res.status(401).json({error: tokenVerificationErrors[error.message]})
    }
}