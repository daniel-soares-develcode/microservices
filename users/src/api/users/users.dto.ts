import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
