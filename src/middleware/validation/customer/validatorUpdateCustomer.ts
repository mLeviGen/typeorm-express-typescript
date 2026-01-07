import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorUpdateCustomer = (req: Request, _res: Response, next: NextFunction) => {
  const { name, phone, addressId, address } = req.body ?? {};

  if (name !== undefined && validator.isEmpty(String(name))) {
    throw new CustomError(400, 'Validation', 'Customer validation error', ['Customer name cannot be empty']);
  }

  if (phone !== undefined && validator.isEmpty(String(phone))) {
    throw new CustomError(400, 'Validation', 'Customer validation error', ['Phone cannot be empty']);
  }

  const resolvedAddressId = addressId ?? address;
  if (resolvedAddressId !== undefined && !validator.isInt(String(resolvedAddressId), { gt: 0 })) {
    throw new CustomError(400, 'Validation', 'Customer validation error', ['addressId must be a positive integer']);
  }

  return next();
};
