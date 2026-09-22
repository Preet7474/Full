const transporter = require('./mailsender');

const sendOtp = async (email, otp, purpose) => {
    let subject;
    let heading;
    let message;

    if (purpose === "login") {
        subject = "EpicPassManager Login Verification";
        heading = "Login Verification";
        message = "Use this OTP to verify your login to EpicPassManager.";
    }
    else if (purpose === "register") {
        subject = "Verify Your EpicPassManager Account";
        heading = "Account Verification";
        message = "Use this OTP to verify your EpicPassManager account.";
    }
    else if (purpose === "forgot") {
        subject = "EpicPassManager Password Reset";
        heading = "Password Reset Verification";
        message = "Use this OTP to verify your identity and reset your EpicPassManager password.";
    }

    try {
        await transporter.sendMail({
            from: `"EpicPassManager"<${process.env.BREVO_SENDER}>`,
            to: email,
            subject: subject,
            html: `
            <div style="font-family:Arial,sans-serif;">
                <h2>EpicPassManager ${heading}</h2>
                <p>${message}</p>
                <p>Your One-Time Password is:</p>
                <h1 style="letter-spacing:5px;color:#06b6d4;">  ${otp} </h1>
                <p>This OTP is valid for <b>5 minutes</b>.</p>
                <p>If you didn't request this login, you can safely ignore this email.</p>
            </div>  `
        });
        console.log("OTP sent successfully to", email);
    }
    catch (err) {
        console.error("Failed To send OTP:", err);
        throw err;
    }

}

module.exports = sendOtp;