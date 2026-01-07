import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../../services/customer.service';
import { CustomerResponseDto } from '../../dto/response/CustomerResponseDto';
import type { CreateCustomerDto, UpdateCustomerDto } from '../../dto/customer.dto';

export class CustomerController {
  private customerService = new CustomerService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.customerService.list();
      res.json(items.map(item => new CustomerResponseDto(item)) );
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const customer = await this.customerService.get(id);
      if (!customer) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(new CustomerResponseDto(customer));
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as any;
      const dto: CreateCustomerDto = {
        name: body.name,
        phone: body.phone,
        addressId: body.addressId ?? body.address,
      };
      const created = await this.customerService.create(dto);
      res.status(201).json(new CustomerResponseDto(created));
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const body = req.body as any;
      const dto: UpdateCustomerDto = {
        ...body,
        addressId: body.addressId ?? body.address,
      };
      const updated = await this.customerService.update(id, dto);
      if (!updated) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(new CustomerResponseDto(updated));
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const success = await this.customerService.remove(id);
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