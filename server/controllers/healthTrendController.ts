import type { Request, Response } from 'express';
import { buildHealthTrends } from '../services/trendService.js';

export async function getHealthTrends(req: Request, res: Response) {
  const trends = await buildHealthTrends(String(req.params.patientId));
  res.json(trends);
}
