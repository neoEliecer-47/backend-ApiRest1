import mongoose from "mongoose";
const{Schema, model} = mongoose

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

export const User = model("user", userSchema) //el 'user' es el parametro que estaremos enviado a mongoDB, aunque la bd por defecto nos las pondra en plural
