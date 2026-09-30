import { HospitalModel } from '../models/Hospital.js';

export async function searchHospitals(filters: { city?: string; state?: string; pincode?: string; query?: string }) {
  const query: Record<string, unknown> = { isActive: true };

  if (filters.city) query.city = new RegExp(filters.city, 'i');
  if (filters.state) query.state = new RegExp(filters.state, 'i');
  if (filters.pincode) query.pincode = new RegExp(filters.pincode, 'i');
  if (filters.query) {
    query.$or = [
      { name: new RegExp(filters.query, 'i') },
      { address: new RegExp(filters.query, 'i') },
      { departments: new RegExp(filters.query, 'i') },
    ];
  }

  return HospitalModel.find(query).sort({ name: 1 }).lean();
}
