import { Router } from "express";
import { createLink, getLink, getLinks, removeLink } from "../controllers/link.controller.js";
import { requireUserToken } from "../middlewares/requireToken.js";
import { bodyLinkValidator, paramLinkValidator } from "../middlewares/validatorManager.js";
const router = Router()

//GET           /api/v1/links           all links
//GET           /api/v1/links/:id       single link    
//POST          /api/v1/links           create link
//PATCH/PUT     /api/v1/links/:id       update link
//DELETE        /api/v1/links/:id       remove link

//----------------------------------------------------

router.get("/", requireUserToken, getLinks)
router.get("/:id", requireUserToken, paramLinkValidator, getLink)
router.post("/", requireUserToken, bodyLinkValidator, createLink)
router.delete("/:id", requireUserToken, paramLinkValidator,removeLink)




export default router;

//patch solo modificaria un documento por lo que put se utiliza para modificar todo, aunque ambos pueden ser usados