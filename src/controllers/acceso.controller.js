
import jwt from "jsonwebtoken"
import { modelUser } from "../models/users.js"
import { config } from "../config/config.js"




export class AccesoController {


    static async registroCreate(req, res) {

        const { email } = req.user
        return res.redirect(`/?mensaje=Usuario ${email} creado con exito`)

    }
    static async registro(req, res) {

        let noNav = true
        let registro = true


        return res.status(200).render("registro", { titulo: "Registrete", registro, noNav })
    }
    static async formEmail(req, res) {

        let noNav = true
        let formEmail = true
        let { error, mensaje } = req.body

        return res.status(200).render("formEmail", { titulo: "Restablecer contraseña", formEmail, noNav, mensaje, error })
    }
    static async cambioPassword(req, res) {

        let noNav = true
        let cambio = true

        const { tk } = req.query
        let usuario = jwt.verify(tk, process.env.keySecret)
        if (!usuario) return res.redirect("/?error=El link utilizado ha expirado")

        return res.status(200).render("formPassword", { titulo: "Cambio contraseña", cambio, noNav, tk })
    }
    static async login(req, res) {


        const user = req.user
        
        if (!user) return res.redirect("/?error=Problemas en el proceso de login")
        const cambioStatus = await modelUser.findOneAndUpdate({ _id: user._id.valueOf() }, { $set: { status: "En linea" } })

        const tk = jwt.sign({ ...user }, process.env.keySecret, { expiresIn: "1h" })
        res.cookie("user", tk, { httpOnly: true })

        return res.redirect("/chat")
    }
    static async error(req, res) {

        return res.redirect("/api/acceso/registro")

    }
    static async logout(req, res) {
        console.log("desde el logout", req.user)
        const user = req.user

        try {
            if (!user || user == undefined) {

                req.user = null
                res.clearCookie("user")

                return res.status(200).json("Session cerrada")

            }
            const desconectar = await modelUser.findOneAndUpdate({ _id: user._id }, { $set: { status: "Desconectado" } })

            req.user = null
            res.clearCookie("user")

            return res.status(200).json("Session cerrada")

        } catch (error) {

            return res.status(400).json("error")

        }
    }
}