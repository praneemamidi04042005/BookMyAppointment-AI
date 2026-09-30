import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { AppointmentStatuses } from '../utils/constants.js';

const appointmentSchema = new Schema(
  {
    appointmentId: { type: String, required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: Object.values(AppointmentStatuses), default: AppointmentStatuses.BOOKED },
    reason: { type: String, default: '' },
    notes: { type: String, default: '' },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true },
);

appointmentSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

export type Appointment = InferSchemaType<typeof appointmentSchema>;

export const AppointmentModel = (mongoose.models.Appointment as Model<Appointment>) || mongoose.model<Appointment>('Appointment', appointmentSchema);
