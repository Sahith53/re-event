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

const app = express();
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://re-event-backend.onrender.com',
        'https://rvent.vercel.app',
        'https://re-event-1.onrender.com'  // Add your new Render URL
    ],
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

//changed

import eventRoutes from './routes/eventRoutes.js';

app.use(express.json());





app.use('/', router);
app.use('/login', router);
app.use('/events', eventRoutes);





// MongoDB connection with retry logic
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB 🥳');
        app.listen(port, () => console.log(`Server listening on port ${port}!`));
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();