import { Router } from "express";
import { redirectlink } from "../controllers/redirect.controller.js";
const router = Router()

router.get("/:shortLink", redirectlink)


export default router