import { GoogleGenAI } from '@google/genai';
import type { AnalysisResult } from '../types/analysis.js';



const PROMPTS: Record<string, (text: string) => string> = {
  Resume: (text: string) => `
You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.
Analyze the following resume thoroughly and return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "summary": "<2-3 sentence professional summary>",
  "estimatedYearsExperience": <number>,
  "targetRoles": ["<role1>"],
  "strengths": ["<strength1>"],
  "weaknesses": ["<weakness1>"],
  "suggestions": ["<suggestion1>"],
  "keywords": ["<keyword1>"],
  "skillCategories": [{ "category": "Technical", "skills": ["skill1"] }],
  "sections": {
    "experience": { "name": "Work Experience", "score": <0-100>, "feedback": "<feedback>" },
    "education": { "name": "Education", "score": <0-100>, "feedback": "<feedback>" },
    "skills": { "name": "Skills", "score": <0-100>, "feedback": "<feedback>" },
    "formatting": { "name": "Formatting", "score": <0-100>, "feedback": "<feedback>" },
    "summary": { "name": "Professional Summary", "score": <0-100>, "feedback": "<feedback>" }
  }
}
RESUME TEXT:
---
${text}
---
`,

  Sentiment: (text: string) => `
You are an expert sentiment analysis AI.
Analyze the following text and return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100 representing positivity>,
  "sentiment": "<Positive | Negative | Neutral | Mixed>",
  "summary": "<1-2 sentence explanation of the tone>",
  "strengths": ["<positive phrases/aspects>"],
  "weaknesses": ["<negative phrases/aspects>"],
  "suggestions": ["<how to make it more positive/neutral>"],
  "keywords": ["<key emotional words>"]
}
TEXT:
---
${text}
---
`,

  Grammar: (text: string) => `
You are an expert editor and grammarian.
Analyze the following text for grammar, spelling, and structural issues. Return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100 representing grammatical correctness>,
  "summary": "<1-2 sentence summary of the writing quality>",
  "strengths": ["<good grammatical aspects>"],
  "weaknesses": ["<list of specific grammar/spelling errors found>"],
  "suggestions": ["<how to fix the specific errors>"],
  "keywords": ["<key stylistic terms>"]
}
TEXT:
---
${text}
---
`,

  Readability: (text: string) => `
You are an expert in readability and communication.
Analyze the following text based on Flesch-Kincaid standards and general readability. Return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100 representing readability (higher is easier)>,
  "readabilityLevel": "<Elementary | Middle School | High School | College | Academic>",
  "summary": "<1-2 sentence summary of how easy this is to read>",
  "strengths": ["<aspects that aid readability>"],
  "weaknesses": ["<complex sentences, jargon, passive voice>"],
  "suggestions": ["<how to simplify the text>"],
  "keywords": ["<key concepts found>"]
}
TEXT:
---
${text}
---
`,

  Summarization: (text: string) => `
You are an expert summarization AI.
Read the following text and extract the most critical points. Return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100 representing information density>,
  "summary": "<1 paragraph executive summary of the entire text>",
  "strengths": ["<key takeaway 1>", "<key takeaway 2>"],
  "weaknesses": [],
  "suggestions": ["<follow up question 1>", "<follow up question 2>"],
  "keywords": ["<main topics>"]
}
TEXT:
---
${text}
---
`,

  Tone: (text: string) => `
You are an expert in communication tone and corporate communication.
Analyze the tone of the text. Return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100 representing professionalism>,
  "detectedTone": "<Professional | Casual | Aggressive | Passive | Urgent | Persuasive>",
  "summary": "<1-2 sentence summary of how the text comes across>",
  "strengths": ["<effective tonal choices>"],
  "weaknesses": ["<where the tone might fail or offend>"],
  "suggestions": ["<how to adjust the tone for a professional audience>"],
  "keywords": ["<words that drive the tone>"]
}
TEXT:
---
${text}
---
`,

  'Code Review': (text: string) => `
You are an expert Senior Software Engineer.
Review the following code snippet for bugs, performance, security, and best practices. Return ONLY a JSON object with this EXACT structure:
{
  "overallScore": <integer 0-100 representing code quality>,
  "summary": "<1-2 sentence summary of what the code does and its quality>",
  "strengths": ["<good practices used>"],
  "weaknesses": ["<bugs, vulnerabilities, or bad practices>"],
  "suggestions": ["<actionable refactoring advice>"],
  "keywords": ["<languages/frameworks detected>"]
}
CODE:
---
${text}
---
`
};

