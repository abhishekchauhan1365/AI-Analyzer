import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { Analysis } from '../models/Analysis.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeText, streamChatWithContext } from '../services/geminiService.js';
import { getCache, setCache, deleteCache } from '../services/cacheService.js';
import { AppError } from '../utils/AppError.js';

// Multer config — memory storage (no disk I/O)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  },
});

/**
 * POST /api/analyses/upload
 * Upload a PDF and trigger AI analysis
 */
export const uploadAndAnalyze = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const textContentRaw = req.body.text;
    const analysisType = req.body.analysisType || 'Resume';

    if (!req.file && !textContentRaw) {
      return next(new AppError('Please upload a PDF file or provide text to analyze.', 400));
    }

    const userId = req.user!._id.toString();
    const fileName = req.file ? req.file.originalname : 'Text Input';
    const fileSize = req.file ? req.file.size : textContentRaw.length;
    const inputType = req.file ? 'pdf' : 'text';

    // Create analysis record with pending status
    const analysis = await Analysis.create({
      userId,
      fileName,
      fileSize,
      inputType,
      analysisType,
      status: 'processing',
    });

    // Process asynchronously but respond immediately with the record
    (async () => {
      try {
        let extractedText = textContentRaw;
        if (req.file) {
          extractedText = await extractTextFromPDF(req.file.buffer);
        }
        
        const result = await analyzeText(extractedText, analysisType);

        analysis.status = 'completed';
        analysis.result = result;
        analysis.textContent = extractedText;
        await analysis.save();

        // Invalidate user's analysis list cache
        await deleteCache(`analyses:user:${userId}`);
      } catch (err) {
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
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analyses
 * Get paginated list of user's analyses
 */
export const getMyAnalyses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id.toString();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(20, parseInt(req.query.limit as string) || 10);
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
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analyses/:id
 * Get single analysis by ID
 */
export const getAnalysisById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const cacheKey = `analysis:${id}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const analysis = await Analysis.findOne({ _id: id as string, userId }).select('-textContent');

    if (!analysis) {
      return next(new AppError('Analysis not found.', 404));
    }

    await setCache(cacheKey, analysis, 60 * 60); // Cache 1 hour
    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analyses/:id/status
 * Poll status of a processing analysis
 */
export const getAnalysisStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const analysis = await Analysis.findOne({ _id: id as string, userId }).select(
      'status errorMessage fileName createdAt result'
    );

    if (!analysis) {
      return next(new AppError('Analysis not found.', 404));
    }

    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/analyses/:id
 * Delete a user's analysis
 */
export const deleteAnalysis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const analysis = await Analysis.findOneAndDelete({ _id: id as string, userId });

    if (!analysis) {
      return next(new AppError('Analysis not found.', 404));
    }

    // Invalidate caches
    await deleteCache(`analysis:${id}`);
    await deleteCache(`analyses:user:${userId}`);

    res.json({ success: true, message: 'Analysis deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Chat with a specific document (Streaming)
// @route   POST /api/analyses/:id/chat
// @access  Private
export const chatWithDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { messages } = req.body;
    const userId = req.user!._id.toString();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return next(new AppError('Messages array is required', 400));
    }

    const analysis = await Analysis.findOne({ _id: id as string, userId }).select('+textContent');

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

    // 1. Get or create the chat session
    const { ChatSession } = await import('../models/ChatSession.js');
    let chatSession = await ChatSession.findOne({ userId, analysisId: analysis._id });
    
    if (!chatSession) {
      chatSession = new ChatSession({ userId, analysisId: analysis._id, messages: [] });
    }

    // Add the new user message to the session
    const latestUserMessage = messages[messages.length - 1];
    if (latestUserMessage && latestUserMessage.role === 'user') {
      chatSession.messages.push({
        role: 'user',
        content: latestUserMessage.content,
        timestamp: new Date()
      });
    }

    const stream = streamChatWithContext(analysis.textContent, messages);

    let fullAssistantResponse = '';

    for await (const chunk of stream) {
      fullAssistantResponse += chunk;
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    // Save the assistant's full response to the database
    if (fullAssistantResponse) {
      chatSession.messages.push({
        role: 'assistant',
        content: fullAssistantResponse,
        timestamp: new Date()
      });
      await chatSession.save();
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    // If headers are already sent, we can't use next(error) properly for JSON response
    // So we just close the stream with an error message
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: 'An error occurred during generation.' })}\n\n`);
    res.end();
  }
};

/**
 * POST /api/analyses/:id/match
 * Generate ATS match score against a job description or target role
 */
export const matchJobDescription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { targetRole, jobDescriptionText } = req.body;
    const userId = req.user!._id.toString();

    if (!targetRole && !jobDescriptionText) {
      return next(new AppError('Please provide either a targetRole or jobDescriptionText.', 400));
    }

    // 1. Get the original resume text
    const analysis = await Analysis.findOne({ _id: id as string, userId }).select('+textContent');
    if (!analysis || !analysis.textContent) {
      return next(new AppError('Analysis not found or still processing.', 404));
    }

    // 2. Import JobMatch dynamically to avoid circular dependencies if any, though it should be at the top.
    // For now, let's just require it since we didn't add it to imports at the top.
    const { JobMatch } = await import('../models/JobMatch.js');

    // 3. Check if we already ran this exact match
    const existingMatch = await JobMatch.findOne({
      userId,
      analysisId: analysis._id,
      ...(targetRole ? { targetRole } : {}),
      ...(jobDescriptionText ? { jobDescriptionText } : {}),
    });

    if (existingMatch) {
      return res.json({ success: true, data: existingMatch });
    }

    // 4. Generate the match via Gemini
    const { generateJobMatch } = await import('../services/geminiService.js');
    const matchResult = await generateJobMatch(analysis.textContent, targetRole, jobDescriptionText);

    // 5. Save to database
    const newMatch = await JobMatch.create({
      userId,
      analysisId: analysis._id,
      targetRole,
      jobDescriptionText,
      matchScore: matchResult.matchScore,
      missingKeywords: matchResult.missingKeywords,
      tailoredSuggestions: matchResult.tailoredSuggestions,
    });

    res.status(201).json({ success: true, data: newMatch });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analyses/:id/chats
 * Retrieve the chat history for a specific analysis
 */
export const getChatHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const { ChatSession } = await import('../models/ChatSession.js');
    const chatSession = await ChatSession.findOne({ userId, analysisId: id as string });

    if (!chatSession) {
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: chatSession.messages });
  } catch (error) {
    next(error);
  }
};
