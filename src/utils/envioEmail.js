import nodemailer from 'nodemailer'


const transport = nodemailer.createTransport({

    service: 'gmail',
    port: 587,
    auth: {

        user: 'suarezjesu90@gmail.com',
        pass: 'ctvg vxfs vpbs hvex'
    }
})


export const enviarEmail = async (subject, to, message) => {

    return transport.sendMail({

        to,
        subject,
        html: message
    })
}