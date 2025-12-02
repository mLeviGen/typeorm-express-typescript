export type CreateOrderItemDto = {
  productId: number;
  quantity: number;             
  unitPrice: string;           
};

export type OrderStatus = 'NEW' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export type CreateOrderDto = {
  customerId: number;           
  status?: OrderStatus;         
  items?: CreateOrderItemDto[]; 
};

export type UpdateOrderDto = Partial<{
  customerId: number;
  status: OrderStatus;
}>;