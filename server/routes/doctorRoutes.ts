import { Router } from 'express';
import { getDoctorById, listDoctors, updateAvailability } from '../controllers/doctorController.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { availabilitySchema } from '../utils/schemas.js';

const router = Router();

router.get('/', listDoctors);
router.get('/:id', getDoctorById);
router.patch('/:id/availability', protect, validateBody(availabilitySchema), updateAvailability);

export default router;
