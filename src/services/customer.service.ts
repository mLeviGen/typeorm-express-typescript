import { getRepository, Repository } from 'typeorm';
import { Customer } from '../orm/entities/Customer';
import type { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

export class CustomerService {
  private get repo(): Repository<Customer> {
    return getRepository(Customer);
  }

  list(): Promise<Customer[]> {
    return this.repo.find({
      relations: ['address', 'orders'],
    });
  }

  get(id: number): Promise<Customer | undefined> {
    return this.repo.findOne(id, {
      relations: ['address', 'orders'],
    });
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer | null> {
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