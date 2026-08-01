import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';

// Microservice Auth Middleware Logic
const verifyAuth = (req: VercelRequest): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup for Microservice
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const userId = verifyAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Text to rewrite is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      success: true,
      data: {
        rewrites: [
          "Spearheaded the development of X, resulting in a 20% increase in Y.",
          "Optimized critical systems to reduce latency by 15% across the platform.",
          "Led a cross-functional team to deliver project Z two weeks ahead of schedule."
        ]
      }
    });
  }

  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.models;
    
    const prompt = `
You are an expert resume writer. The user has provided a weak, generic bullet point from their resume.
Rewrite it into 3 highly professional, impactful, and metric-driven alternatives.
Do not include any pleasantries or extra text. Return ONLY a JSON array of 3 strings.

ORIGINAL BULLET POINT: "${text}"

EXPECTED OUTPUT FORMAT EXACTLY:
[
  "First alternative...",
  "Second alternative...",
  "Third alternative..."
]
`;

    const response = await model.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    const rawText = response.text ?? '[]';
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    
    let rewrites = [];
    try {
      rewrites = JSON.parse(cleaned);
    } catch (e) {
      // Fallback if AI didn't return valid JSON
      rewrites = cleaned.split('\n').filter(l => l.trim().length > 0).map(l => l.replace(/^- /, '').replace(/^"|"$/g, '').trim());
    }

    res.status(200).json({
      success: true,
      data: { rewrites }
    });
  } catch (error) {
    console.error('[Microservice:Rewrite] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to rewrite bullet point' });
  }
}
