import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Customer } from './Customer';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @OneToMany(() => Customer, (c) => c.address)
  customers!: Customer[];
}

