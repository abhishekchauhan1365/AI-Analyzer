import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';

const app = express();

import mongoose from 'mongoose';
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) return res.status(500).json({ error: 'No URI' });
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    res.status(200).json({ status: 'Connected' });
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

let isConnected = false;
app.use(async (req, res, next) => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return next();
  }
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB Connected via middleware');
    next();
  } catch (err) {
    console.error('DB Error:', err);
    next();
  }
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any origin dynamically (safe for this specific project state)
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);

// Fallback routes in case VITE_API_URL was set without the /api suffix
app.use('/auth', authRoutes);
app.use('/analyses', analysisRoutes);



app.use(notFound);
app.use(errorHandler);

export default app;
