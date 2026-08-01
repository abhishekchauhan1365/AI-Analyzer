import { GoogleGenAI } from '@google/genai';
const ANALYSIS_PROMPT = (resumeText) => `
You are an expert resume reviewer and ATS (Applicant Tracking System) specialist with 15+ years of experience in HR and talent acquisition.

Analyze the following resume thoroughly and return a JSON object with this EXACT structure. Do not include any markdown, code fences, or extra text — return ONLY valid JSON.

{
  "overallScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "summary": "<2-3 sentence professional summary of the candidate>",
  "estimatedYearsExperience": <number>,
  "targetRoles": ["<role1>", "<role2>", "<role3>"],
  "strengths": ["<strength1>", "<strength2>", "<strength3>", "<strength4>", "<strength5>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>", "<actionable suggestion 4>", "<actionable suggestion 5>"],
  "keywords": ["<keyword1>", "<keyword2>", "...up to 15 important keywords found"],
  "skillCategories": [
    { "category": "Technical Skills", "skills": ["skill1", "skill2", "..."] },
    { "category": "Soft Skills", "skills": ["skill1", "skill2", "..."] },
    { "category": "Tools & Platforms", "skills": ["tool1", "tool2", "..."] }
  ],
  "sections": {
    "experience": { "name": "Work Experience", "score": <0-100>, "feedback": "<specific feedback>" },
    "education": { "name": "Education", "score": <0-100>, "feedback": "<specific feedback>" },
    "skills": { "name": "Skills", "score": <0-100>, "feedback": "<specific feedback>" },
    "formatting": { "name": "Formatting & Structure", "score": <0-100>, "feedback": "<specific feedback>" },
    "summary": { "name": "Professional Summary", "score": <0-100>, "feedback": "<specific feedback>" }
  }
}

Scoring guide:
- overallScore: Holistic quality of the resume (content, impact, relevance)
- atsScore: How well it would pass automated screening (keywords, formatting, structure)
- Section scores: Evaluate each section on completeness, clarity, and impact

RESUME TEXT:
---
${resumeText}
---
`;
// Mock result for when no API key is configured
const getMockResult = () => ({
    overallScore: 74,
    atsScore: 68,
    summary: 'A results-driven software engineer with hands-on experience in full-stack development. Demonstrates strong technical abilities and a passion for building scalable applications, though the resume could benefit from more quantified achievements.',
    estimatedYearsExperience: 3,
    targetRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Engineer'],
    strengths: [
        'Strong technical skill set across multiple programming languages',
        'Clear project experience demonstrating end-to-end ownership',
        'Education section is well-structured and relevant',
        'Good use of action verbs in experience descriptions',
        'Relevant side projects showcase initiative and passion',
    ],
    weaknesses: [
        'Lacks quantified impact metrics (e.g., "improved performance by X%")',
        'Professional summary is generic and could be more targeted',
        'Missing certifications or professional development activities',
    ],
    suggestions: [
        'Add specific numbers to your achievements (users served, performance gains, cost savings)',
        'Tailor your professional summary to your target role with relevant keywords',
        'Include links to GitHub, LinkedIn, or a portfolio website',
        'Add a certifications section if you have any relevant credentials',
        'Ensure consistent date formatting throughout the document',
    ],
    keywords: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'REST API',
        'MongoDB', 'SQL', 'Git', 'Agile', 'Docker',
    ],
    skillCategories: [
        {
            category: 'Technical Skills',
            skills: ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Express'],
        },
        {
            category: 'Soft Skills',
            skills: ['Problem Solving', 'Communication', 'Team Collaboration', 'Time Management'],
        },
        {
            category: 'Tools & Platforms',
            skills: ['Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'VS Code'],
        },
    ],
    sections: {
        experience: {
            name: 'Work Experience',
            score: 72,
            feedback: 'Experience section shows relevant roles but lacks quantified impact. Add metrics and use stronger action verbs.',
        },
        education: {
            name: 'Education',
            score: 85,
            feedback: 'Education is well-presented with degree, institution, and graduation date clearly listed.',
        },
        skills: {
            name: 'Skills',
            score: 78,
            feedback: 'Good range of technical skills. Consider categorizing them for easier ATS parsing.',
        },
        formatting: {
            name: 'Formatting & Structure',
            score: 70,
            feedback: 'Clean layout but ensure consistent formatting. Check font sizes and section spacing.',
        },
        summary: {
            name: 'Professional Summary',
            score: 62,
            feedback: 'Summary is present but too generic. Tailor it to your target role with specific value propositions.',
        },
    },
});
export const analyzeResume = async (resumeText) => {
    // Fall back to mock if no API key
    if (!process.env.GEMINI_API_KEY) {
        console.warn('[GeminiService] No GEMINI_API_KEY found. Returning mock analysis.');
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
        return getMockResult();
    }
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = genAI.models;
        console.log('[GeminiService] Making API request to gemini-3.5-flash-lite via SDK...');
        const response = await model.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: [{ role: 'user', parts: [{ text: ANALYSIS_PROMPT(resumeText) }] }],
            config: {
                temperature: 0.3,
                maxOutputTokens: 4096,
            },
        });
        const rawText = response.text ?? '';
        // Strip any accidental markdown code fences
        const cleaned = rawText
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();
        const result = JSON.parse(cleaned);
        return result;
    }
    catch (error) {
        console.error('[GeminiService] Error calling Gemini API:', error);
        console.warn('[GeminiService] Falling back to mock data due to API error.');
        return getMockResult();
    }
};
export const streamChatWithContext = async function* (documentText, messages) {
    if (!process.env.GEMINI_API_KEY) {
        yield "I am a mock streaming response because no API key is configured. You asked: ";
        yield messages[messages.length - 1].content;
        return;
    }
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = genAI.models;
        // Convert our internal message format to Gemini's format
        // And inject the document text into the very first system-like instruction
        const formattedContents = messages.map((msg, index) => {
            let text = msg.content;
            // Inject document context into the FIRST user message
            if (index === 0 && msg.role === 'user') {
                text = `You are an expert HR assistant and resume reviewer. You are helping a user understand a document (usually a resume or job description).
Use the following document text to answer the user's questions accurately. Keep your answers concise, professional, and directly related to the document.

DOCUMENT TEXT:
---
${documentText}
---

USER QUESTION: ${msg.content}`;
            }
            // Gemini roles are 'user' and 'model'
            return {
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text }]
            };
        });
        const responseStream = await model.generateContentStream({
            model: 'gemini-3.5-flash-lite',
            contents: formattedContents,
            config: {
                temperature: 0.5,
            },
        });
        for await (const chunk of responseStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    }
    catch (error) {
        console.error('[GeminiService] Error in streamChatWithContext:', error);
        yield "Sorry, I encountered an error while trying to answer that.";
    }
};
//# sourceMappingURL=geminiService.js.map