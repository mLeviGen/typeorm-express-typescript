import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorUpdateAddress = (req: Request, _res: Response, next: NextFunction) => {
  const { address, city, country } = req.body ?? {};

  if (address !== undefined && validator.isEmpty(String(address))) {
    throw new CustomError(400, 'Validation', 'Address validation error', ['Address cannot be empty']);
  }

  if (city !== undefined && validator.isEmpty(String(city))) {
    throw new CustomError(400, 'Validation', 'Address validation error', ['City cannot be empty']);
  }

  if (country !== undefined && validator.isEmpty(String(country))) {
    throw new CustomError(400, 'Validation', 'Address validation error', ['Country cannot be empty']);
  }

  return next();
};