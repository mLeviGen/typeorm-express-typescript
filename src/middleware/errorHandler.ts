import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../utils/response/custom-error/CustomError';

/**
 * Central error handler.
 *
 * The boilerplate uses CustomError as the primary application error.
 * However, during development it's easy to accidentally throw a plain Error.
 * This handler keeps the API response predictable and prevents crashes.
 */
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.HttpStatusCode).json(err.JSON);
  }

  const anyErr = err as any;
  const status: number =
    (typeof anyErr?.status === 'number' && anyErr.status) ||
    (typeof anyErr?.httpCode === 'number' && anyErr.httpCode) ||
    500;

  const message: string = typeof anyErr?.message === 'string' ? anyErr.message : 'Internal Server Error';

  const fallback = new CustomError(status, 'Raw', message, null, anyErr);
  return res.status(fallback.HttpStatusCode).json(fallback.JSON);
};
