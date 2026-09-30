import { Router } from 'express';
import { recommendSpecialist } from '../controllers/symptomController.js';
import { validateBody } from '../middleware/validate.js';
import { symptomSchema } from '../utils/schemas.js';

const router = Router();

router.post('/recommend-specialist', validateBody(symptomSchema), recommendSpecialist);

export default router;
