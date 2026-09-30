import { Router } from 'express';
import { cancelAppointmentHandler, createAppointment, getAppointmentById, listAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { appointmentSchema } from '../utils/schemas.js';

const router = Router();

router.get('/', protect, listAppointments);
router.post('/book', protect, validateBody(appointmentSchema), createAppointment);
router.get('/:id', protect, getAppointmentById);
router.patch('/:id/cancel', protect, cancelAppointmentHandler);

export default router;
