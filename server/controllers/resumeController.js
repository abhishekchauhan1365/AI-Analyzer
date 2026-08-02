const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const { extractTextFromPDF } = require('../utils/pdfParser');
const { analyzeResume, generateSummary, generateCoverLetter } = require('../services/geminiService');

exports.uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // 1. Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.path);
    
    // 2. Call Gemini API for analysis
    const analysis = await analyzeResume(resumeText, jobDescription);
    
    // 3. Generate Summary & Cover Letter optionally, or we can do it later
    const summary = await generateSummary(resumeText, jobDescription);
    const coverLetter = await generateCoverLetter(resumeText, jobDescription);

    // 4. Save to Database
    const newResume = await Resume.create({
      userId: req.user.id,
      resumeText,
      jobDescription,
      atsScore: analysis.atsScore,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      aiSuggestions: analysis.aiSuggestions,
      summary,
      coverLetter
    });

    // 5. Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json(newResume);
  } catch (error) {
    // Attempt to clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Ensure user owns this resume
    if (resume.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
