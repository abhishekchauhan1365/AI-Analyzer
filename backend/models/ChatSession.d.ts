import mongoose, { Document, Model } from 'mongoose';
export interface IChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
export interface IChatSessionDoc extends Document {
    userId: mongoose.Types.ObjectId;
    analysisId: mongoose.Types.ObjectId;
    messages: IChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ChatSession: Model<IChatSessionDoc>;
//# sourceMappingURL=ChatSession.d.ts.map