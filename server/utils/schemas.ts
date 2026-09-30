import { z } from 'zod';

const locationSchema = z.object({
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  area: z.string().optional().default(''),
  pincode: z.string().optional().default(''),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN']).default('PATIENT'),
  phone: z.string().optional().default(''),
  location: locationSchema.optional(),
  preferredLanguage: z.string().optional().default('English'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  location: locationSchema.optional(),
  preferredLanguage: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const reportUploadSchema = z.object({
  patientId: z.string().min(1),
  reportType: z.string().optional().default('General Report'),
  language: z.string().optional().default('English'),
  symptoms: z.string().optional().default(''),
});

export const symptomSchema = z.object({
  symptoms: z.string().min(3),
});

export const appointmentSchema = z.object({
  patientId: z.string().optional(),
  doctorId: z.string().min(1),
  hospitalId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  reason: z.string().optional(),
});

export const availabilitySchema = z.object({
  availability: z.array(
    z.object({
      date: z.string(),
      slots: z.array(z.string()),
    }),
  ),
});

export const aiAnalyzeSchema = z.object({
  filePath: z.string().min(1),
  mimeType: z.string().min(1),
  fileName: z.string().min(1),
  patientId: z.string().min(1),
  uploadedBy: z.string().min(1),
  uploadedByRole: z.string().min(1),
  reportType: z.string().min(1),
  language: z.string().optional(),
  symptoms: z.string().optional(),
});
