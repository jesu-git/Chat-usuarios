import { Router } from "express";
import passport from "passport";
import { Tolls } from "../controllers/tools.controller.js";

export const router = Router()

router.post("/filter", passport.authenticate("JWT", { session: false }), Tolls.filter)
router.post("/createSolicitud", passport.authenticate("JWT", { failureRedirect: "/api/acceso/error", session: false }),Tolls.createSolicitud)
router.post("/addContact", passport.authenticate("JWT", { failureRedirect: "/api/acceso/error", session: false }), Tolls.addContact)
router.post("/checkTalk", passport.authenticate("JWT", { failureRedirect: "/api/acceso/error", session: false }), Tolls.checkTalk)
router.post("/addMessage", Tolls.addMessage)
router.get("/getS/:_id", Tolls.getS)
