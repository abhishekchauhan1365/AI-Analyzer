import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJobMatchDoc extends Document {
  userId: mongoose.Types.ObjectId;
  analysisId: mongoose.Types.ObjectId;
  targetRole?: string;
  jobDescriptionText?: string;
  matchScore: number;
  missingKeywords: string[];
  tailoredSuggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const jobMatchSchema = new Schema<IJobMatchDoc>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
    },
    targetRole: {
      type: String,
      required: false,
    },
    jobDescriptionText: {
      type: String,
      required: false,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    tailoredSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

jobMatchSchema.index({ userId: 1, analysisId: 1 });

export const JobMatch: Model<IJobMatchDoc> = mongoose.model<IJobMatchDoc>(
  'JobMatch',
  jobMatchSchema
);
