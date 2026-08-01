import app from '../backend/app.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Pass the request directly to the Express application
  app(req as any, res as any);
}
