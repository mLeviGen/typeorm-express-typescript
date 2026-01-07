import { getRepository, Repository } from 'typeorm';
import { CheeseProduct } from '../orm/entities/CheeseProduct';
import type { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

export class ProductService {
  private get repo(): Repository<CheeseProduct> {
    return getRepository(CheeseProduct);
  }

  list(): Promise<CheeseProduct[]> {
    return this.repo.find();
  }

  get(id: number): Promise<CheeseProduct | undefined> {
    return this.repo.findOne(id);
  }

  async create(dto: CreateProductDto): Promise<CheeseProduct> {
    const entity = this.repo.create({
      name: dto.name,
      cheeseType: dto.cheeseType,
      basePrice: dto.basePrice !== undefined && dto.basePrice !== null ? String(dto.basePrice) : '0',
      isActive: dto.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateProductDto): Promise<CheeseProduct | null> {
    const entity = await this.repo.findOne(id);
    if (!entity) return null;

    const patch: Partial<CheeseProduct> = {};

    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.cheeseType !== undefined) patch.cheeseType = dto.cheeseType;

    if (dto.basePrice !== undefined && dto.basePrice !== null) {
      patch.basePrice = String(dto.basePrice);
    }

    if (dto.isActive !== undefined) patch.isActive = dto.isActive;

    this.repo.merge(entity, patch);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return !!res.affected && res.affected > 0;
  }
}