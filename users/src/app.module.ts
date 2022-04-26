import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from 'nestjs-prisma'

import { HealthModule } from './api/health/health.module'
import { UsersModule } from './api/users/users.module'
import { JwtStrategy } from './shared/auth/jwt.strategy'
import env from './shared/env'
import { JwtGuard } from './shared/guards/jwt.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env]
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          prismaOptions: {
            log: ['error', 'warn'],
            datasources: { db: { url: configService.get('database') } }
          },
          explicitConnect: false
        }
      },
      inject: [ConfigService]
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret')
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    HealthModule
  ],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export class AppModule {}
