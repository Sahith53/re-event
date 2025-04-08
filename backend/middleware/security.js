import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

export const securityMiddleware = [
    // Set security HTTP headers
    helmet(),
    
    // Data sanitization against NoSQL query injection
    mongoSanitize(),
    
    // Data sanitization against XSS
    xss(),
    
    // Prevent parameter pollution
    hpp({
        whitelist: ['date', 'sort', 'page', 'limit'] // Add parameters that can be duplicated
    })
];