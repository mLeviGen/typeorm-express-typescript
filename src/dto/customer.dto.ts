export type CreateCustomerDto = {
  name: string;
  phone?: string;
  addressId?: number;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto>;