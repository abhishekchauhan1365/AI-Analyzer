import multer from 'multer';
import { Analysis } from '../models/Analysis.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeResume, streamChatWithContext } from '../services/geminiService.js';
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
// @desc    Chat with a specific document (Streaming)
// @route   POST /api/analyses/:id/chat
// @access  Private
export const chatWithDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { messages } = req.body;
        const userId = req.user._id.toString();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return next(new AppError('Messages array is required', 400));
        }
        const analysis = await Analysis.findOne({ _id: id, userId }).select('+textContent');
        if (!analysis) {
            return next(new AppError('Analysis not found.', 404));
        }
        if (analysis.status !== 'completed' || !analysis.textContent) {
            return next(new AppError('Document is not ready for chat yet.', 400));
        }
        // Set up Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const stream = streamChatWithContext(analysis.textContent, messages);
        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
    }
    catch (error) {
        // If headers are already sent, we can't use next(error) properly for JSON response
        // So we just close the stream with an error message
        console.error('Streaming error:', error);
        res.write(`data: ${JSON.stringify({ error: 'An error occurred during generation.' })}\n\n`);
        res.end();
    }
};
//# sourceMappingURL=analysisController.js.map