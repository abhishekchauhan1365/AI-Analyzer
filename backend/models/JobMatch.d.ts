import mongoose, { Document, Model } from 'mongoose';
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
export declare const JobMatch: Model<IJobMatchDoc>;
//# sourceMappingURL=JobMatch.d.ts.map