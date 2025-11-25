export type CreateAddressDto = {
  address: string;
  city?: string;
  country?: string;
};

export type UpdateAddressDto = Partial<CreateAddressDto>;