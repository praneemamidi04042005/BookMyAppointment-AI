import bcrypt from 'bcryptjs';
import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { UserRoles } from '../utils/constants.js';

const locationSchema = new Schema(
  {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    area: { type: String, default: '' },
    pincode: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRoles), default: UserRoles.PATIENT },
    phone: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    location: { type: locationSchema, default: {} },
    preferredLanguage: { type: String, default: 'English' },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export type User = InferSchemaType<typeof userSchema> & {
  matchPassword(password: string): Promise<boolean>;
};

export const UserModel = (mongoose.models.User as Model<User>) || mongoose.model<User>('User', userSchema);
