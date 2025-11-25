export type CreateProductDto = {
  name: string;
  cheeseType?: string;          
  basePrice?: string;           
  isActive?: boolean;           
};

export type UpdateProductDto = Partial<CreateProductDto>;