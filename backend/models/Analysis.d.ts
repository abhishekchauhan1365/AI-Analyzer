import mongoose, { Document, Model } from 'mongoose';
export interface IAnalysisDoc extends Document {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileSize: number;
    mimeType: string;
    analysisType: 'Resume' | 'Sentiment' | 'Grammar' | 'Readability' | 'Summarization' | 'Tone' | 'Code Review' | 'Custom';
    inputType: 'pdf' | 'text';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    errorMessage?: string;
    textContent?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Analysis: Model<IAnalysisDoc>;
//# sourceMappingURL=Analysis.d.ts.map