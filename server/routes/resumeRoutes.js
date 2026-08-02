const express = require('express');
const router = express.Router();
const { uploadAndAnalyze, getHistory, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/analyze', protect, upload.single('resume'), uploadAndAnalyze);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteResume);

module.exports = router;
