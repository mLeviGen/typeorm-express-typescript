import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../../services/address.service';
import type { CreateAddressDto, UpdateAddressDto } from '../../dto/address.dto';

const svc = new AddressService();

export const list = async (_: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.list()); } catch (e) { next(e); }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const x = await svc.get(+req.params.id);
    if (!x) return res.status(404).json({ message: 'Not found' });
    res.json(x);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json(await svc.create(req.body as CreateAddressDto)); }
  catch (e) { next(e); }
};

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const x = await svc.update(+req.params.id, req.body as UpdateAddressDto);
    if (!x) return res.status(404).json({ message: 'Not found' });
    res.json(x);
  } catch (e) { next(e); }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ok = await svc.remove(+req.params.id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
  } catch (e) { next(e); }
};
