import { Module } from '@nestjs/common'

import { KafkaService } from '../../shared/services/kafka.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, KafkaService]
})
export class UsersModule {}
