import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorCreateProduct = (req: Request, _res: Response, next: NextFunction) => {
  const { name, basePrice, cheeseType } = req.body ?? {};

  if (!name || validator.isEmpty(String(name))) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Product name is required']);
  }

  if (!cheeseType || validator.isEmpty(String(cheeseType))) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Cheese type is required']);
  }

  if (basePrice === undefined || basePrice === null || !validator.isFloat(String(basePrice), { gt: 0 })) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Price must be a number greater than 0']);
  }

  return next();
};