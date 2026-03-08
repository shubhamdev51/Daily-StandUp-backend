const emailjs = require("@emailjs/nodejs");

const sendEmail = async (email, otp) => {
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        email: email,
        otp: otp
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Email failed:", error);
    throw error;
  }
};

module.exports = sendEmail;