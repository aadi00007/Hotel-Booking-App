import express from 'express'
import 'dotenv/config';
import cors from "cors";

import { clerkMiddleware } from '@clerk/express'

import connetDB from './config/db.js';
import clerkWebHooks from './controllers/clerkWebHooks.js';
connetDB();

const app = express()
app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/clerk",clerkWebHooks)
app.get('/', (req, res)=>res.send("API is working "))
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));