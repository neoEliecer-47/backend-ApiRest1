import express from "express"
import 'dotenv/config'
import './database/connectDB.js'
import authRoutes from "./routes/auth.route.js"
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json()) //habilitamos a express para que lea solicitudes(req) del usuario en JSON
app.use(cookieParser())
app.use("/api/v1/auth", authRoutes);
app.use(express.static('public'))


const PORT = process.env.PORT || 5000//heroku tiene por defecto la variable de entorno 'PORT', pero si no existiera, usa el puerto 5000
app.listen(PORT, () => console.log("server trabajando🌎  http://localhost:"+PORT))