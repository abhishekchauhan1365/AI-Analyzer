import mongoose from 'mongoose';
import app from '../backend/app.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('MongoDB connected for serverless environment');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error: Database connection failed' });
  }
  
  // Forward the request to the monolithic Express app
  return app(req as any, res as any);
}
