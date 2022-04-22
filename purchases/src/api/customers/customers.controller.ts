import { Controller, Get } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { Topics } from '../../shared/enums/topics.enum'
import { CreateCustomerDto } from './customers.dto'
import { CustomersService } from './customers.service'

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern(Topics.USER_CREATED)
  create(@Payload() payload: CreateCustomerDto) {
    this.customersService.create(payload.value.userId)
  }

  @Get()
  findAll() {
    return this.customersService.findAll()
  }
}
