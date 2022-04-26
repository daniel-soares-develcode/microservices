import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator
} from '@nestjs/terminus'

import { Public } from '../../shared/decorators/public.decorator'
import { DbHealth } from './db.health'

@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly dbHealth: DbHealth,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.microservice.pingCheck('tcp', {
          transport: Transport.TCP,
          options: { host: 'localhost', port: this.configService.get('port') }
        }),
      async () => this.dbHealth.isHealthy(),
      async () => this.memory.checkHeap('memory heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory rss', 3000 * 1024 * 1024),
      async () =>
        this.disk.checkStorage('disk health', {
          threshold: 250 * 1024 * 1024 * 1024,
          path: '/'
        })
    ])
  }
}
