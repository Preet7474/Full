const transporter = require('./mailsender');

const sendOtp = async (email, otp) => {

//     try {
//   await transporter.verify();
//   console.log("Server is ready to take our messages");
// } catch (err) {
//   console.error("Verification failed:", err);
// }
   
    try {
        await transporter.sendMail({
            from: `"EpicPassManager"<${process.env.BREVO_SENDER}>`,
            to: email,
            subject: "EpicPassManager Login Verification",
            html: `
            <div style="font-family:Arial,sans-serif;">
                <h2>EpicPassManager Login Verification</h2>
                <p>Your One-Time Password is:</p>
                <h1 style="letter-spacing:5px;color:#06b6d4;">  ${otp} </h1>
                <p>This OTP is valid for <b>5 minutes</b>.</p>
                <p>If you didn't request this login, you can safely ignore this email.</p>
            </div>  `
        });
        console.log("OTP sent successfully to", email);
    }
    catch (err) {
        console.error("Failed To send OTP:",err);
        throw err;
    }

}

module.exports = sendOtp;