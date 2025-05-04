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
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
}));

//changed

import eventRoutes from './routes/eventRoutes.js';

app.use(express.json());





app.use('/', router);
app.use('/login', router);
app.use('/events', eventRoutes);





mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB 🥳');
}).catch((err) => {
    console.log(err);
}
);

app.listen(port, () => console.log(`yowamio listening on port ${port}!`));