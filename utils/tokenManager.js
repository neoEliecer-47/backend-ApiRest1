import jwt from 'jsonwebtoken'

export const generateToken = (uid) => {
    //60 = segundos
    const expiresIn = 60 * 10

    try {
                     //payload       , jsonwebtoken secreto
        const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn})
        return { token, expiresIn } //devolvemos un objeto con el token y el tiempo del token (expireIn)
        
    } catch (error) {
        
    }
}


export const generateRefreshToken = (uid, res) => {

    const expiresIn = 60 * 60 * 24 * 30//30 dias
    try {
        
    const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn})
    res.cookie("refreshToken", refreshToken, {//el res para guardar en la cookie
        httpOnly: true,
        secure: !(process.env.MODO === "developer"),
        expires: new Date(Date.now() + expiresIn * 1000)//caducidad del refreshToken
    })

    } catch (error) {
        console.log(error)
    }
}


export const  tokenVerificationErrors = {
    "invalid signature": "la firma de JWT no es válida",
    "jwt expired": "token expirado",
    "invalid token": "token no válido",
    "no Bearer": "utiliza formato Bearer",
    "jwt malformed": "JWT con formato inválido"
}