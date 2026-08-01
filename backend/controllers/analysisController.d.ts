import type { Response, NextFunction } from 'express';
import multer from 'multer';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
export declare const upload: multer.Multer;
/**
 * POST /api/analyses/upload
 * Upload a PDF and trigger AI analysis
 */
export declare const uploadAndAnalyze: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/analyses
 * Get paginated list of user's analyses
 */
export declare const getMyAnalyses: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /api/analyses/:id
 * Get single analysis by ID
 */
export declare const getAnalysisById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * GET /api/analyses/:id/status
 * Poll status of a processing analysis
 */
export declare const getAnalysisStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * DELETE /api/analyses/:id
 * Delete a user's analysis
 */
export declare const deleteAnalysis: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=analysisController.d.ts.map