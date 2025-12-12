import { Address } from '../../orm/entities/Address';

export class AddressResponseDto {
  id: number;
  city: string;
  address: string;
  country: string;

  constructor(entity: Address) {
    this.id = entity.id;
    this.city = entity.city;
    this.address = entity.address;
    this.country = entity.country;
  }
}