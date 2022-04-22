export class CreateUserDto {
  value: {
    userId: string
  }
}

export class CreatePurchaseDto {
  value: {
    id: string
    customerId: string
    products: string[]
  }
}
