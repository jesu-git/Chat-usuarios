import nodemailer from 'nodemailer'


const transport = nodemailer.createTransport({

    service: 'gmail',
    port: 587,
    auth: {

        user: process.env.userEmail,
        pass: process.env.keyEmail
    }
})


export const enviarEmail = async (subject, to, message) => {

    return transport.sendMail({

        to,
        subject,
        html: message
    })
}