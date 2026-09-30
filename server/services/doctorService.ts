import { DoctorModel } from '../models/Doctor.js';

export async function searchDoctors(filters: { city?: string; state?: string; specialization?: string; hospitalId?: string; query?: string }) {
  const query: Record<string, unknown> = { isActive: true };

  if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
  if (filters.state) query['location.state'] = new RegExp(filters.state, 'i');
  if (filters.specialization) query.specialization = new RegExp(filters.specialization, 'i');
  if (filters.hospitalId) query.hospitalId = filters.hospitalId;
  if (filters.query) {
    query.$or = [
      { name: new RegExp(filters.query, 'i') },
      { specialization: new RegExp(filters.query, 'i') },
      { hospitalName: new RegExp(filters.query, 'i') },
    ];
  }

  return DoctorModel.find(query).sort({ name: 1 }).lean();
}
