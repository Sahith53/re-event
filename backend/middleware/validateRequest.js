import Joi from 'joi';
import { AppError } from './errorHandler.js';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            return next(new AppError(errorMessage, 400));
        }
        next();
    };
};

// Common validation schemas
export const schemas = {
    otp: {
        generate: Joi.object({
            email: Joi.string().email().required()
        }),
        verify: Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string().length(4).pattern(/^\d+$/).required()
        })
    },
    user: {
        setUsername: Joi.object({
            username: Joi.string().min(3).max(30).required()
        })
    }
};