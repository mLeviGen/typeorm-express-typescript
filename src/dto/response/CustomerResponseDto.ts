import { Customer } from '../../orm/entities/Customer';
import { AddressResponseDto } from './AddressResponseDto';

export class CustomerResponseDto {
  id: number;
  name: string;
  phone: string;
  address?: AddressResponseDto; 

  constructor(entity: Customer) {
    this.id = entity.id;
    this.name = entity.name;
    this.phone = entity.phone;
    
    if (entity.address) {
      this.address = new AddressResponseDto(entity.address);
    }
  }
}