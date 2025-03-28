import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import OtpModel from '../models/otpModel.js';
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOtpEmail } from '../config/email.js';

dotenv.config();

const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Re:Event - Login OTP',
      html: `
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
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

const generateUniqueOtp = async () => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const existingOtp = await OtpModel.findOne({ email });
    let otp;

    if (existingOtp) {
      otp = await generateUniqueOtp();
      existingOtp.otp = otp;
      await existingOtp.save();
    } else {
      otp = await generateUniqueOtp();
      const newOtp = new OtpModel({ email, otp });
      await newOtp.save();
    }

    await sendOtpEmail(email, otp);
    console.log('OTP sent successfully to:', email);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp)

  try {
    // Find the user by email
    const existingUser = await UserModel.findOne({ email });
    console.log(existingUser)

    const otpDocument = await OtpModel.findOne({ email, otp });
    console.log(otpDocument)

    if (otpDocument && otpDocument.email === email && otpDocument.otp === otp) {
      // OTP verification successful

      if (!existingUser) {
        // If the user does not exist, create a new user
        const newUser = new UserModel({ email });
        await newUser.save();
      }

      // Retrieve the user (whether existing or newly created)
      const user = await UserModel.findOne({ email });
      console.log(user)

      // Or, generate a JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET, // Use the imported secret from config.js
        { expiresIn: '1h' } // Token expiration time, adjust as needed
      );

      // Create a session
      req.session.user = {
        userId: user._id,
        email: user.email,
      };

      res.status(200).json({
        success: true,
        message: 'OTP verification successful',
        token: token, // Include the token in the response
        user: {
          userId: user._id,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // console.log(req.headers.authorization.split(' ')[1]);
    const token = req.headers.authorization.split(' ')[1];
    // console.log(token)


    const decodedjwt = jwt.decode(token, process.env.JWT_SECRET);
    console.log(decodedjwt);


    const user = await UserModel.findById(req.userId);
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      decodedjwt: decodedjwt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getProfile2 = async (req, res) => {

  try {
    // console.log(req.headers.authorization.split(' ')[1]);
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await UserModel.findById(decoded.userId);
    const responseArray = {
      user: user.username,
      decode: decoded
    }
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      decodedjwt: responseArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const setUsername = async (req, res) => {
  try {
    const { username, uid } = req.body;
    console.log(username, uid)

    // Check if the provided username already exists
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose a different one.',
      });
    }

    // // Get the user ID from the request, assuming you have it available in req.user
    const userId = uid; // Modify this based on your authentication setup

    // // Update the user's username in the database
    await UserModel.findByIdAndUpdate(userId, { username });

    res.status(200).json({
      success: true,
      message: 'Username set successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};