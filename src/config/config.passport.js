import passport from "passport";
import local from "passport-local"
import { modelUser } from "../models/users.js";
import { createHash, verificador } from "../utils/hash.js";
import passportJWT from "passport-jwt"
import jwt from "jsonwebtoken"
import { config } from "./config.js";
import { error } from "console";


const tkExtractor = (req) => {


    console.log("comienza")
    let token = null
    
    if (!req.cookies.user) {

        return token
    }
    token = req.cookies.user
    return token



}

export const initPassport = () => {

    passport.use("registro", new local.Strategy({

        passReqToCallback: true,
        usernameField: "email"

    },
        async (req, username, password, done) => {

            const { nombre, apellido, email } = req.body

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!email || !password || !apellido || !nombre) return done(null, false, { mensaje: "ERROR, faltante de datos requeridos" })
            if (!emailRegex.test(email)) return done(null, false, { mensaje: "ERROR, el email no tiene la estructura aceptada" })

            const queryEmail = await modelUser.findOne({ email })
            if (queryEmail) return done(null, false, { mensaje: "El email ya esta asociado a una cuenta" })

            const passwordhash = createHash(password)
            password = passwordhash
            const contactos = []
            const conversaciones = []
            const status = "Desconectado"

            try {

                let code

                const usuarioCode = await modelUser.find()
                if (usuarioCode.length == 0) {
                    code = 1
                }
                if (usuarioCode.length > 0) {

                    code = Math.max(...usuarioCode.map(x => x.code)) + 1
                }

                const usuario = await modelUser.create({ nombre, apellido, email, password, contactos, conversaciones, status, code })
                console.log("Usuario creado con exitos")

                done(null, usuario)

            } catch (error) {

                done(error)

            }



        })),
        passport.use("login", new local.Strategy({

            passReqToCallback: true

        },

            async (req, username, password, done) => {

                if (!password || !username) return done(null, false, { mensaje: "ERROR: Email y contraseña son obligatorios" })

                const checkEmail = await modelUser.findOne({ email: username })

                if (!checkEmail || checkEmail == undefined) return done(null, false, { mensaje: "Error: El usuario no existe" })

                const checkPassword = await verificador(password, checkEmail.password)

                if (!checkPassword) return done(null, false, { mensaje: "Error: El usuario o contraseña son incorrectos" })

                delete checkEmail.password
                checkEmail.status = "En linea"
                
                done(null, checkEmail)

            }))
    passport.use("JWT", new passportJWT.Strategy({

        secretOrKey: config.keySecret,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([tkExtractor]),


    },

        async (contentToken, done) => {

            
            try {
                if (!contentToken) return done(null, false, { mensaje: "Token invalido" })
                if (!"exp" in contentToken) return done(null, false, { mensaje: "Fallo con exp" })
                if (contentToken.exp * 1000 < Date.now()) return done(new error('token expirado'), false)
                
                let contenido = contentToken._doc
                if (!contenido) return done(null, false, { mensaje: 'Usuario no encontrado' })
                delete contenido.password
                
                return done(null, contenido)

            } catch (error) {

                return done(error)
            }
        }


    ))
}