import express from 'express';
import { createBooking, deleteBooking, getBookings } from '../controllers/bookingController.js';

const router = express.Router();


router.post('/bookings', createBooking);
router.get('/getbookings', getBookings);
router.delete('/deletebookings/:id', deleteBooking);

export default router;
