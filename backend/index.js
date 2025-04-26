import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;  // Make sure this is defined before using it
import mongoose from 'mongoose';
import cors from 'cors';  // Add this import at the top with other imports
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { apiLimiter } from './middleware/rateLimiter.js';
import { securityMiddleware } from './middleware/security.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

// import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import passport from './config/passport.js';
import eventRoutes from './routes/eventRoutes.js';
import LoginController from "./controllers/LoginController.js";
import otpRoutes from './routes/otpRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Add this line before other middleware
app.set('trust proxy', 1);

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://re-event-1.onrender.com',
        'https://re-event-orcin.vercel.app' // <-- Add your Vercel frontend URL here
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(helmet());

// Session and passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        httpOnly: true
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiting only once
app.use('/api', apiLimiter);

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', LoginController);
app.use('/api/otp', otpRoutes);

// Error handling should be last
app.use(errorHandler);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB 🥳');
        app.listen(port, () => console.log(`Server listening on port ${port}!`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process if MongoDB connection fails
    });