import express from 'express'
import 'dotenv/config';
import cors from "cors";

import { clerkMiddleware } from '@clerk/express'

import connetDB from './config/db.js';
import clerkWebHooks from './controllers/clerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
connetDB();

connectCloudinary();

const app = express()
app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/clerk",clerkWebHooks)
app.get('/', (req, res)=>res.send("API is working "))


app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));