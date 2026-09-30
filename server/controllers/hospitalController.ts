import type { Request, Response } from 'express';
import { HospitalModel } from '../models/Hospital.js';
import { AppError } from '../utils/appError.js';
import { searchHospitals } from '../services/locationService.js';

export async function listHospitals(req: Request, res: Response) {
  const hospitals = await searchHospitals({
    city: req.query.city as string | undefined,
    state: req.query.state as string | undefined,
    pincode: req.query.pincode as string | undefined,
    query: req.query.query as string | undefined,
  });
  res.json(hospitals);
}

export async function getHospitalById(req: Request, res: Response) {
  const hospital = await HospitalModel.findById(req.params.id).populate('doctorIds');
  if (!hospital) {
    throw new AppError('Hospital not found', 404);
  }
  res.json(hospital);
}
