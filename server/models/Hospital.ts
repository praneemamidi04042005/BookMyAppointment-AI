import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const hospitalSchema = new Schema(
  {
    name: { type: String, required: true },
    adminUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, default: '' },
    contact: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, default: '' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    departments: [{ type: String }],
    specialties: [{ type: String }],
    doctorIds: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
    contactNumber: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Hospital = InferSchemaType<typeof hospitalSchema>;

export const HospitalModel = (mongoose.models.Hospital as Model<Hospital>) || mongoose.model<Hospital>('Hospital', hospitalSchema);
