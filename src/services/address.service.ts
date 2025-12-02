import { getRepository, Repository } from 'typeorm';
import { Address } from '../orm/entities/Address';

import type { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto';

export class AddressService {
  private get repo(): Repository<Address> {
    return getRepository(Address);
  }

  list(): Promise<Address[]> {
    return this.repo.find({
      relations: ['customers'],
    });
  }

  get(id: number): Promise<Address | undefined> {
    return this.repo.findOne(id, {
      relations: ['customers'],
    });
  }

  async create(dto: CreateAddressDto): Promise<Address> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address | null> {
    const entity = await this.repo.findOne(id);
    if (!entity) return null;

    this.repo.merge(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return !!res.affected && res.affected > 0;
  }
}

