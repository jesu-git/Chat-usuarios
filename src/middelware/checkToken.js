import jwt from 'jsonwebtoken'
import { modelUser } from '../models/users.js'
import { config } from '../config/config.js'

export const cambioStatus = async (req, res, next) => {
    
    let token = req.cookies.user
    try {

        let verificadorToken = jwt.verify(token, process.env.keySecret)
        next()

    } catch (error) {

        let decode = jwt.decode(req.cookies.user)
        if (decode) {

            let cambiarStatus = await modelUser.findOneAndUpdate({ _id: decode._doc._id }, { $set: { status: "Desconectado" } })
        }



        next()




    }



}