const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL, // your Gmail address
        pass: process.env.CONTACT_EMAIL_PASSWORD, // your Gmail App Password
      },
    });

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.CONTACT_EMAIL, // email where you want to receive messages
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

module.exports = router;
