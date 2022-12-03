import { User } from "../models/UserSchema.js"
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js"



export const register = async(req, res) => {
    
    const {email, password} = req.body

    try {
        
    let user = await User.findOne({email})
    if(user) throw new Error('ya existe este usuario')
        //alternativa buscando email
        user = new User({ email, password })    //debe coincidir con los nombres del modelo, metemos los datos al modelo y los guardamos en la bd luego de ser todo validado
    await user.save() //el await espera por el 'ok' de la bd, si no es asi, no continua con el codigo y se queda esperando
    //if(user.email === email) throw new Error('usuario existente')
    
    //JWT
    
    const {token, expiresIn} = generateToken(user.id)
    //la bd crea al usuario el id por defecto (_id) y tambien puede ser accedida como siemple 'id'
    generateRefreshToken(user.id, res)//lo guarda en la cookie del navegador
    
    return res.status(201).json({token, expiresIn})
    
} catch (error) {
        return res.status(404).json({error: error.message})
        //if(error.code === 11000) return res.status(400).json({error: "usuario ya registrado"})
        //el error 11000 es de duplicaion de llaves en la bd, cuamdo una coleccion del modelo tiene una propiedad de tipo 'unique'
        //alternativa de error de validacion de email con error de mongoose
    } 

}



export const login = async(req, res) => {
    
    const {email, password} = req.body

    try {
        
        let user = await User.findOne({ email })
        if(!user) return res.status(400).json({error: "usuario no existe"})//true porque esta en negacion

        const resPassword = await user.comparePassword(password)//esto es una promesa, retorna true o false, por lo tanto añadimos el await
        if(!resPassword) return res.status(400).json({error: "contraseña incorrecta"})

               //devolvimos un objeto en el generateToken, por tanto hacemos destructuracion               
        const {token, expiresIn} = generateToken(user.id)
        //la bd crea al usuario el id por defecto (_id) y tambien puede ser accedida como siemple 'id'
        generateRefreshToken(user.id, res)//lo guarda en la cookie del navegador
        

        //console.log(token, expiresIn)
        return res.json({ token, expiresIn })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "error de servidor"})
        
    }
}


export const infoUser = async(req, res) => {
    try {
        
    const user = await User.findById(req.uid).lean() //devuelve un objeto simple de JS sin poderes de mongoose, y asi el sistema es mas eficiente

        return res.json({email: user.email, id: user._id})//id tal cual como esta en la bd a cuausa del metodo Lean()
    } catch (error) {
        return res.statud(500).json({error: "error inesperado del servidor"})
    }
    
}


export const refeshToken = (req, res) => {

    try {
        
        const {token, expiresIn} = generateToken(req.uid)

        return res.json({token, expiresIn})//cada vez que se visite esta ruta, le estaremos devolviendo un token valido

    } catch (error) {
        
        
        return res.status(401).json({error: "error de servidor"})//notacion cor corchetes para renombrar los errores de jwt de forma dinámica
    }

}


export const logOut = (req, res) => {
    res.clearCookie("refreshToken")
    res.json({ok: true})
}
