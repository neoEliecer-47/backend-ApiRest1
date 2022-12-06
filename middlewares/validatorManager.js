import axios from 'axios'
import { validationResult, body, param } from 'express-validator'


export const validarResultExpress = (req, res, next) => {
    
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
        next()//si llega al next, pasa al register
}


export const bodyLinkValidator = [
    body("originLink", "ingrese una URL correcta").trim().notEmpty()
    .custom(async (value) => {//value representa originLink, el valor con el cliente hace la solicitud
        try {
            if(!value.startsWith("http")) value = "https://" + value
           
            await axios.get(value)
            return value
        } catch (error) {
           // console.log(error)
            throw new Error("Not found orginal Link 404")
        }
    }),
    validarResultExpress
]



export const paramLinkValidator = [
    param("id", "formato de parametros no es válido (expressValidator)")
    .trim()
    .notEmpty()
    .escape(),//escapa caracteres de javascript, los sustituye por ciertos caracteres
    validarResultExpress
]


export const bodyRegisterValidator = [
    body("email", "formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "minimo 6 caracteres")
        .trim()
        .isLength({min: 6}),
    body("password", "formato de contraseña incorrecto")   
        .custom((value, {req}) => { //value es la propiedad principal, en este caso, el password
            if(value !== req.body.rePassword) throw new Error('las contraseñas no coinciden')//el throw new Error contiene un return implícito
            return value
    }),
    validarResultExpress
    
    
    ]



export const bodyLoginValidator = [
    body("email", "formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "minimo 6 caracteres")
    .trim()
    .isLength({min: 6}),
    validarResultExpress
]