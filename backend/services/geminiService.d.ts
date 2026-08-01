import type { AnalysisResult } from '../types/analysis.js';
export declare const analyzeResume: (resumeText: string) => Promise<AnalysisResult>;
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export declare const streamChatWithContext: (documentText: string, messages: ChatMessage[]) => AsyncGenerator<string, void, unknown>;
//# sourceMappingURL=geminiService.d.ts.map