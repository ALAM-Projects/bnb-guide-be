import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { AtStrategy } from '@/core/auth/strategies/at.strategy';

@Module({
  providers: [UserService, UserRepository, AtStrategy],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
