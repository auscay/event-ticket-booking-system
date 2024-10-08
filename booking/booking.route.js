import express from 'express';
import { bookLimiter, cancelLimiter } from '../middlewares/rate-limit.auth.js';
import * as bookingController from './booking.controller.js'

const router = express.Router();

router.post('/book', bookLimiter, bookingController.bookTicket);

router.post('/cancel', cancelLimiter, bookingController.cancelBooking);

export default router;