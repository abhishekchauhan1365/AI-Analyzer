import mongoose, { Document, Model } from 'mongoose';
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
export declare const Analysis: Model<IAnalysisDoc>;
//# sourceMappingURL=Analysis.d.ts.map