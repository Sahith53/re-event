import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing passport configuration...');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('Google Callback URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('Frontend URL:', process.env.FRONTEND_URL);

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials');
  throw new Error('Missing Google OAuth credentials');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true // Required for HTTPS
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Processing Google profile:', profile.emails[0].value);
        console.log('Profile data:', {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });

        // Check if user already exists
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          console.log('Creating new user...');
          // Create new user if doesn't exist
          user = await UserModel.create({
            email: profile.emails[0].value,
            username: profile.displayName,
            googleId: profile.id,
          });
          console.log('New user created:', user);
        } else {
          console.log('User already exists:', user);
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return done(null, { user, token });
      } catch (error) {
        console.error('Error in Google strategy:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          code: error.code
        });
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.email);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing user:', user.email);
  done(null, user);
});

console.log('Passport configuration complete');

export default passport;