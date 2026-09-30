import type { UserRole } from '../utils/constants.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
      };
      file?: Express.Multer.File;
    }
  }
}

export {};
