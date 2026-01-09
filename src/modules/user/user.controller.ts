import { Body, Controller, Req } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiTags('Users')
  @Patch('updateUser')
  updateName(@Req() req: any, @Body() dto: UserDto) {
    const userId = req.user.sub;
    return this.userService.updateUser(userId, dto);
  }
}
