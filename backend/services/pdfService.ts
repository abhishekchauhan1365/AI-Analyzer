import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  let parser;
  try {
    parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    const text = data.text
      .replace(/\n{3,}/g, '\n\n') // Collapse excessive newlines
      .trim();

    if (!text || text.length < 50) {
      throw new Error('Could not extract readable text from PDF. The file may be image-based or corrupted.');
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse PDF file.');
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};
