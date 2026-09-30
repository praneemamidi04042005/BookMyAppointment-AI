import type { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { signToken } from '../utils/jwt.js';

function sanitizeUser(user: any) {
  const plain = user.toObject ? user.toObject() : user;
  delete plain.password;
  return plain;
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role, phone, location, preferredLanguage } = req.body;
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const user = await UserModel.create({ name, email, password, role, phone, location, preferredLanguage });
  const token = signToken({ id: user._id, email: user.email, role: user.role });
  res.status(201).json({ token, user: sanitizeUser(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  res.json({ token, user: sanitizeUser(user) });
}
