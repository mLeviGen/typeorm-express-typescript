import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_STATUSES = ['NEW', 'PAID', 'SHIPPED', 'CANCELLED'] as const;

export const validatorUpdateOrder = (req: Request, _res: Response, next: NextFunction) => {
  const { customerId, status } = req.body ?? {};

  if (customerId !== undefined && !validator.isInt(String(customerId), { gt: 0 })) {
    throw new CustomError(400, 'Validation', 'Order validation error', ['customerId must be a positive integer']);
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(String(status) as any)) {
    throw new CustomError(400, 'Validation', 'Order validation error', [
      `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    ]);
  }

  return next();
};