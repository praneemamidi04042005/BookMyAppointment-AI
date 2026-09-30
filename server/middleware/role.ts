import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError.js';
import type { UserRole } from '../utils/constants.js';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }

    next();
  };
}
