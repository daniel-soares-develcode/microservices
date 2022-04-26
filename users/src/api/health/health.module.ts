import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { DbHealth } from './db.health'
import { HealthController } from './health.controller'

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DbHealth]
})
export class HealthModule {}
