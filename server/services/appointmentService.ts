import { nanoid } from 'nanoid';
import { AppointmentModel } from '../models/Appointment.js';
import { DoctorModel } from '../models/Doctor.js';
import { AppError } from '../utils/appError.js';
import { AppointmentStatuses } from '../utils/constants.js';

export type BookAppointmentInput = {
  patientId: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
};

export async function bookAppointment(input: BookAppointmentInput) {
  const doctor = await DoctorModel.findById(input.doctorId);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  const existingAppointment = await AppointmentModel.findOne({
    doctorId: input.doctorId,
    date: input.date,
    startTime: input.startTime,
    status: { $ne: AppointmentStatuses.CANCELLED },
  });

  if (existingAppointment) {
    throw new AppError('Selected slot is already booked', 409);
  }

  return AppointmentModel.create({
    appointmentId: `APT-${nanoid(10).toUpperCase()}`,
    patientId: input.patientId,
    doctorId: input.doctorId,
    hospitalId: input.hospitalId,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    reason: input.reason ?? '',
    status: AppointmentStatuses.BOOKED,
  });
}

export async function cancelAppointment(appointmentId: string, requesterId: string) {
  const appointment = await AppointmentModel.findOne({ appointmentId, patientId: requesterId });
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  appointment.status = AppointmentStatuses.CANCELLED;
  appointment.cancelledAt = new Date();
  await appointment.save();
  return appointment;
}
