import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerOrder } from './CustomerOrder';
import { CheeseProduct } from './CheeseProduct';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId!: number;

  @Column({ name: 'product_id', type: 'int' })
  productId!: number;

  @Column({ type: 'int', default: 1, unsigned: true })
  quantity!: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice!: string;

  @ManyToOne(() => CustomerOrder, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: CustomerOrder;

  @ManyToOne(() => CheeseProduct, (p) => p.orderItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product!: CheeseProduct;
}
