import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { loadEnv } from '../config/env.js';

const env = loadEnv();
const cloudinaryEnabled = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export async function storeReportFile(filePath: string, fileName: string) {
  if (cloudinaryEnabled) {
    const upload = await cloudinary.uploader.upload(filePath, {
      folder: env.CLOUDINARY_UPLOAD_FOLDER,
      resource_type: 'auto',
      public_id: path.parse(fileName).name,
    });

    return {
      fileUrl: upload.secure_url,
      provider: 'cloudinary' as const,
    };
  }

  return {
    fileUrl: `/uploads/${path.basename(filePath)}`,
    provider: 'local' as const,
  };
}
