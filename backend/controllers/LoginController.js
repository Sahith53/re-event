import otpGenerator from 'otp-generator';
import OtpModel from '../models/otpModel.js';
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOtpEmail } from '../config/email.js';
import passport from 'passport';
import { Router } from 'express';

dotenv.config();

const generateUniqueOtp = async () => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required',
        details: 'Please provide an email address'
      });
    }

    console.log('Sending OTP to:', email);
    
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

    console.log('Generated OTP:', otp);
    
    try {
      await sendOtpEmail(email, otp);
      console.log('OTP sent successfully to:', email);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ 
        error: 'Failed to send OTP email',
        details: emailError.message
      });
    }
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: error.message
    });
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

// Create router
const router = Router();

// OTP routes
router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);
router.get('/me', getProfile);
router.get('/me2', getProfile2);
router.post('/setusername', setUsername);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "https://re-event-orcin.vercel.app/login",
  successRedirect: "https://re-event-orcin.vercel.app/dashboard"
}));

export default router;