import mongoose, { Document, Model, Schema } from 'mongoose';
import type { AnalysisResult } from '../types/analysis.js';

export interface IAnalysisDoc extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: AnalysisResult;
  errorMessage?: string;
  textContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sectionScoreSchema = new Schema(
  {
    name: String,
    score: Number,
    feedback: String,
  },
  { _id: false }
);

const analysisSchema = new Schema<IAnalysisDoc>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    result: {
      overallScore: Number,
      atsScore: Number,
      summary: String,
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      keywords: [String],
      estimatedYearsExperience: Number,
      targetRoles: [String],
      skillCategories: [
        {
          category: String,
          skills: [String],
          _id: false,
        },
      ],
      sections: {
        experience: sectionScoreSchema,
        education: sectionScoreSchema,
        skills: sectionScoreSchema,
        formatting: sectionScoreSchema,
        summary: sectionScoreSchema,
      },
    },
    errorMessage: String,
    textContent: {
      type: String,
      select: false, // Don't return raw text by default
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user-based queries
analysisSchema.index({ userId: 1, createdAt: -1 });

export const Analysis: Model<IAnalysisDoc> = mongoose.model<IAnalysisDoc>(
  'Analysis',
  analysisSchema
);
