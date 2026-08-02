const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeText: { type: String, required: true },
  jobDescription: { type: String, required: true },
  
  // Analysis Results
  atsScore: {
    overall: { type: Number, default: 0 },
    skillsMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    educationMatch: { type: Number, default: 0 },
    projectMatch: { type: Number, default: 0 }
  },
  
  matchedKeywords: [{ type: String }],
  missingKeywords: {
    programmingLanguages: [{ type: String }],
    frameworks: [{ type: String }],
    cloud: [{ type: String }],
    databases: [{ type: String }],
    softSkills: [{ type: String }],
    tools: [{ type: String }]
  },
  
  aiSuggestions: {
    overallReview: { type: String },
    weakPoints: [{ type: String }],
    strongPoints: [{ type: String }],
    grammarImprovements: [{ type: String }],
    formattingSuggestions: [{ type: String }],
    recommendedSkills: [{ type: String }]
  },
  
  summary: { type: String },
  coverLetter: { type: String }
  
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
