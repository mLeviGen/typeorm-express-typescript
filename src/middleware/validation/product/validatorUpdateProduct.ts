import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorUpdateProduct = (req: Request, _res: Response, next: NextFunction) => {
  const { name, cheeseType, basePrice, isActive } = req.body ?? {};

  if (name !== undefined && validator.isEmpty(String(name))) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Product name cannot be empty']);
  }

  if (cheeseType !== undefined && validator.isEmpty(String(cheeseType))) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Cheese type cannot be empty']);
  }

  if (basePrice !== undefined && !validator.isFloat(String(basePrice), { gt: 0 })) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Price must be a number greater than 0']);
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    throw new CustomError(400, 'Validation', 'Product validation error', ['isActive must be boolean']);
  }

  return next();
};
