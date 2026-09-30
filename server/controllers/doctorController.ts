import type { Request, Response } from 'express';
import { DoctorModel } from '../models/Doctor.js';
import { AppError } from '../utils/appError.js';
import { searchDoctors } from '../services/doctorService.js';

export async function listDoctors(req: Request, res: Response) {
  const doctors = await searchDoctors({
    city: req.query.city as string | undefined,
    state: req.query.state as string | undefined,
    specialization: req.query.specialization as string | undefined,
    hospitalId: req.query.hospitalId as string | undefined,
    query: req.query.query as string | undefined,
  });

  res.json(doctors);
}

export async function getDoctorById(req: Request, res: Response) {
  const doctor = await DoctorModel.findById(req.params.id);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }
  res.json(doctor);
}

export async function updateAvailability(req: Request, res: Response) {
  const doctor = await DoctorModel.findById(req.params.id);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  doctor.availability = req.body.availability || doctor.availability;
  await doctor.save();
  res.json(doctor);
}
