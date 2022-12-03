import jwt from 'jsonwebtoken'
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const requireUserToken = (req, res, next) => {
    try {
        //el signo es para validar (?) si no existe el authorization nos daria undefined
   let token = req.headers?.authorization;
   //let token = req.cookies.token
   console.log(token)
   if(!token) throw new Error('no existe el token en el header; usa Bearer') 
   
   token = token.split(" ")[1] //al split hay que indicarle un separador, en este caso es el espacio del sring hecho por el Bear, y te de devuelve el string en un array, posicion 0 seria el Bearer y la 1 nuestro token
   
   const {uid} = jwt.verify(token, process.env.JWT_SECRET)
   console.log(uid)
   
   req.uid = uid
   /*const carros = {
    variable1: "hola",
    variable2: "chao"
   }
   const usuario = {
    "hola": "holaaa",
    "chao": "chaooo",
    "buenas noches": "adios"
   }
   console.log(usuario[carros.variable1])
   
   let i = 0
   function x(){
    i = i +1
    return 10, i
    
   }
   i =+ x()
   console.log(i)*/
   
   next()
    
    
    } catch (error) {
        //console.log(error)
        
        
        
        console.log(error.message)
         
        return res.status(401).json({error: tokenVerificationErrors[error.message]})//notacion cor corchetes para renombrar los errores de jwt de forma dinámica
    }
}