import { modelUser } from "../models/users.js"


export const CheckConexion = async (req, res, next) => {

    const { username } = req.body
    const status = "En linea"
    const usuario = await modelUser.findOne({ email: username })
    if (usuario && usuario.status == status) return res.redirect('/?error=Conectado en otro dispositivo')
    next()
}