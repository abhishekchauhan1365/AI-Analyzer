import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { upload, uploadAndAnalyze, getMyAnalyses, getAnalysisById, getAnalysisStatus, deleteAnalysis, chatWithDocument, } from '../controllers/analysisController.js';
const router = express.Router();
// All routes require authentication
router.use(protect);
router.post('/upload', upload.single('resume'), uploadAndAnalyze);
router.get('/', getMyAnalyses);
router.get('/:id', getAnalysisById);
router.get('/:id/status', getAnalysisStatus);
router.post('/:id/chat', chatWithDocument);
router.delete('/:id', deleteAnalysis);
export default router;
//# sourceMappingURL=analysisRoutes.js.map