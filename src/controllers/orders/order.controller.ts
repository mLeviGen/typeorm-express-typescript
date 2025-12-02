import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../../services/order.service';
import type { CreateOrderDto, UpdateOrderDto } from '../../dto/order.dto';

export class OrderController {
  private orderService = new OrderService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.orderService.list();
      res.json(items);
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const order = await this.orderService.get(id);
      if (!order) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateOrderDto;
      const created = await this.orderService.create(dto);
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dto = req.body as UpdateOrderDto;
      const updated = await this.orderService.update(id, dto);
      if (!updated) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const success = await this.orderService.remove(id);
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