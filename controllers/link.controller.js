import { nanoid } from 'nanoid'
import { Link } from '../models/Link.js'

export const getLinks = async(req, res) => {
    try {
        
        const links =  await Link.find({uid: req.uid})//uid-- los nombres en la propiedad deben ser los mismos del modelo
        
        return res.json({ links })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "error de server"})
    }
}

 //para un CRUD tradicional
export const getLinkv1 = async(req, res) => { 
    const {id} = req.params//params en express es el ' /:id ' de la url; el id de la url que le mandamos
    console.log(id)
    try {
        
    const link =  await Link.findById(id)
    //console.log(link)

    if(!link) return res.status(404).json({error: "esta url no existe"})
    
    if(link.uid.equals(req.uid)) return res.status(401).json({error: "no seas webón tú, chico! esa url no es tuya🤡"})
    //verifica el la uid que viene en 'link' como recurso de mongoose en el documeno de la bd, es el mismo que mandamos con la request del middleware
    
    return res.json({ link })
    } catch (error) {
        
        if(error.kind === 'ObjectId') return res.status(403).json({error: "formato de id incorrecto"})//la propiedad Objectid de mongoose tiene un formato para el Objectid

        console.log(error)
        return res.status(500).json({error: "error del server"})
    }
 }



 export const getLink = async(req, res) => { 
    const {shortLink} = req.params//params en express es el ' /:id ' de la url; el id de la url que le mandamos
    console.log(shortLink)
    try {
        
    const link =  await Link.findOne({shortLink})//para buscar por una propiedad del documento, con id seria sin llaves. con id es sin llaves porque buscamos directo al id por defecto que mongoose crea; shortLink es una propiedad del modelo y por eso las llaves
    //console.log(link)

    if(!link) return res.status(404).json({error: "esta url no existe"})
    
    return res.json({ originLink: link.originLink })//link ubicado en la bd que trae todo el documento encontrado y sus podedores
    } catch (error) {
        
        if(error.kind === 'ObjectId') return res.status(403).json({error: "formato de id incorrecto"})//la propiedad Objectid de mongoose tiene un formato para el Objectid

        console.log(error)
        return res.status(500).json({error: "error del server"})
    }
 }


export const createLink = async(req, res) =>{
    
    let {originLink} = req.body
    if(!originLink.startsWith("https://")) originLink = "https://" + originLink
    console.log(originLink)
    
    try {
    
    const link = new Link({originLink, shortLink: nanoid(6), uid: req.uid})//instanciar nuevo modelo para guardar en la bd
    const newLink = await link.save()
    console.log(link)

    return res.json({ newLink })
    } catch (error) {
        console.log(error)
       return res.status(500).json({error: "error de server"})
    }
}



export const removeLink = async(req, res) => {
    
    const {id} = req.params
    console.log(id)
    try {
        const link = await Link.findById(id)
        
        if(!link) return res.status(404).json({error: "no existe el link"})
        if(link.uid.equals(req.uid)) return res.status(401).json({error: "link no autorizado para eliminar"})
        
        await link.remove()
    
        return res.json({msg: "link eliminado satisfactoriamente", link: link})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "error de server"})
    }
}


export const updateLink = async (req, res) => { 

    const {id} = req.params
    let {originLink} = req.body
    if(!originLink.startsWith("https://")) originLink = "https://" + originLink
    console.log(originLink)
    try {
    
        const link = await Link.findById(id)//traemos el objeto de la bd con todos los metodos proporcionados por mongoose
        
        if(!link) return res.status(404).json({error: "no existe el link"})
        if(!link.uid.equals(req.uid)) return res.status(401).json({error: "link no autorizado"})

        link.originLink = originLink//

        await link.save()

        return res.json({ link })

} catch (error) {
    console.log(error)
    if(error.kind === "ObjectId") return res.status(403).json({error: "formato id incorrecto"})
    
    return res.status(500).json({error: "error del server"})
}

 }