import express from 'express';
import * as bookingController from './booking.controller.js'

const router = express.Router();

router.post('/book', bookingController.bookTicket);

export default router;