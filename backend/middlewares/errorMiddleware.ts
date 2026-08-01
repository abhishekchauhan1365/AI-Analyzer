import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  }

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found`;
    statusCode = 404;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
