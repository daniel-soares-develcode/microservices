import { BadRequestException, Injectable } from '@nestjs/common'
import { Customer, Purchase } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { Topics } from '../../shared/enums/topics.enum'
import { KafkaService } from '../../shared/services/kafka.service'
import { CreatePurchaseDto } from './purchases.dto'

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService
  ) {}

  async create({ customerId, products }: CreatePurchaseDto): Promise<Purchase> {
    const purchase = await this.prismaService.purchase.create({
      data: {
        customerId,
        products: {
          connect: products.map(product => ({ id: product }))
        }
      },
      include: {
        customer: true,
        products: true
      }
    })

    this.kafkaService.emit(Topics.PURCHASE_CREATED, {
      id: purchase.id,
      customerId,
      products
    })

    return purchase
  }

  async findAll(userId: string): Promise<Purchase[]> {
    const customer = await this.findCustomerByUserId(userId)

    if (!customer) {
      throw new BadRequestException('Customer not found')
    }

    return await this.prismaService.purchase.findMany({
      where: { customerId: customer.id },
      include: {
        customer: true,
        products: true
      }
    })
  }

  async findOne(id: string) {
    return await this.prismaService.purchase.findUnique({
      where: { id }
    })
  }

  private async findCustomerByUserId(userId: string): Promise<Customer> {
    return this.prismaService.customer.findUnique({
      where: { userId }
    })
  }
}
