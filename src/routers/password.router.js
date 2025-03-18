import { Router } from "express";
import { PasswordController } from "../controllers/password.controller.js";



export const router = Router()


router.post("/checkEmail", PasswordController.checkEmail)
router.post("/cambioPassword" , PasswordController.cambioPassword)