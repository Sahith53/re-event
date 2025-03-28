import passport from 'passport';

export const googleAuth = (req, res, next) => {
  console.log('Starting Google authentication...');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
};

export const googleCallback = (req, res) => {
  console.log('Received Google callback...');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Query parameters:', req.query);
  
  passport.authenticate('google', (err, data) => {
    if (err) {
      console.error('Google auth error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code
      });
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }

    if (!data) {
      console.error('No data received from Google authentication');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=No data received`);
    }

    console.log('Google authentication successful, redirecting to frontend...');
    console.log('User data:', {
      email: data.user.email,
      id: data.user._id
    });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${data.token}`);
  })(req, res);
}; 