import rateLimit from 'express-rate-limit';
import redis from '../config/redis.js';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

export const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100, // Increased from default
    message: {
        success: false,
        message: "Too many OTP requests, please try again after an hour."
    }
});