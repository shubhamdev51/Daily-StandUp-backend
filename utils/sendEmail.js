const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
});

const sendEmail = async (email, otp) => {
  try {

    const mailOptions = {
      from: "yourbrevoemail@gmail.com",
      to: email,
      subject: "Your OTP for Authentication",
      html: `<div style="font-family: Arial, sans-serif; background-color:#f4f6f8;padding:30px">
        <div style="max-width:500px;margin:auto;background:#fff;padding:30px;border-radius:8px">
          <h2 style="text-align:center">Email Verification</h2>
          <p>Your One Time Password is:</p>

          <div style="text-align:center;margin:30px 0">
            <span style="font-size:28px;font-weight:bold;letter-spacing:6px">
              ${otp}
            </span>
          </div>

          <p style="text-align:center;color:gray">
            This OTP will expire in 5 minutes.
          </p>
        </div>
      </div>`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;