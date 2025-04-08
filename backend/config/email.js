import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verify required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
  console.error('Missing required email environment variables:');
  if (!process.env.EMAIL_USER) console.error('- EMAIL_USER is missing');
  if (!process.env.EMAIL_PASS) console.error('- EMAIL_PASS is missing');
  if (!process.env.EMAIL_FROM) console.error('- EMAIL_FROM is missing');
  process.exit(1);
}

// Create transporter with secure configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Only for development, remove in production
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
  } else {
    console.log('Server is ready to take our messages');
    console.log('Using email account:', process.env.EMAIL_USER);
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    console.log('Attempting to send email to:', to);
    console.log('Using email account:', process.env.EMAIL_USER);

    const mailOptions = {
      from: `"Re-Event" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    throw error;
  }
};

export const sendOtpEmail = async (email, otp) => {
  const subject = 'Your OTP for Re-Event Login';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your OTP for Re-Event Login</h2>
      <p>Hello,</p>
      <p>Your OTP for login is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
      <p>Best regards,<br>Re-Event Team</p>
    </div>
  `;

  return sendEmail(email, subject, html);
}; 