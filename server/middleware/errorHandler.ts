import type { NextFunction, Request, Response } from 'express';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  const statusCode = typeof (error as { statusCode?: number })?.statusCode === 'number'
    ? (error as { statusCode?: number }).statusCode!
    : 500;

  res.status(statusCode).json({ message });
}
