import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const availabilitySchema = new Schema(
  {
    date: { type: String, required: true },
    slots: [{ type: String, required: true }],
  },
  { _id: false },
);

const doctorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    hospitalName: { type: String, required: true },
    department: { type: String, default: '' },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      area: { type: String, default: '' },
      pincode: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    experienceYears: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    languages: [{ type: String }],
    availability: [availabilitySchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Doctor = InferSchemaType<typeof doctorSchema>;

export const DoctorModel = (mongoose.models.Doctor as Model<Doctor>) || mongoose.model<Doctor>('Doctor', doctorSchema);
