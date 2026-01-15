import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DBManager } from './database.manager';
import { UserRepository } from '@/modules/user/user.repository';

@Global()
@Module({
  providers: [PrismaService, DBManager, UserRepository],
  exports: [PrismaService, DBManager],
})
export class DatabaseModule {}
