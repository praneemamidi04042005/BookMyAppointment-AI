import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateProfileSchema } from '../utils/schemas.js';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateBody(updateProfileSchema), updateProfile);

export default router;
