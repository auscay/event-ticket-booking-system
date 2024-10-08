import express from 'express';
import * as bookingController from './booking.controller.js'

const router = express.Router();

router.post('/book', bookingController.bookTicket);

router.post('/cancel', bookingController.cancelBooking);

export default router;