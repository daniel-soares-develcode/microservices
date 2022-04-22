import { BadRequestException, Injectable } from '@nestjs/common'
import { Customer } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { KafkaService } from '../../shared/services/kafka.service'

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(userId: string): Promise<void> {
    const userExists = await this.findOneByUserId(userId)

    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    const customer = await this.prismaService.customer.create({ data: { userId } })

    this.kafkaService.emit('customer.created', {
      id: customer.id
    })
  }

  async findAll(): Promise<Customer[]> {
    return await this.prismaService.customer.findMany()
  }

  private async findOneByUserId(userId: string): Promise<Customer> {
    return this.prismaService.customer.findUnique({
      where: { userId }
    })
  }
}
