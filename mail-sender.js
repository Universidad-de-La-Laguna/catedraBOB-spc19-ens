const nodemailer = require('nodemailer')
const config = require('./config')
const { logger } = require("./utils/logger")

function sendEmail(email, subject, text, html) {
    logger.info(`Sending validation email to ${email} with subject '${subject}'`)

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: config.EMAIL.SMTP.SERVICE,
        auth: {
            user: config.EMAIL.SMTP.AUTH.USERNAME, // generated ethereal user
            pass: config.EMAIL.SMTP.AUTH.PASSWORD // generated ethereal password
        }
    })

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"${config.EMAIL.SMTP.FROM.NAME}" <${config.EMAIL.SMTP.FROM.EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        logger.info('Message sent: %s', info.messageId)
    })
}

module.exports = {
    sendEmail
}