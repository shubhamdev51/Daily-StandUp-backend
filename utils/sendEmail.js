const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS ? "Password loaded" : "Password missing");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Authentication",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
         <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
         <h2 style="text-align: center; color: #333333;">Email Verification</h2>
         <p style="font-size: 15px; color: #555555; line-height: 1.6;">
          Thank you for using our service. You can use the following One-Time Password (OTP) to complete your authentication process.
        </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="
          display: inline-block;
          padding: 15px 25px;
          font-size: 24px;
          letter-spacing: 5px;
          font-weight: bold;
          background-color: #e8f0fe;
          color: #1a73e8;
          border-radius: 6px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #777777; text-align: center;">
        This OTP will expire in <strong>5 minutes</strong>.
      </p>
      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eeeeee;" />
      <p style="font-size: 12px; color: #999999; text-align: center;">
        If you did not request this OTP, please ignore this email.
      </p>
    </div>
  </div>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }

};

module.exports = sendEmail;