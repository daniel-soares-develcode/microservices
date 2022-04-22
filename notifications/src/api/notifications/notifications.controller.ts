import { Controller, Get, Param, Patch, Req } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { SlackService } from 'nestjs-slack'

import { Topics } from '../../shared/enums/topics.enum'
import { CreatePurchaseDto, CreateUserDto } from './notifications.dto'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly slackService: SlackService
  ) {}

  @MessagePattern(Topics.USER_CREATED)
  createUserNotification(@Payload() payload: CreateUserDto) {
    const message = `New user user: ${payload.value.userId}`
    this.slackService.sendText(message)
  }

  @MessagePattern(Topics.PURCHASE_CREATED)
  createPurchaseNotification(@Payload() payload: CreatePurchaseDto) {
    const message = `New purchase: ${payload.value.id} - ${
      payload.value.customerId
    } - ${payload.value.products.join(', ')}`
    this.slackService.sendText(message)
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.update(id, req)
  }
}
