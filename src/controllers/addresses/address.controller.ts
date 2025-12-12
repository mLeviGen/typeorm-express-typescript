import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../../services/address.service';
import { AddressResponseDto } from '../../dto/response/AddressResponseDto';
import type { CreateAddressDto, UpdateAddressDto } from '../../dto/address.dto';

export class AddressController {
  private addressService = new AddressService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.addressService.list();
      res.json(items.map(item => new AddressResponseDto(item)));
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const addr = await this.addressService.get(id);
      if (!addr) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(new AddressResponseDto(addr));
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateAddressDto;
      const created = await this.addressService.create(dto);
      res.status(201).json(new AddressResponseDto(created));
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dto = req.body as UpdateAddressDto;
      const updated = await this.addressService.update(id, dto);
      if (!updated) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(new AddressResponseDto(updated));
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const success = await this.addressService.remove(id);
      if (!success) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }
}