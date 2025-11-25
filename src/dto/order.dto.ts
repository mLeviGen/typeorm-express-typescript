export type CreateOrderItemDto = {
  productId: number;
  quantity: number;             // >=1; в БД default 1
  unitPrice: string;            // decimal как строка
};

export type OrderStatus = 'NEW' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export type CreateOrderDto = {
  customerId: number;           // FK -> Customer.id
  status?: OrderStatus;         // default 'NEW'
  items?: CreateOrderItemDto[]; // можно пустой массив или не передавать
};

export type UpdateOrderDto = Partial<{
  customerId: number;
  status: OrderStatus;
}>;