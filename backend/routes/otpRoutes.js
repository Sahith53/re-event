import express from 'express';
import { generateOTP, verifyOTP } from '../controllers/otpController.js';
import { validateRequest, schemas } from '../middleware/validateRequest.js';
import { otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/generate', otpLimiter, validateRequest(schemas.otp.generate), generateOTP);
router.post('/verify', validateRequest(schemas.otp.verify), verifyOTP);

export default router;