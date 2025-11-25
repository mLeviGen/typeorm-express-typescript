import { getRepository } from 'typeorm';
import { Address } from '../orm/entity/Address';

export class AddressService {
  private repo = getRepository(Address);

  list() {
    return this.repo.find();
  }

  get(id: number) {
    return this.repo.findOne(id);
  }

  create(dto: Partial<Address>) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: Partial<Address>) {
    const entity = await this.repo.findOne(id);
    if (!entity) return null;
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    return !!res.affected;
  }
}
