import { getRepository } from 'typeorm';
import { CustomerOrder } from '../orm/entity/CustomerOrder';
import { OrderItem } from '../orm/entity/OrderItem';
import { NotFound } from '../utils/httpErrors';

export class OrderService {
  private repo = getRepository(CustomerOrder);
  private itemRepo = getRepository(OrderItem);

  list() { return this.repo.find({ relations: ['customer','items','items.product'] }); }
  get(id: number) { return this.repo.findOne(id, { relations: ['customer','items','items.product'] }); }

  async create(dto: { customerId:number; status?: string; items?: Array<Partial<OrderItem>> }) {
    const order = await this.repo.save(this.repo.create({ customerId: dto.customerId, status: dto.status || 'NEW' }));
    if (dto.items?.length) {
      const items = dto.items.map(i => this.itemRepo.create({ ...i, orderId: order.id }));
      await this.itemRepo.save(items);
    }
    return this.get(order.id);
  }

  async update(id:number, dto: Partial<CustomerOrder>) {
    const e = await this.repo.findOne(id); if (!e) throw new NotFound('Order not found');
    Object.assign(e,dto); await this.repo.save(e); return this.get(id);
  }

  async remove(id:number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFound('Order not found');
  }
}
