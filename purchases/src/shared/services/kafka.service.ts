import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class KafkaService extends ClientKafka implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    super({
      client: {
        clientId: configService.get('kafka.clientId'),
        brokers: [configService.get('kafka.broker')]
      },
      consumer: {
        groupId: configService.get('kafka.groupId')
      }
    })
  }

  async onModuleInit() {
    await this.connect()
  }

  async onModuleDestroy() {
    await this.close()
  }
}
