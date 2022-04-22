import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { Topics } from '../../shared/enums/topics.enum'
import { KafkaService } from '../../shared/services/kafka.service'
import { CreateUserDto, UpdateUserDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailExists = await this.findOneByEmail(createUserDto.email)

    if (emailExists) {
      throw new BadRequestException('Email already exists')
    }

    const user = await this.prismaService.user.create({ data: createUserDto })

    this.kafkaService.emit(Topics.USER_CREATED, {
      userId: user.id
    })

    return user
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany()
  }

  async findOne(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prismaService.user.update({ where: { id }, data: updateUserDto })
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } })
  }

  private async findOneByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { email } })
  }
}
