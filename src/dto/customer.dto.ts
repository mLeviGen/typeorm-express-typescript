export type CreateCustomerDto = {
  name: string;
  phone?: string;
  /** FK -> Address.id */
  addressId?: number;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto>;