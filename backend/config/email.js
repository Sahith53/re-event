import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verify environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
  console.error('Missing required email environment variables');
  console.error('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
  console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
  console.error('EMAIL_FROM:', process.env.EMAIL_FROM ? 'Set' : 'Missing');
  throw new Error('Missing required email environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true // Enable debug logging
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
  } else {
    console.log('Transporter verification successful');
    console.log('Server is ready to send emails');
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    console.log('Attempting to send email to:', to);
    console.log('Using email account:', process.env.EMAIL_USER);

    const mailOptions = {
      from: `"Re:Event" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendOtpEmail = async (email, otp) => {
  const subject = 'Re:Event - Login OTP';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Your OTP for Re:Event Login</h2>
      <p>Hello,</p>
      <p>Your OTP for logging into Re:Event is:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;

  return sendEmail(email, subject, html);
}; 