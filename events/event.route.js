import express from 'express';
import * as eventController from './event.controller.js';
import { eventCreationValidator } from './event.validator.js';

const router = express.Router();

// Initialize a new event with a given number of tickets
router.post('/initialize', eventController.createEvent)

// Retrieve the current status of an event (available tickets, waiting list count)
router.get('/status/:eventId', eventController.getEventStatus);

export default router
