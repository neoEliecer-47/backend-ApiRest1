import express from "express"
import cors from 'cors'
import 'dotenv/config'
import './database/connectDB.js'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.route.js"
import linkRouter from './routes/link.route.js'
import redirectRouter from "./routes/redirect.router.js"

const app = express()

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(cors({//comunicaion entre servidores, mas seguridad anuestra app
    origin: function(origin, callback){
        console.log("--> "+origin)
        if(!origin || whiteList.includes(origin)) return callback(null, origin)
        return callback("error de CORS " + origin + " no autorizado")
    }
}))

app.use(express.json()) //habilitamos a express para que lea solicitudes(req) del usuario en JSON
app.use(cookieParser())
//ejemplo back redirect (opcional)
app.use("/", redirectRouter)

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRouter)


//app.use(express.static('public'))


const PORT = process.env.PORT || 5000//heroku tiene por defecto la variable de entorno 'PORT', pero si no existiera, usa el puerto 5000
app.listen(PORT, () => console.log("server trabajando🌎  http://localhost:"+PORT))