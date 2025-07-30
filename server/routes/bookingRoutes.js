import express from 'express';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// Check availability route - with authentication
bookingRouter.post('/check-availability', protect, checkAvailabilityAPI);

// Create booking route - fixed path from '/book' to '/'
bookingRouter.post('/', protect, createBooking);

// Get user bookings
bookingRouter.get('/user', protect, getUserBookings);

// Get hotel bookings for dashboard
bookingRouter.get('/hotel', protect, getHotelBookings);

export default bookingRouter;
