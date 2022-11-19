
import mongoose from "mongoose"

mongoose.connect(process.env.URI_MONGO)
    .then(() => console.log('db conectada Ok📗'))
    .catch(e => console.log('algo falló' +e))



/*try {
        
    await mongoose.connect(process.env.URI_MONGO)
        console.log('db conectada')
} catch (error) {
    console.log('algo falló en conectar: '+error)
}*/