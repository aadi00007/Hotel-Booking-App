// config/nodemailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({  // ✅ Fixed: removed extra "er"
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'dummy',
    pass: process.env.SMTP_PASS || 'dummy',
  }
});

// Since you're using API approach, disable SMTP testing
console.log('📧 SMTP transporter created (using API for emails)');

export default transporter;