// Mock result for when no API key is configured
const getMockResult = (): AnalysisResult => ({
  overallScore: 74,
  atsScore: 68,
  summary:
    'A results-driven software engineer with hands-on experience in full-stack development. Demonstrates strong technical abilities and a passion for building scalable applications, though the resume could benefit from more quantified achievements.',
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
      feedback:
        'Experience section shows relevant roles but lacks quantified impact. Add metrics and use stronger action verbs.',
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
      feedback:
        'Summary is present but too generic. Tailor it to your target role with specific value propositions.',
    },
  },
});

export const analyzeText = async (text: string, analysisType: string = 'Resume'): Promise<any> => {
  // Fall back to mock if no API key
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[GeminiService] No GEMINI_API_KEY found. Returning mock analysis.');
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    return getMockResult();
  }

  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.models;
    
    console.log(`[GeminiService] Making API request to gemini-3.5-flash-lite via SDK for type: ${analysisType}...`);
    
    const promptBuilder = PROMPTS[analysisType] || PROMPTS['Resume'];
    if (!promptBuilder) {
      throw new Error(`Invalid analysis type: ${analysisType}`);
    }
    const finalPrompt = promptBuilder(text);

    const response = await model.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
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

    const result: AnalysisResult = JSON.parse(cleaned);
    return result;
  } catch (error) {
    console.error('[GeminiService] Error calling Gemini API:', error);
    console.warn('[GeminiService] Falling back to mock data due to API error.');
    return getMockResult();
  }
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const streamChatWithContext = async function* (documentText: string, messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
  if (!process.env.GEMINI_API_KEY) {
    yield "I am a mock streaming response because no API key is configured. You asked: ";
    yield messages[messages.length - 1]?.content || '';
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
  } catch (error) {
    console.error('[GeminiService] Error in streamChatWithContext:', error);
    yield "Sorry, I encountered an error while trying to answer that.";
  }
};

export interface JobMatchResult {
  matchScore: number;
  missingKeywords: string[];
  tailoredSuggestions: string[];
}

export const generateJobMatch = async (
  resumeText: string,
  targetRole?: string,
  jobDescriptionText?: string
): Promise<JobMatchResult> => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      matchScore: 65,
      missingKeywords: ['Agile', 'GraphQL', 'AWS'],
      tailoredSuggestions: ['Add metrics to your recent role.', 'Highlight leadership experience.'],
    };
  }

  const roleOrJdContext = jobDescriptionText
    ? `JOB DESCRIPTION:\n---\n${jobDescriptionText}\n---`
    : `TARGET ROLE: ${targetRole}`;

  const prompt = `
You are an expert ATS (Applicant Tracking System) and technical recruiter. 
Compare the provided Resume against the provided Job Description or Target Role.

Calculate a match score from 0 to 100 representing how well this candidate fits the role.
Extract a list of critical missing keywords that the ATS would look for but are absent in the resume.
Provide 3-5 specific, tailored suggestions on how to modify the resume to increase the match score.

Return ONLY a valid JSON object with the exact structure below. Do not use markdown fences.
{
  "matchScore": <integer 0-100>,
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "tailoredSuggestions": ["<suggestion1>", "<suggestion2>"]
}

${roleOrJdContext}

RESUME TEXT:
---
${resumeText}
---
`;

  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.models;
    
    const response = await model.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.2 },
    });

    const rawText = response.text ?? '';
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    return JSON.parse(cleaned) as JobMatchResult;
  } catch (error) {
    console.error('[GeminiService] Error calling Gemini for Job Match:', error);
    throw new Error('Failed to generate Job Match score');
  }
};
