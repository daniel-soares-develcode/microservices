import { Injectable, NotFoundException } from '@nestjs/common'
import { Product } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { CreateProductDto, UpdateProductDto } from './products.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prismaService.product.create({
      data: createProductDto
    })
  }

  async findAll(): Promise<Product[]> {
    return await this.prismaService.product.findMany()
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prismaService.product.findUnique({
      where: { id }
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id)
    return await this.prismaService.product.update({
      where: { id },
      data: updateProductDto
    })
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.product.delete({
      where: { id }
    })
  }
}
