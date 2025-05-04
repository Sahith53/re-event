import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const testapi = async (req, res) => {
    try {
        const { name } = req.body;
        res.status(200).json({ message: `Hello ${name}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a proper authentication middleware
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token', error: error.message });
    }
};