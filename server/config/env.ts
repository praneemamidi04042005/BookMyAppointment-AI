import dotenv from 'dotenv';

dotenv.config();

export function loadEnv() {
  return {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmyappointment_ai',
    JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_UPLOAD_FOLDER: process.env.CLOUDINARY_UPLOAD_FOLDER || 'bookmyappointment-ai',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  };
}
