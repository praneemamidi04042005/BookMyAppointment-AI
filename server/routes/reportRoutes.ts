import { Router } from 'express';
import { analyzeReport, getReportById, getReportsForUser, uploadReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateBody } from '../middleware/validate.js';
import { reportUploadSchema } from '../utils/schemas.js';

const router = Router();

router.post('/upload', protect, upload.single('file'), validateBody(reportUploadSchema), uploadReport);
router.get('/user/:userId', protect, getReportsForUser);
router.get('/:id', protect, getReportById);
router.post('/:id/analyze', protect, analyzeReport);

export default router;
