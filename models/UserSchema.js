import {Schema, model} from "mongoose"; //importacion por nombre: los nombres de los metodos deben ser los mismos
import bcrypt from 'bcryptjs' //importancion por defecto: sini llaves y se le puede colocar cualquier nombre a la instancia

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: {unique: true}
    },
    password:{
        type: String,
        required: true
    }
})

userSchema.pre("save", async function(next){ //'save' el evento de mongoose que estamos capturando, para que se hashee la contraseña antes 'pre' de guardarse en la bd (save())
    
    const user = this //el this accede a todo nuestro modelo (email, password)
    
    if(!user.isModified('password')) return next()
    //en caso de que el usuario(contraseña) haya sido modificado, se le hashea nuevamente la contraseña
    
    try {
       const saltos = await bcrypt.genSalt(10)
       const hashPassword = await bcrypt.hash(user.password, saltos)
       user.password = hashPassword //para igualar al hash al user
       next() //sigue con el guardado una vez haseada la contraseña del usuario

    } catch (error) {
        console.log(error)
        throw new Error('falló el hash de contraseña')
    }
})


userSchema.methods.comparePassword = async function(clientPassword){
    const userModel = this
    return await bcrypt.compare(clientPassword, userModel.password)//esto retorna una promesa: verdadero o falso, no retorna la contraseña hasheada como tal
    //clientPassword es la contraseña igresada por un usuario que va a compararse con la contraseña del modelo del usuario, es decir la contraseña alojada y hasheada en BD
}

export const User = model("User", userSchema) //el 'user' es el parametro que estaremos enviado a mongoDB, aunque la bd por defecto nos las pondra en plural
