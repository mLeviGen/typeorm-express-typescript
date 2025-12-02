import { getRepository, Repository } from 'typeorm';
import { CustomerOrder } from '../orm/entities/CustomerOrder';
import { OrderItem } from '../orm/entities/OrderItem';
import { Customer } from '../orm/entities/Customer';
import type { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';

export class OrderService {
  private get orderRepo(): Repository<CustomerOrder> {
    return getRepository(CustomerOrder);
  }

  private get itemRepo(): Repository<OrderItem> {
    return getRepository(OrderItem);
  }

  private get customerRepo(): Repository<Customer> {
    return getRepository(Customer);
  }

  list(): Promise<CustomerOrder[]> {
    return this.orderRepo.find({
      relations: ['customer', 'customer.address', 'items', 'items.product'],
      order: { id: 'DESC' },
    });
  }

  get(id: number): Promise<CustomerOrder | undefined> {
    return this.orderRepo.findOne(id, {
      relations: ['customer', 'customer.address', 'items', 'items.product'],
    });
  }

  async create(dto: CreateOrderDto): Promise<CustomerOrder> {
    const customer = await this.customerRepo.findOne(dto.customerId);

    if (!customer) {
      const error = new Error(`Customer with id ${dto.customerId} not found`);
      (error as any).httpCode = 404;
      throw error;
    }

    const orderEntity = this.orderRepo.create({
      customer: customer,
      status: dto.status ?? 'NEW',
    });

    const order = await this.orderRepo.save(orderEntity);

    if (dto.items && dto.items.length > 0) {
      const items = dto.items.map(i =>
        this.itemRepo.create({
          order: { id: order.id },
          product: { id: i.productId },
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        }),
      );
      await this.itemRepo.save(items);
    }

    const full = await this.get(order.id);
    return full ?? order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<CustomerOrder | null> {
    const order = await this.orderRepo.findOne(id);
    if (!order) return null;

    if (dto.customerId) {
      const newCustomer = await this.customerRepo.findOne(dto.customerId);
      if (newCustomer) {
        order.customer = newCustomer;
      }
    }

    if (dto.status !== undefined) order.status = dto.status;

    await this.orderRepo.save(order);

    const full = await this.get(id);
    return full ?? order;
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.orderRepo.delete(id);
    return !!res.affected && res.affected > 0;
  }
}