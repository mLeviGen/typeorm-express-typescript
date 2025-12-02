import { CheeseProduct } from '../../orm/entities/CheeseProduct';

export class ProductResponseDto {
  id: number;
  title: string;       
  cost: number;        
  available: boolean;  

  constructor(product: CheeseProduct) {
    this.id = product.id;
    this.title = product.name;
    this.cost = Number(product.basePrice); 
    this.available = product.isActive;
  }
}