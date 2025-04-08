import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import redis from '../config/redis.js';
import { AppError } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';  // Add this import at the top

export const generateOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Generate a 5-digit numeric OTP
        const generatedOTP = Math.floor(10000 + Math.random() * 90000).toString();

        // Store the OTP
        try {
            await redis.set(
                `otp:${email}`,
                JSON.stringify({ otp: generatedOTP, createdAt: Date.now() }),
                'EX',
                300
            );
        } catch (redisError) {
            throw new AppError('Failed to store OTP', 500);
        }

        // Send email
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP for Re-Event',
                text: `Your OTP is: ${generatedOTP}. Valid for 5 minutes.`
            });
        } catch (emailError) {
            throw new AppError('Failed to send OTP email', 500);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            throw new AppError('Email and OTP are required', 400);
        }

        const storedData = await redis.get(`otp:${email}`);
        
        if (!storedData) {
            throw new AppError('OTP expired or not found', 400);
        }

        const storedOTPData = JSON.parse(storedData);

        if (storedOTPData.otp !== otp) {
            throw new AppError('Invalid OTP', 400);
        }

        // After successful OTP verification, generate JWT token
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Delete OTP from redis
        await redis.del(`otp:${email}`);
        
        // Return success with token
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token: token,
            user: { email }
        });

    } catch (error) {
        next(error);
    }
};