import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import mongoose from 'mongoose';
import router from './routes/route.js';
import cors from 'cors';
// import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import passport from './config/passport.js';
import eventRoutes from './routes/eventRoutes.js';
import LoginController from "./controllers/LoginController.js";

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://re-event-1.onrender.com', 'https://re-event-orcin.vercel.app'],
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/events', eventRoutes);
app.use('/login', LoginController); // Use only LoginController for login routes

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB 🥳');
        app.listen(port, () => console.log(`Server listening on port ${port}!`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process if MongoDB connection fails
    });