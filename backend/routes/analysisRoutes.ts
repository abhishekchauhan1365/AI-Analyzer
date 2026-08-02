import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  upload,
  uploadAndAnalyze,
  getMyAnalyses,
  getAnalysisById,
  getAnalysisStatus,
  deleteAnalysis,
  chatWithDocument,
  matchJobDescription,
  getChatHistory,
} from '../controllers/analysisController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/upload', upload.single('resume'), uploadAndAnalyze);
router.get('/', getMyAnalyses);
router.get('/:id', getAnalysisById);
router.get('/:id/status', getAnalysisStatus);
router.get('/:id/chats', getChatHistory);
router.post('/:id/chat', chatWithDocument);
router.post('/:id/match', matchJobDescription);
router.delete('/:id', deleteAnalysis);

export default router;
