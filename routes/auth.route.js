import {Router} from 'express'
import { infoUser, login, register, refeshToken, logOut } from '../controllers/auth.controller.js';
import {body} from 'express-validator'
import { validarResultEx } from '../middlewares/validationResultEx.js';
import { requireUserToken } from '../middlewares/requireToken.js';

const router = Router()


router.post("/register",[
body("email", "formato de email incorrecto").trim().isEmail().normalizeEmail(),
body("password", "minimo 6 caracteres")
    .trim()
    .isLength({min: 6}),
body("password", "formato de contraseña incorrecto")   
    .custom((value, {req}) => { //value es la propiedad principal, en este caso, el password
        if(value !== req.body.rePassword) throw new Error('las contraseñas no coinciden')//el throw new Error contiene un return implícito
        return value
})

], validarResultEx,register)
router.post("/login", [
    body("email", "formato de email incorrecto").trim().isEmail().normalizeEmail(),
body("password", "minimo 6 caracteres")
    .trim()
    .isLength({min: 6})
],validarResultEx,login)

router.get("/protected", requireUserToken, infoUser)
router.get("/refresh", refeshToken)
router.get("/logout", logOut)

export default router;

