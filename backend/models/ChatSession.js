import mongoose, { Document, Model, Schema } from 'mongoose';
const chatMessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const chatSessionSchema = new Schema({
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
    messages: [chatMessageSchema],
}, {
    timestamps: true,
});
// We want fast lookup by analysisId to load history
chatSessionSchema.index({ userId: 1, analysisId: 1 }, { unique: true });
export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
//# sourceMappingURL=ChatSession.js.map