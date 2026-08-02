import mongoose, { Document, Model, Schema } from 'mongoose';
const analysisSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: {
        type: String,
        required: true,
        default: 'Text Input',
    },
    fileSize: {
        type: Number,
        required: true,
        default: 0,
    },
    mimeType: {
        type: String,
        default: 'text/plain',
    },
    analysisType: {
        type: String,
        enum: ['Resume', 'Sentiment', 'Grammar', 'Readability', 'Summarization', 'Tone', 'Code Review', 'Custom'],
        default: 'Resume',
    },
    inputType: {
        type: String,
        enum: ['pdf', 'text'],
        default: 'text',
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    result: {
        type: Schema.Types.Mixed,
    },
    errorMessage: String,
    textContent: {
        type: String,
        select: false, // Don't return raw text by default
    },
}, {
    timestamps: true,
});
// Index for fast user-based queries
analysisSchema.index({ userId: 1, createdAt: -1 });
export const Analysis = mongoose.model('Analysis', analysisSchema);
//# sourceMappingURL=Analysis.js.map