import express from 'express';
import 'dotenv/config';
import cors from "cors";
import { clerkMiddleware, createClerkClient } from '@clerk/express';

// Import configurations and routes
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import clerkWebHooks from './controllers/clerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

// Initialize connections
connectDB();
connectCloudinary();

const app = express();

// Initialize Clerk client
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// CORS configuration
app.use(cors({
  origin: [
    'https://hotel-booking-app-qhev.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// Clerk middleware - this handles handshakes automatically
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

app.use((req, res, next) => {
  // Check if this is a Clerk handshake request
  if (req.query.__clerk_handshake) {
    console.log('Clerk handshake request received');
    // Let the request pass through to Clerk middleware
    return next();
  }
  next();
});
// Handle Clerk handshake requests specifically
app.get('/', (req, res) => {
  // Check if this is a Clerk handshake request
  if (req.query.__clerk_handshake) {
    // Return success - Clerk middleware already processed it
    return res.status(200).json({ success: true, message: 'Handshake processed' });
  }
  
  // Regular homepage
  res.send("API is working");
});

// Routes
app.use("/api/clerk", clerkWebHooks);


// API routes with authentication
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler for API routes
app.use('/api/*path', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database connected');
  console.log('Clerk configured');
});
