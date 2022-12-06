import { Link } from "../models/Link.js"

export const redirectlink = async(req, res) => {
    try {
        const {shortLink} = req.params

        const link = await Link.findOne({shortLink: shortLink})

        if(!link) return res.status(404).json({error: "no existe el link"})

        return res.redirect(link.originLink)//todo lo que trae el link encontrado de la bd, en este caso todo el documento y poderes de mongoose
    
    
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId') return res.status(403).json({error: "formato de id incorrecto"})
    }
}