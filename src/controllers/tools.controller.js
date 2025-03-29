import { conversacionModel } from "../models/conversaciones.js"
import { solicitudModel } from "../models/solicitud.js"
import { modelUser } from "../models/users.js"

export class Tolls {

    static async filter(req, res) {

        try {

            const { email } = req.body
            console.log("email", email)
            const user = req.user
            console.log("us", user)
            const usuario = await modelUser.findOne({ _id: user._id })
            const buscar = await modelUser.findOne({ email: email })
            if (!buscar) return res.json("El usuario que buscas no existe")

            const checkContact = user.contactos.find(x => x == buscar._id)
            if (checkContact) return res.status(400).json("El usuario ya esta en tus contactos")

            const checkSolicitudes = buscar.peticiones.find(x => x.emailReceptor == user.email)
            const check = usuario.peticiones.find(x => x.emailReceptor == buscar.email)
            if (checkSolicitudes || check) return res.status(400).json("Solicitud pendiente")

            delete buscar.password
            return res.status(200).json(buscar)

        } catch (error) {

            return res.status(400).json(error)

        }

    }
    static async createSolicitud(req, res) {

        const { solicitante, receptor } = req.body

        const usuario_solicitante = await modelUser.findOne({ _id: solicitante })
        if (!usuario_solicitante) return res.status(400).json("Usuarios no encontrado")

        const usuario_receptor = await modelUser.findOne({ _id: receptor })
        if (!usuario_receptor) return res.status(400).json("Usuario no encontrado")


        try {

            const solicitud = await solicitudModel.create({ usuario_solicitante: usuario_solicitante.email, usuario_receptor: usuario_receptor.email })
            if (!solicitud) return res.status(400).json("Error en proceso de solicitud")

            const iD_S = solicitud._id.valueOf()

            const solicitante_mod = await modelUser.findByIdAndUpdate({ _id: solicitante }, { $push: { "peticiones": { idSolicitud: iD_S, emailReceptor: usuario_receptor.email } } })
            console.log("dato 1--->", solicitante_mod)
            const receptor_mod = await modelUser.findByIdAndUpdate({ _id: receptor }, { $push: { "solicitudes": iD_S } })
            console.log("dato 2 --->", receptor_mod)
            return res.status(200).json({ mensaje: "Solicitud enviada", idSolicitud: iD_S })

        } catch (error) {

            return res.status(400).json("Error en proceso de solicitud")

        }

    }
    static async addContact(req, res) {

        try {

            const { idSolicitud } = req.body
            const solicitud = await solicitudModel.findOne({ _id: idSolicitud })
            if (!solicitud) return res.status(400).json("Solicitud invalida")
            if (solicitud.estado == "Aprobada") return res.status(401).json("Ya esta en tus conctactos")

            const receptor = await modelUser.findOne({ email: solicitud.usuario_receptor })
            if (!receptor) return res.status(400).json("Datos incorrectos")
            const addContactSol = await modelUser.findOneAndUpdate({ email: solicitud.usuario_solicitante }, { $push: { "contactos": receptor._id } })



            const solicitante = await modelUser.findOne({ email: solicitud.usuario_solicitante })
            if (!solicitante) return res.status(400).json("Datos incorrectos")
            const addContactRec = await modelUser.findOneAndUpdate({ email: solicitud.usuario_receptor }, { $push: { "contactos": solicitante._id } })


            const changeStatus = await solicitudModel.findOneAndUpdate({ _id: idSolicitud }, { $set: { estado: "Aprobada" } })



            return res.status(200).json({ status: "Solicitud aprobada", idSolicitud: idSolicitud })

        } catch (error) {

            return res.status(400).json("Error en proceso de agregar contacto")
        }

    }
    static async checkTalk(req, res) {

        try {

            const user = req.user
            const { dato } = req.body
            let conversacion

            const usuario = await modelUser.findOne({ _id: user._id }).populate('conversaciones')
            if (!usuario) return res.status(400).json("Usuario incorrecto")

            const contacto = await modelUser.findOne({ email: dato })
            if (!contacto || contacto.status == "desconectado") return res.status(400).json("Contacto incorrecto o desconectado")

            const usuarioConversaciones = usuario.conversaciones

            if (usuarioConversaciones.length > 0) {

                conversacion = usuarioConversaciones.filter(x => x.participantes.some(participante => participante.equals(contacto._id)))
                if (conversacion.length > 0) {

                    const enviar = { mensajes: conversacion[0].mensajes, id: conversacion[0]._id }
                    return res.status(200).json(enviar)
                }
            }
            if (!usuarioConversaciones || usuarioConversaciones.length == 0 || conversacion == undefined || conversacion.length == 0) {

                conversacion = {
                    participantes: [contacto._id, usuario._id],
                    mensajes: []
                }

                const createConv = await conversacionModel.create(conversacion)
                if (!createConv) return res.status(400).json("Error de creacion de conversacion")

                const addConvUsuario = await modelUser.findOneAndUpdate({ _id: usuario._id }, { $push: { conversaciones: createConv._id } })
                const addConvContacto = await modelUser.findOneAndUpdate({ _id: contacto._id }, { $push: { conversaciones: createConv._id } })

                let devolver = { mensajes: createConv.mensajes, id: createConv._id }
                return res.status(201).json(devolver)



            }

            return res.status(201).json({ mensajes: conversacion.mensajes, id: conversacion._id })

        } catch (error) {

            return res.status(400).json("ERROR en proceso de creacion de conversacion")
        }

    }
    static async addMessage(req, res) {

        const { email } = req.body
        const { nombre } = req.body
        const { mensaje } = req.body
        const { id } = req.body

        const checkConv = await conversacionModel.findOne({ _id: id })
        if (!checkConv) return res.status(400).json("Error, datos incorrectos")

        if (!email || email == undefined) return res.status(400).json("Error al enviar mensaje")
        if (!nombre || nombre == undefined) return res.status(400).json("Error, nombre es undefined")
        if (!mensaje || mensaje == undefined) return res.status(400).json("Error mensaje vacio")

        try {

            const addMessage = await conversacionModel.findByIdAndUpdate({ _id: id }, { $push: { mensajes: { email, nombre, mensaje } } })
            return res.status(201).json({ status: "OK" })

        } catch (error) {

            return res.status(400).json(error)

        }

    }
    static async getS(req, res) {

        const { _id } = req.query

        try {

            const mostrar = await solicitudModel.findById('6709c27006a0df5ed2136ca6').populate('usuario_solicitante').populate('usuario_receptor').lean()
            return res.status(200).send(mostrar)

        } catch (error) {

            return res.status(400).json("ERROR 404")

        }
    }
}