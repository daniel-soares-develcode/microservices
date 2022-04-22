import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'

import { CreatePurchaseDto } from './purchases.dto'
import { PurchasesService } from './purchases.service'

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchasesService.create(createPurchaseDto)
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.purchasesService.findAll(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id)
  }
}
