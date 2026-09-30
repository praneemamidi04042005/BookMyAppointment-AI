import type { Request, Response } from 'express';
import { recommendSpecialistFromSymptoms } from '../utils/symptomRecommendations.js';

export async function recommendSpecialist(req: Request, res: Response) {
  const symptoms = String(req.body.symptoms || '');
  res.json(recommendSpecialistFromSymptoms(symptoms));
}
