import { connectDB } from '../backend/config/db.js';
import app from '../backend/app.js';

// Connect to MongoDB when the Vercel serverless function spins up
connectDB().catch(console.dir);

export default app;
