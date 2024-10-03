import express from 'express';
import * as eventController from './event.controller.js';
import { eventCreationValidator } from './event.validator.js';

const router = express.Router();

// Initialize a new event with a given number of tickets
router.post('/initializeS', eventController.createEvent)

export default router
