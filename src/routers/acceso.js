import { Router } from "express"
import { AccesoController } from "../controllers/acceso.controller.js"
import passport from "passport"
import { cambioStatus } from "../middelware/checkToken.js"
import { error } from "console"
import { manejoError } from "../middelware/errorPassport.js"
import { CheckConexion } from "../middelware/CheckConexion.js"




export const router = Router()


router.get("/registro", AccesoController.registro)
router.post("/registro/create", passport.authenticate("registro", { failureRedirect: "/error", session: false }), AccesoController.registroCreate)
router.get("/error", AccesoController.error)
router.post("/login",CheckConexion, passport.authenticate("login", { failureRedirect: "/?error= Usuario o password incorrecto", session: false }), AccesoController.login)
router.get("/logout", cambioStatus, manejoError, AccesoController.logout)
router.get("/formEmail", AccesoController.formEmail)
router.get("/cambioPassword", AccesoController.cambioPassword)
