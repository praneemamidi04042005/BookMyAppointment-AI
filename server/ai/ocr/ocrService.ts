import fs from 'node:fs/promises';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

export async function extractTextFromFile(filePath: string, mimeType: string) {
  if (mimeType === 'application/pdf') {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdfParse(buffer);
    return parsed.text;
  }

  const result = await Tesseract.recognize(filePath, 'eng');
  return result.data.text;
}
