import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { loadEnv } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import symptomRoutes from './routes/symptomRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import healthTrendRoutes from './routes/healthTrendRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const env = loadEnv();
const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN?.split(',') ?? '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'bookmyappointment-ai-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-trends', healthTrendRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
