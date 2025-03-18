import { Router } from "express"
import { AccesoController } from "../controllers/acceso.controller.js"
import passport from "passport"


export const router = Router()


router.get("/registro", AccesoController.registro)
router.post("/registro/create", passport.authenticate("registro", { failureRedirect: "/error", session: false }), AccesoController.registroCreate)
router.get("/error", AccesoController.error)
router.post("/login", passport.authenticate("login", { failureRedirect: "/?error= Usuario o password incorrecto", session: false }), AccesoController.login)
router.get("/logout",AccesoController.logout )
router.get("/formEmail", AccesoController.formEmail)
router.get("/cambioPassword", AccesoController.cambioPassword)
     