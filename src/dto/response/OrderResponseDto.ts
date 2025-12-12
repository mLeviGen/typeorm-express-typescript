import { CustomerOrder } from '../../orm/entities/CustomerOrder';
import { OrderItem } from '../../orm/entities/OrderItem';
import { CustomerResponseDto } from './CustomerResponseDto';
import { ProductResponseDto } from './ProductResponseDto';

// Допоміжний клас для позиції в чеку
export class OrderItemResponseDto {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // Обчислюване поле (зручно для фронтенду)
  product?: ProductResponseDto;

  constructor(entity: OrderItem) {
    this.id = entity.id;
    this.quantity = entity.quantity;
    this.unitPrice = Number(entity.unitPrice);
    this.totalPrice = this.quantity * this.unitPrice; // Рахуємо суму позиції

    if (entity.product) {
      this.product = new ProductResponseDto(entity.product);
    }
  }
}

// Основний клас відповіді замовлення
export class OrderResponseDto {
  id: number;
  status: string;
  orderDate: Date;
  customer?: CustomerResponseDto;
  items: OrderItemResponseDto[];
  grandTotal: number; // Загальна сума чеку (зручно для списків)

  constructor(entity: CustomerOrder) {
    this.id = entity.id;
    this.status = entity.status;
    this.orderDate = entity.orderDate;

    // Конвертуємо клієнта
    if (entity.customer) {
      this.customer = new CustomerResponseDto(entity.customer);
    }

    // Конвертуємо список товарів
    this.items = entity.items 
      ? entity.items.map(item => new OrderItemResponseDto(item)) 
      : [];

    // Рахуємо загальну суму замовлення
    this.grandTotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}