import type { Request, Response } from 'express';
import { analyzeAndStoreReport } from '../services/reportService.js';
import { recommendSpecialistFromSymptoms } from '../utils/symptomRecommendations.js';

export async function analyzeReportWithAI(req: Request, res: Response) {
  const result = await analyzeAndStoreReport({
    filePath: req.body.filePath,
    mimeType: req.body.mimeType,
    fileName: req.body.fileName,
    patientId: req.body.patientId,
    uploadedBy: req.body.uploadedBy,
    uploadedByRole: req.body.uploadedByRole,
    reportType: req.body.reportType,
    language: req.body.language,
    symptoms: req.body.symptoms,
  });

  res.json(result);
}

export async function recommendSpecialistAI(req: Request, res: Response) {
  res.json(recommendSpecialistFromSymptoms(String(req.body.symptoms || '')));
}
