import type { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
export declare const registerUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const loginUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logoutUser: (req: Request, res: Response) => void;
export declare const getUserProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUserProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map