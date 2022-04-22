import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import helmet from 'helmet'
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
  })

  const { httpAdapter } = app.get(HttpAdapterHost)
  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)

  const configService = app.get(ConfigService)
  const port = configService.get('port')

  app.enableCors()
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get('kafka.clientId'),
        brokers: [configService.get('kafka.broker')]
        // TODO: add sasl
        // sasl: {
        //   mechanism: 'plain',
        //   username: configService.get('kafka.username'),
        //   password: configService.get('kafka.password')
        // }
      },
      consumer: {
        groupId: configService.get('kafka.groupId')
      }
    }
  })

  console.log('[PURCHASES]: starting...')

  await app.startAllMicroservices()
  await app.listen(port).then(() => console.log(`[PURCHASES]: server is running on port ${port}`))
}

bootstrap()
