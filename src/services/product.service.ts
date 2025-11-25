import { getRepository } from 'typeorm';
import { CheeseProduct } from '../orm/entity/CheeseProduct';
import { NotFound } from '../utils/httpErrors';

export class ProductService {
  private repo = getRepository(CheeseProduct);
  list() { return this.repo.find(); }
  get(id: number) { return this.repo.findOne(id); }
  create(dto: Partial<CheeseProduct>) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: Partial<CheeseProduct>) {
    const e = await this.repo.findOne(id); if (!e) throw new NotFound('Product not found');
    Object.assign(e, dto); return this.repo.save(e);
  }
  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFound('Product not found');
  }
}
