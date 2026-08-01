import multer from 'multer';
import { Analysis } from '../models/Analysis.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeResume } from '../services/geminiService.js';
import { getCache, setCache, deleteCache } from '../services/cacheService.js';
import { AppError } from '../utils/AppError.js';
// Multer config — memory storage (no disk I/O)
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed.'));
        }
    },
});
/**
 * POST /api/analyses/upload
 * Upload a PDF and trigger AI analysis
 */
export const uploadAndAnalyze = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('Please upload a PDF file.', 400));
        }
        const userId = req.user._id.toString();
        const { originalname, size, buffer } = req.file;
        // Create analysis record with pending status
        const analysis = await Analysis.create({
            userId,
            fileName: originalname,
            fileSize: size,
            status: 'processing',
        });
        // Process asynchronously but respond immediately with the record
        (async () => {
            try {
                const text = await extractTextFromPDF(buffer);
                const result = await analyzeResume(text);
                analysis.status = 'completed';
                analysis.result = result;
                analysis.textContent = text;
                await analysis.save();
                // Invalidate user's analysis list cache
                await deleteCache(`analyses:user:${userId}`);
            }
            catch (err) {
                analysis.status = 'failed';
                analysis.errorMessage =
                    err instanceof Error ? err.message : 'Unknown error during analysis';
                await analysis.save();
            }
        })();
        res.status(202).json({
            success: true,
            data: analysis,
            message: 'File uploaded. Analysis is processing.',
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * GET /api/analyses
 * Get paginated list of user's analyses
 */
export const getMyAnalyses = async (req, res, next) => {
    try {
        const userId = req.user._id.toString();
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(20, parseInt(req.query.limit) || 10);
        const cacheKey = `analyses:user:${userId}:page:${page}`;
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json(cached);
        }
        const total = await Analysis.countDocuments({ userId });
        const analyses = await Analysis.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-textContent');
        const response = {
            success: true,
            data: analyses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
        await setCache(cacheKey, response, 60 * 5); // Cache 5 minutes
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
/**
 * GET /api/analyses/:id
 * Get single analysis by ID
 */
export const getAnalysisById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();
        const cacheKey = `analysis:${id}`;
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, data: cached });
        }
        const analysis = await Analysis.findOne({ _id: id, userId }).select('-textContent');
        if (!analysis) {
            return next(new AppError('Analysis not found.', 404));
        }
        await setCache(cacheKey, analysis, 60 * 60); // Cache 1 hour
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        next(error);
    }
};
/**
 * GET /api/analyses/:id/status
 * Poll status of a processing analysis
 */
export const getAnalysisStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();
        const analysis = await Analysis.findOne({ _id: id, userId }).select('status errorMessage fileName createdAt result');
        if (!analysis) {
            return next(new AppError('Analysis not found.', 404));
        }
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        next(error);
    }
};
/**
 * DELETE /api/analyses/:id
 * Delete a user's analysis
 */
export const deleteAnalysis = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();
        const analysis = await Analysis.findOneAndDelete({ _id: id, userId });
        if (!analysis) {
            return next(new AppError('Analysis not found.', 404));
        }
        // Invalidate caches
        await deleteCache(`analysis:${id}`);
        await deleteCache(`analyses:user:${userId}`);
        res.json({ success: true, message: 'Analysis deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=analysisController.js.map