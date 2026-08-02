export declare const analyzeText: (text: string, analysisType?: string) => Promise<any>;
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export declare const streamChatWithContext: (documentText: string, messages: ChatMessage[]) => AsyncGenerator<string, void, unknown>;
export interface JobMatchResult {
    matchScore: number;
    missingKeywords: string[];
    tailoredSuggestions: string[];
}
export declare const generateJobMatch: (resumeText: string, targetRole?: string, jobDescriptionText?: string) => Promise<JobMatchResult>;
//# sourceMappingURL=geminiService.d.ts.map