import jwt from 'jsonwebtoken'
import { modelUser } from "../models/users.js"
import { enviarEmail } from '../utils/envioEmail.js'
import { createHash, verificador } from '../utils/hash.js'



export class PasswordController {

    static async checkEmail(req, res) {

        try {

            const { email } = req.body
            let usuario = await modelUser.findOne({ email: email })
            if (!usuario) return res.status(401).json("No se encontro el usuario")
            delete usuario.Password
            let tk = jwt.sign({ ...usuario }, "chat", { expiresIn: '1h' })
            const mensaje = `<h2>Restablecer el password</h2>
            <p>k
                Hemos recibido una solicitud de cambio de password de su cuenta en nustro CHAT, para realizar el cambio haz click <a href="http://localhost:3000/api/acceso/cambioPassword?tk=${tk}">aqui</a>
            </p>`
    
            enviarEmail("Restablecimiento de password", email, mensaje)
    
            return res.redirect( "/api/acceso/formEmail?mensaje=Te enviamos un email de recuperacion a tu cuenta de email" )

        } catch (error) {

            return res.status(400).json({ error: error })
        }

    }
    static async cambioPassword(req, res) {

            
        let { password, repeticion , token} = req.body
        
        let datos = jwt.verify(token, "chat")
        
        if (!datos) return res.redirect("/api/acceso/login?error=El link utilizado ha expirado")

        let usuario = await modelUser.findOne({ _id: datos._doc._id })
        if (password != repeticion) return res.redirect( "/api/acceso/cambioPassword?error=Las contraseñas ingresadas son diferentes" )
        
            let nuevo = createHash(password)
        
        let check = await verificador(password, usuario.password)
        console.log("revisando",check)
        if (check) return res.redirect("/api/acceso/cambioPassword?error=La contraseña es antigua, coloca una nueva")
        let cambioPassword = await modelUser.findOneAndUpdate({ _id: usuario._id }, { $set: { password: nuevo} })

        return res.redirect("/?mensaje=La contraseña fue restablecida con exito.")


    }
}