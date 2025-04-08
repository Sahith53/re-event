import passport from 'passport';
import logger from '../utils/logger.js';

export const googleAuth = (req, res, next) => {
    logger.info('Initiating Google authentication', {
        url: req.url,
        method: req.method
    });
    
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
};

export const googleCallback = (req, res) => {
    logger.info('Processing Google callback', {
        url: req.url,
        method: req.method,
        query: req.query
    });
    
    passport.authenticate('google', (err, data) => {
        if (err) {
            logger.error('Google authentication failed', {
                error: err.message,
                stack: err.stack,
                code: err.code
            });
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
        }

        if (!data) {
            logger.warn('No data received from Google authentication');
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=No data received`);
        }

        logger.info('Google authentication successful', {
            userEmail: data.user.email,
            userId: data.user._id
        });
        
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${data.token}`);
    })(req, res);
};