import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import type { IUser } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;

  // Fallback to Authorization header if cookies are blocked by third-party cookie restrictions
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return next(new AppError('Not authorized, user not found', 401));
      }
      req.user = user;
      next();
    } catch (error) {
      next(new AppError('Not authorized, token failed', 401));
    }
  } else {
    next(new AppError('Not authorized, no token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user?.role} is not authorized to access this route`, 403));
    }
    next();
  };
};
