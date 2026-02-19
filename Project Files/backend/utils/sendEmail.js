const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abhinayakarri3@gmail.com',
            pass: 'nuuqknzhtvrptrir', // Provided app password
        },
    });

    const message = {
        from: 'abhinayakarri3@gmail.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        // html: options.html // html body (optional)
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
