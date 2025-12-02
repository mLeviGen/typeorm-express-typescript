import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Address } from './Address';
import { CustomerOrder } from './CustomerOrder';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string;

  @Column({ name: 'address_id', type: 'int', nullable: true })
  addressId?: number;

  @ManyToOne(() => Address, (a) => a.customers, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id' })
  address?: Address;

  @OneToMany(() => CustomerOrder, (o) => o.customer)
  orders!: CustomerOrder[];
}
