import mongoose, { Document, Model, Schema } from 'mongoose';

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

const chatMessageSchema = new Schema<IChatMessage>(
  {
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
  },
  { _id: false }
);

const chatSessionSchema = new Schema<IChatSessionDoc>(
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
    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

// We want fast lookup by analysisId to load history
chatSessionSchema.index({ userId: 1, analysisId: 1 }, { unique: true });

export const ChatSession: Model<IChatSessionDoc> = mongoose.model<IChatSessionDoc>(
  'ChatSession',
  chatSessionSchema
);
