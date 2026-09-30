import { Router } from 'express';
import { analyzeReportWithAI, recommendSpecialistAI } from '../controllers/aiController.js';
import { validateBody } from '../middleware/validate.js';
import { aiAnalyzeSchema, symptomSchema } from '../utils/schemas.js';

const router = Router();

router.post('/analyze-report', validateBody(aiAnalyzeSchema), analyzeReportWithAI);
router.post('/recommend-specialist', validateBody(symptomSchema), recommendSpecialistAI);

export default router;
