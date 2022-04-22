import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  customerId: string

  @IsArray()
  @IsNotEmpty()
  products: string[]
}
