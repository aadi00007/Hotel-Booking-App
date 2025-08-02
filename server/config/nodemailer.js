// config/nodemailer.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL, // Use your sender email
    pass: process.env.BREVO_API_KEY, // Use your Brevo API key as password
  }
});

console.log('📧 SMTP transporter created with Brevo');

export default transporter;