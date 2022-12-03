import {Router} from 'express'
import { infoUser, login, register, refeshToken, logOut } from '../controllers/auth.controller.js';
import { requireUserToken } from '../middlewares/requireToken.js';
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js';
import { bodyLoginValidator, bodyRegisterValidator } from '../middlewares/validatorManager.js';

const router = Router()


router.post("/register", bodyRegisterValidator, register)
router.post("/login", bodyLoginValidator, login)
router.get("/protected", requireUserToken, infoUser)
router.get("/refresh", requireRefreshToken,refeshToken)
router.get("/logout", logOut)

export default router;

