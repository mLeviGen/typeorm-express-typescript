import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export async function validatorCreateProduct(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const { name, basePrice, cheeseType } = req.body;

  if (!name || validator.isEmpty(name)) {
    const error = new CustomError(400, 'Validation', 'Product name is required');
    return next(error);
  }

  if (!cheeseType || validator.isEmpty(cheeseType)) {
    const error = new CustomError(400, 'Validation', 'Cheese type is required');
    return next(error);
  }

  if (!basePrice || !validator.isFloat(String(basePrice), { gt: 0 })) {
    const error = new CustomError(400, 'Validation', 'Price must be a number greater than 0');
    return next(error);
  }

  return next();
}