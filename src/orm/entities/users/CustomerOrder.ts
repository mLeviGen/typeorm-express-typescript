import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { OrderItem } from './OrderItem';

@Entity({ name: 'customer_orders' })
export class CustomerOrder {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ name: 'order_date', type: 'timestamp', default: () => 'now()' })
  orderDate!: Date;

  @Column({ type: 'varchar', length: 20, default: 'NEW' })
  status!: 'NEW' | 'PAID' | 'SHIPPED' | 'CANCELLED';

  @Column({ name: 'customer_id', type: 'int' })
  customerId!: number;

  @ManyToOne(() => Customer, (c) => c.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: ['insert', 'update'] })
  items!: OrderItem[];
}
