import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from '../controllers/roomController.js';

const roomRouter = express.Router();

// Public route - no auth needed
roomRouter.get('/', getRooms);

// Protected routes - auth first, then file upload if needed
roomRouter.post('/', protect, upload.array("images", 4), createRoom);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;