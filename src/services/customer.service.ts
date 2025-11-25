import { getRepository } from 'typeorm';
import { Customer } from '../orm/entity/Customer';
import { NotFound } from '../utils/httpErrors';

export class CustomerService {
  private repo = getRepository(Customer);
  list() { return this.repo.find({ relations: ['address'] }); }
  get(id: number) { return this.repo.findOne(id, { relations: ['address'] }); }
  create(dto: Partial<Customer>) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: Partial<Customer>) {
    const e = await this.repo.findOne(id); if (!e) throw new NotFound('Customer not found');
    Object.assign(e, dto); return this.repo.save(e);
  }
  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFound('Customer not found');
  }
}
