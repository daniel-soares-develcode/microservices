import { Module } from '@nestjs/common'

import { KafkaService } from '../../shared/services/kafka.service'
import { CustomersController } from './customers.controller'
import { CustomersService } from './customers.service'

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, KafkaService]
})
export class CustomersModule {}
