import { User } from "../models/UserSchema.js"
import jwt from 'jsonwebtoken'


export const register = async(req, res) => {
    
    const {email, password} = req.body

    try {
        
    let user = await User.findOne({email})
    if(user) throw new Error('ya existe este usuario')
        //alternativa buscando email
        user = new User({ email, password })    //debe coincidir con los nombres del modelo, metemos los datos al modelo y los guardamos en la bd luego de ser todo validado
    await user.save() //el await espera por el 'ok' de la bd, si no es asi, no continua con el codigo y se queda esperando
    return res.status(201).json({ok: "usuario registrado exitosamente"})
    //if(user.email === email) throw new Error('usuario existente')
    
    //JWT

   
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

                             //payload       , jsonwebtoken secreto
        const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET)
        //la bd crea al usuario el id por defecto (_id) y tambien puede ser accedida como siemple 'id'
        
        res.json({ token})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "error de servidor"})
        
    }
}
