import type { Request, Response } from 'express';
import { AppointmentModel } from '../models/Appointment.js';
import { AppError } from '../utils/appError.js';
import { bookAppointment, cancelAppointment } from '../services/appointmentService.js';

export async function listAppointments(req: Request, res: Response) {
  const query = req.user?.role === 'PATIENT' ? { patientId: req.user.id } : {};
  const appointments = await AppointmentModel.find(query).sort({ createdAt: -1 }).populate('doctorId hospitalId');
  res.json(appointments);
}

export async function createAppointment(req: Request, res: Response) {
  const appointment = await bookAppointment({
    patientId: req.body.patientId || req.user?.id || '',
    doctorId: req.body.doctorId,
    hospitalId: req.body.hospitalId,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    reason: req.body.reason,
  });

  res.status(201).json(appointment);
}

export async function getAppointmentById(req: Request, res: Response) {
  const appointment = await AppointmentModel.findById(req.params.id).populate('doctorId hospitalId');
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }
  res.json(appointment);
}

export async function cancelAppointmentHandler(req: Request, res: Response) {
  const appointment = await cancelAppointment(String(req.params.id), req.user?.id || '');
  res.json(appointment);
}
