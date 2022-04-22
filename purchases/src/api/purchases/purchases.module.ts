import { Module } from '@nestjs/common'

import { KafkaService } from '../../shared/services/kafka.service'
import { PurchasesController } from './purchases.controller'
import { PurchasesService } from './purchases.service'

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, KafkaService]
})
export class PurchasesModule {}
