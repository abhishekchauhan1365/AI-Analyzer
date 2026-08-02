const fs = require('fs');
const pdf = require('pdf-parse');

exports.extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Clean up text
    let text = data.text;
    text = text.replace(/\n/g, ' '); // Replace newlines with spaces
    text = text.replace(/\s+/g, ' '); // Remove extra spaces
    
    return text.trim();
  } catch (error) {
    throw new Error('Failed to parse PDF file');
  }
};
