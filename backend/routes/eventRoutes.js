import express from 'express';
import logger from '../utils/logger.js';
import { validate } from '../middleware/validate.js';
import { eventSchema } from '../validations/schemas.js';
import { 
    getAllEvents, heyyo, getEvents, getEventById, 
    addQuestionsToEvent, editEvent, deleteEvent, 
    registerUserForEvent, checkregisterevent, neweventAddUser, 
    checkuserev, editQuestionsForEvent, addEventToCreatorUser,
    fetchCreatedEvents, qrscancall, getcheckinusers,
    addnewhostotevent, addneweventtohost, createEvent 
} from '../controllers/eventController.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - eventname
 *         - description
 *         - date
 *         - time
 *         - location
 *         - eventtype
 *       properties:
 *         eventname:
 *           type: string
 *           description: Name of the event
 *         description:
 *           type: string
 *           description: Event description
 *         date:
 *           type: string
 *           format: date
 *           description: Event date
 *         time:
 *           type: string
 *           description: Event time
 *         location:
 *           type: string
 *           description: Event location
 *         eventtype:
 *           type: string
 *           enum: [online, offline]
 *           description: Type of event
 */

const eventRoutes = express.Router();

/**
 * @swagger
 * /api/events/newevent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
eventRoutes.post('/newevent', validate(eventSchema.create), createEvent);

// Log all requests to event routes
eventRoutes.use((req, res, next) => {
    logger.info('Event route accessed', {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip
    });
    next();
});

// Basic routes
eventRoutes.get('/', heyyo);
eventRoutes.get('/getall', getAllEvents);
eventRoutes.get('/getevents', getEvents);
eventRoutes.get('/geteventbyid/:id', getEventById);

// Event creation and modification routes with validation
eventRoutes.post('/newevent', validate(eventSchema.create), createEvent);
eventRoutes.put('/editevent/:id', validate(eventSchema.update), editEvent);
eventRoutes.delete('/deleteevent/:id', deleteEvent);

// Question management routes
eventRoutes.post('/addquestionstoevent/:id', addQuestionsToEvent);
eventRoutes.put('/editquestionsforevent/:id', editQuestionsForEvent);

// Registration routes
eventRoutes.post('/registerUserForEvent/:eventcode', registerUserForEvent);
eventRoutes.get('/checkregisterevent/:eventcode', checkregisterevent);
eventRoutes.post('/neweventAddUser/:eventcode', neweventAddUser);
eventRoutes.get('/checkuserev/:eventcode/:userId', checkuserev);

// Host management routes
eventRoutes.post('/addnewhostotevent', addnewhostotevent);
eventRoutes.post('/addneweventtohost', addneweventtohost);
eventRoutes.post('/addeventtocreatoruser', addEventToCreatorUser);

// Event retrieval routes
eventRoutes.get('/geteventsbyuserid/:emailId', fetchCreatedEvents);
eventRoutes.get('/getcheckinusers/:id', getcheckinusers);

// QR code routes
eventRoutes.post('/qrscancall/:id', qrscancall);

export default eventRoutes;