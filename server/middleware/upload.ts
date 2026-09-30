import multer from 'multer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const uploadDirectory = path.resolve('uploads');
mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error('Only PDF, JPG, JPEG and PNG files are allowed'));
    return;
  }
  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
