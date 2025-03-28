import express from 'express';
import { getHello } from '../controllers/controller.js';
import { sendOtp, verifyOtp, getProfile, setUsername, getProfile2 } from '../controllers/LoginController.js';
import { googleAuth, googleCallback } from '../controllers/googleAuthController.js';
import passport from '../config/passport.js';

const router = express.Router();

router.get('/', getHello);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', getProfile);
router.get('/me2', getProfile2);
router.post('/set-username', setUsername);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;