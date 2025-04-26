import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/LoginController.js';
import { validateRequest, schemas } from '../middleware/validateRequest.js';
import { otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/generate', otpLimiter, validateRequest(schemas.otp.generate), sendOtp);
router.post('/verify', validateRequest(schemas.otp.verify), verifyOtp);

export default router;