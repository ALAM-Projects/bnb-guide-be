import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DBManager } from './database.manager';
import { UserRepository } from '@/modules/user/user.repository';
import { GuideRepository } from '@/modules/guide/guide.repository';

@Global()
@Module({
  providers: [PrismaService, DBManager, UserRepository, GuideRepository],
  exports: [PrismaService, DBManager],
})
export class DatabaseModule {}
