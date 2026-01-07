import { CustomerOrder } from '../../orm/entities/CustomerOrder';
import { OrderItem } from '../../orm/entities/OrderItem';
import { CustomerResponseDto } from './CustomerResponseDto';
import { ProductResponseDto } from './ProductResponseDto';

export class OrderItemResponseDto {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number; 
  product?: ProductResponseDto;

  constructor(entity: OrderItem) {
    this.id = entity.id;
    this.quantity = entity.quantity;
    this.unitPrice = Number(entity.unitPrice);
    this.totalPrice = this.quantity * this.unitPrice;

    if (entity.product) {
      this.product = new ProductResponseDto(entity.product);
    }
  }
}

export class OrderResponseDto {
  id: number;
  status: string;
  orderDate: Date;
  customer?: CustomerResponseDto;
  items: OrderItemResponseDto[];
  grandTotal: number;

  constructor(entity: CustomerOrder) {
    this.id = entity.id;
    this.status = entity.status;
    this.orderDate = entity.orderDate;

    if (entity.customer) {
      this.customer = new CustomerResponseDto(entity.customer);
    }

    this.items = entity.items 
      ? entity.items.map(item => new OrderItemResponseDto(item)) 
      : [];

    this.grandTotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}