import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity({ name: 'cheese_products' })
export class CheeseProduct {
  @PrimaryGeneratedColumn() id!: number;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'cheese_type', type: 'varchar', length: 80, nullable: true })
  cheeseType?: string;

  @Column({ name: 'base_price', type: 'numeric', precision: 10, scale: 2, default: 0 })
  basePrice!: string; 

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => OrderItem, (oi) => oi.product)
  orderItems!: OrderItem[];
}
