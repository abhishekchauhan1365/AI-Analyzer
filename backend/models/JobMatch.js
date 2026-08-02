import mongoose, { Document, Model, Schema } from 'mongoose';
const jobMatchSchema = new Schema({
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
}, {
    timestamps: true,
});
jobMatchSchema.index({ userId: 1, analysisId: 1 });
export const JobMatch = mongoose.model('JobMatch', jobMatchSchema);
//# sourceMappingURL=JobMatch.js.map