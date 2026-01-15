import { Controller, NotFoundException } from '@nestjs/common';
import { ApiAction } from '@/shared/decorators/api-action.decorator';
import { DBManager } from '@/infrastructure/database/database.manager';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { User } from '@generated/prisma/client';
import { UserDto } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private dbManager: DBManager) {}

  @ApiAction('get', 'Users', 'getUser')
  @ApiOkResponse({ type: UserDto })
  async getUser(@GetUser() reqUser: User): Promise<UserDto> {
    const userId = reqUser.id;

    const user = await this.dbManager.users.findUnique({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserDto, user);
  }
}
