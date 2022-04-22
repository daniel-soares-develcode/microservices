import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
  create() {
    return 'This action adds a new notification'
  }

  findAll() {
    return `This action returns all notifications`
  }

  update(id: string, req: any) {
    return `This action updates a #${id} notification`
  }
}
