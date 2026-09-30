import { Router } from 'express';
import { getHealthTrends } from '../controllers/healthTrendController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/:patientId', protect, getHealthTrends);

export default router;
