export type CreateProductDto = {
  name: string;
  cheeseType?: string;          
  basePrice?: string | number;           
  isActive?: boolean;           
};

export type UpdateProductDto = Partial<CreateProductDto>;