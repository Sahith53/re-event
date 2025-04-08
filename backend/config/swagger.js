import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Re-Event API Documentation',
            version: '1.0.0',
            description: 'API documentation for Re-Event application',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://re-event-1.onrender.com'
                    : 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);