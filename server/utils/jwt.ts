import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';

const env = loadEnv();

export function signToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
}
