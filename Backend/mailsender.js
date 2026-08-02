// import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');



// service: "gmail", // this taking 25-30 sec time

// host:"smtp.gmail.com",
// port: 465,
// secure: true, // true because port 465
// pool: true,
    // maxConnections: 5,
    // maxMessages: 100,
    // auth: {
        //     user: process.env.EMAIL_USER,
        //     pass: process.env.EMAIL_PASS
        // }
        const transporter = nodemailer.createTransport({

    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});


// export default transporter;

module.exports = transporter;