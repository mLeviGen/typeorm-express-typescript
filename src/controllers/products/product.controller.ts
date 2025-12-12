import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../../services/product.service';
import { ProductResponseDto } from '../../dto/response/ProductResponseDto';
import { CreateProductDto, UpdateProductDto } from '../../dto/product.dto';

export class ProductController {
  private productService = new ProductService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.productService.list();
      const dtos = items.map(item => new ProductResponseDto(item));
      res.json(dtos);
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await this.productService.get(id);
      if (!item) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(new ProductResponseDto(item));
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateProductDto;
      const created = await this.productService.create(dto);
      res.status(201).json(new ProductResponseDto(created));
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dto = req.body as UpdateProductDto;
      const updated = await this.productService.update(id, dto);
      if (!updated) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(new ProductResponseDto(updated));
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const success = await this.productService.remove(id);
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