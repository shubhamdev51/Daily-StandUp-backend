const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: "OTP Verification <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP for Authentication",
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8;padding:30px">
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
      </div>
      `
    });

    console.log("Email sent:", response);

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;