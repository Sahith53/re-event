import dotenv from 'dotenv';

dotenv.config();

// Centralized configuration for the application
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  database: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/re-event',
  },
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    resave: false,
    saveUninitialized: true,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiresIn: '7d',
  },
  
  // Email configuration
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    service: 'gmail',
  },
  
  // CORS configuration
  cors: {
    allowedOrigins: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'https://re-event-orcin.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // Cache preflight request for 10 minutes
  },
};

export default config;
  