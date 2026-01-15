import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RtStrategy } from './strategies/rt.strategy';
import { AtStrategy } from './strategies/at.strategy';
import { MailService } from '@/shared/mail/mail.service';
import { MailModule } from '@/shared/mail/mail.module';
import { UserRepository } from '@/modules/user/user.repository';

@Module({
  imports: [JwtModule.register({}), MailModule],
  controllers: [AuthController],
  providers: [AuthService, RtStrategy, AtStrategy, MailService, UserRepository],
})
export class AuthModule {}
