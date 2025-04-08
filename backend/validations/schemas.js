import Joi from 'joi';

export const eventSchema = {
    create: Joi.object({
        eventname: Joi.string().required().min(3).max(100),
        description: Joi.string().required().min(10),
        date: Joi.date()
            .min(new Date())
            .required()
            .messages({
                'date.min': 'Event date must be in the future',
                'date.base': 'Please provide a valid date'
            }),
        time: Joi.string().required(),
        location: Joi.string().required(),
        eventtype: Joi.string().valid('online', 'offline').required(),
        eventurl: Joi.string().uri().when('eventtype', {
            is: 'online',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        maxattendees: Joi.number().integer().min(1).required(),
        // Add these required fields
        visibility: Joi.string().valid('public', 'private').required(),
        registrationstatus: Joi.string().valid('open', 'closed').required(),
        eventstatus: Joi.string().valid('upcoming', 'ongoing', 'completed').required()
    }),
    update: Joi.object({
        eventname: Joi.string().min(3).max(100),
        description: Joi.string().min(10),
        date: Joi.date().greater('now'),
        time: Joi.string(),
        location: Joi.string(),
        eventtype: Joi.string().valid('online', 'offline'),
        eventurl: Joi.string().uri(),
        maxattendees: Joi.number().integer().min(1)
    })
};

export const userSchema = {
    profile: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required()
    })
};

export const otpSchema = {
    generate: Joi.object({
        email: Joi.string().email().required()
    }),
    verify: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string()
            .length(6)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
                'string.pattern.base': 'OTP must contain only numbers',
                'string.length': 'OTP must be 6 digits long'
            })
    })
};