import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_STATUSES = ['NEW', 'PAID', 'SHIPPED', 'CANCELLED'] as const;

export const validatorCreateOrder = (req: Request, _res: Response, next: NextFunction) => {
  const { customerId, status, items } = req.body ?? {};

  if (customerId === undefined || customerId === null || !validator.isInt(String(customerId), { gt: 0 })) {
    throw new CustomError(400, 'Validation', 'Order validation error', ['customerId must be a positive integer']);
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(String(status) as any)) {
    throw new CustomError(400, 'Validation', 'Order validation error', [
      `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    ]);
  }

  if (items !== undefined) {
    if (!Array.isArray(items)) {
      throw new CustomError(400, 'Validation', 'Order validation error', ['items must be an array']);
    }

    for (const [idx, item] of items.entries()) {
      const productId = item?.productId;
      const quantity = item?.quantity;
      const unitPrice = item?.unitPrice;

      if (productId === undefined || !validator.isInt(String(productId), { gt: 0 })) {
        throw new CustomError(400, 'Validation', 'Order validation error', [
          `items[${idx}].productId must be a positive integer`,
        ]);
      }

      if (quantity === undefined || !validator.isInt(String(quantity), { gt: 0 })) {
        throw new CustomError(400, 'Validation', 'Order validation error', [
          `items[${idx}].quantity must be a positive integer`,
        ]);
      }

      if (unitPrice === undefined || !validator.isFloat(String(unitPrice), { gt: 0 })) {
        throw new CustomError(400, 'Validation', 'Order validation error', [
          `items[${idx}].unitPrice must be a number greater than 0`,
        ]);
      }
    }
  }

  return next();
};
