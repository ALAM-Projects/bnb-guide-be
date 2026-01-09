import { UserDto } from './user.dto';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: string, dto: UserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
    });
  }
}
