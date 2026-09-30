import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError.js';
import { verifyToken } from '../utils/jwt.js';
import type { UserRole } from '../utils/constants.js';

export function protect(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Not authorized', 401);
  }

  const token = header.slice(7);
  const decoded = verifyToken(token);

  req.user = {
    id: String(decoded.id),
    role: String(decoded.role) as UserRole,
    email: String(decoded.email),
  };

  next();
}
