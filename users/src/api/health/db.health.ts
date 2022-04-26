import { Injectable } from '@nestjs/common'
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class DbHealth extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super()
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const users = await this.prismaService.user.findMany()
    // o problema aqui é que se a tabela de usuários estiver vazia, o health check vai falhar
    // const isHealthy = !!users.length
    const isHealthy = !!users
    const result = this.getStatus('db check', isHealthy, { users: users.length })

    if (!isHealthy) throw new HealthCheckError('db check failed', result)

    return result
  }
}
