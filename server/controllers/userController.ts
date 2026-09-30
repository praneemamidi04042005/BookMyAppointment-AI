import type { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { AppError } from '../utils/appError.js';

export async function getProfile(req: Request, res: Response) {
  const user = await UserModel.findById(String(req.user?.id)).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user);
}

export async function updateProfile(req: Request, res: Response) {
  const user = await UserModel.findById(String(req.user?.id)).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { name, phone, location, preferredLanguage, avatarUrl } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;
  if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();

  res.json(user);
}
