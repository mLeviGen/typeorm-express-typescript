import { getRepository, Repository } from 'typeorm';
import { CustomerOrder } from '../orm/entities/CustomerOrder';
import { OrderItem } from '../orm/entities/OrderItem';
import { Customer } from '../orm/entities/Customer';
import type { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';
import { CustomError } from '../utils/response/custom-error/CustomError';

const ORDER_RELATIONS = ['customer', 'customer.address', 'items', 'items.product'] as const;

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
      relations: [...ORDER_RELATIONS],
      order: { id: 'DESC' },
    });
  }

  get(id: number): Promise<CustomerOrder | undefined> {
    return this.orderRepo.findOne(id, {
      relations: [...ORDER_RELATIONS],
    });
  }

  async create(dto: CreateOrderDto): Promise<CustomerOrder> {
    const customer = await this.customerRepo.findOne(dto.customerId);

    if (!customer) {
      throw new CustomError(404, 'General', 'Not Found', [`Customer with id ${dto.customerId} not found`]);
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
          unitPrice: String(i.unitPrice),
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
      if (!newCustomer) {
        throw new CustomError(404, 'General', 'Not Found', [`Customer with id ${dto.customerId} not found`]);
      }
      order.customer = newCustomer;
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